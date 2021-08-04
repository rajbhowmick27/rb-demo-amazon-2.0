import { getSession, useSession } from "next-auth/client";
import Header from "../components/Header";
import moment from "moment";
import db from "../../firebase";
import Order from "../components/Order";

import { createSpeechlySpeechRecognition } from "@speechly/speech-recognition-polyfill";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { useDispatch, useSelector } from "react-redux";
import { getSearchQuery, setSearch } from "../slices/searchSlice";
import { getVoiceSearch, setVoiceSearch } from "../slices/voiceSlice";
import VoiceSearch from "../components/VoiceSearch";
import { useEffect } from "react";

const appId = "c74931e6-64d7-4a6b-a71d-c5ac0e5bab0e";
const SpeechlySpeechRecognition = createSpeechlySpeechRecognition(appId);
SpeechRecognition.applyPolyfill(SpeechlySpeechRecognition);

const orders = ({ orders }) => {
  const [session] = useSession();

  const { search } = useSelector(getSearchQuery);
  const voiceSearch = useSelector(getVoiceSearch);

  const dispatch = useDispatch();

  const commands = [
    {
      command: "*",
      callback: (finalTranscript) => {
        if (finalTranscript?.length !== 0)
          router.push("/search/" + finalTranscript);
        else router.push("/");
      },
    },
  ];

  const { transcript, resetTranscript, browserSupportsContinuousListening } =
    useSpeechRecognition({ commands });

  const openVoiceSearch = () => {
    dispatch(setVoiceSearch(true));
    if (browserSupportsContinuousListening)
      SpeechRecognition.startListening({
        continuous: true,
        autoStart: false,
        language: "en-IN",
      });
    else
      SpeechRecognition.startListening({
        continuous: false,
        autoStart: false,
        language: "en-IN",
      });
  };

  const closeVoiceSearch = () => {
    dispatch(setVoiceSearch(false));

    SpeechRecognition.stopListening();
    SpeechRecognition.abortListening();
    resetTranscript();

    dispatch(setSearch(""));
  };

  if (transcript.length > 0) {
    closeVoiceSearch();
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      if (voiceSearch === true) {
        closeVoiceSearch();
        alert("Please try again for voice search!! ");
      }
    }, 10000);

    return () => clearTimeout(timer);
  }, [voiceSearch, dispatch, closeVoiceSearch]);

  return (
    <div>
      {voiceSearch ? <VoiceSearch closeVoiceSearch={closeVoiceSearch} /> : null}
      <Header openVoiceSearch={openVoiceSearch} />

      <main className="max-w-screen-lg mx-auto p-10">
        <h1 className="text-3xl border-b mb-2 pb-1 border-yellow-400">
          Your Orders
        </h1>

        {session ? (
          <h2>
            {orders?.length} {orders?.length > 1 ? "Orders" : "Order"}
          </h2>
        ) : (
          <h2>Please sign in to see your Orders</h2>
        )}

        <div className="mt-5 space-y-4">
          {orders?.map(
            ({ id, amount, amountShipping, items, timestamp, images }) => (
              <Order
                key={id}
                id={id}
                amount={amount}
                amountShipping={amountShipping}
                items={items}
                timestamp={timestamp}
                images={images}
              />
            )
          )}
        </div>
      </main>
    </div>
  );
};

export default orders;

export async function getServerSideProps(context) {
  const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

  // Get the user's logged in credentials
  const session = await getSession(context);

  if (!session) {
    return {
      props: {},
    };
  }

  const stripeOrders = await db
    .collection("users")
    .doc(session.user.email)
    .collection("orders")
    .orderBy("timestamp", "desc")
    .get();

  // Stripe Orders
  const orders = await Promise.all(
    stripeOrders.docs.map(async (order) => ({
      id: order.id,
      amount: order.data().amount,
      amountShipping: order.data().amount_shipping,
      images: order.data().images,
      timestamp: moment(order.data().timestamp.toDate()).unix(),
      items: (
        await stripe.checkout.sessions.listLineItems(order.id, {
          limit: 100,
        })
      ).data,
    }))
  );

  return {
    props: {
      orders,
    },
  };
}
