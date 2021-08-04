import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import CheckoutProduct from "../components/CheckoutProduct";
import Header from "../components/Header";
import { selectFinalPrice, selectItems } from "../slices/basketSlice";
import Currency from "react-currency-formatter";
import { useSession } from "next-auth/client";

import { createSpeechlySpeechRecognition } from "@speechly/speech-recognition-polyfill";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { getSearchQuery, setSearch } from "../slices/searchSlice";
import { getVoiceSearch, setVoiceSearch } from "../slices/voiceSlice";
import VoiceSearch from "../components/VoiceSearch";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";


const stripePromise = loadStripe(process.env.stripe_public_key);


const appId = "c74931e6-64d7-4a6b-a71d-c5ac0e5bab0e";
const SpeechlySpeechRecognition = createSpeechlySpeechRecognition(appId);
SpeechRecognition.applyPolyfill(SpeechlySpeechRecognition);


const checkout = () => {
  const [session] = useSession();

  const dispatch = useDispatch();

  const router = useRouter();

  const {search} = useSelector(getSearchQuery);
  const voiceSearch = useSelector(getVoiceSearch);

  const { items, total } = useSelector(selectItems);

  const CartValue = useSelector(selectFinalPrice);

  const commands = [
    {
      command: "*",
      callback: (finalTranscript) => {
        router.push('/search/'+finalTranscript)
      },
    },
  ];

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsContinuousListening,
  } = useSpeechRecognition({ commands });

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
  }, [voiceSearch]);

  // console.log(items);


  const createCheckoutSession = async () => {
     const stripe = await stripePromise;

     // Pull the backend to create a new checkout session
     const checkoutSession = await axios.post('/api/create-checkout-session',{
       items: items,
       email: session.user.email,
     })

     //Redirect user to Stripe CheckOut
     const result = await stripe.redirectToCheckout({
       sessionId: checkoutSession.data.id,
     })

     if(result.error){
       alert(result.error.message)
     }


  };

  return (
    <div className="bg-gray-100">

    {voiceSearch ? (
        <VoiceSearch closeVoiceSearch={closeVoiceSearch} />
      ) : null}

      <Header openVoiceSearch={openVoiceSearch} />

      <main className="lg:flex max-w-screen-xl mx-auto">
        {/* Left */}
        <div className="flex-grow m-5 shadow-sm">
          <Image
            src="https://links.papareact.com/ikj"
            width={1020}
            height={250}
            objectFit="contain"
          />

          <div className="flex flex-col p-5 space-y-10 bg-white">
            <h1 className="text-3xl border-b pb-4">
              {total === 0 ? "Your Amazon Basket is empty" : "Shopping Basket"}
            </h1>

            {items.map((item, i) => (
              <CheckoutProduct
                key={i}
                id={item.product.id}
                title={item.product.title}
                rating={item.product.rating}
                price={item.product.price}
                description={item.product.description}
                category={item.product.category}
                image={item.product.image}
                hasPrime={item.product.hasPrime}
              />
            ))}
          </div>
        </div>

        {/* Right */}
        {total > 0 && (
          <div className="flex flex-col bg-white p-10 shadow-md">
            {total > 0 && (
              <>
                <h2 className="whitespace-nowrap border-b pb-4">
                  Subtotal ({total} items) :
                  <span className="font-bold ml-2">
                    <Currency quantity={CartValue} currency="INR" />
                  </span>
                </h2>

                {items.map((item, i) => (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center justify-center">
                      {item.product.title} (x{item.cnt})
                    </div>
                    <div className="flex items-center justify-center">
                      <Currency
                        quantity={item.product.price * item.cnt}
                        currency="INR"
                      />
                    </div>
                  </div>
                ))}

                <button
                  role="link"
                  onClick={createCheckoutSession}
                  disabled={!session}
                  className={`button mt-2 ${
                    !session &&
                    "from-gray-300 to-gray-500 border-gray-200 text-gray-300 cursor-not-allowed"
                  }`}
                >
                  {!session ? "Sign in to CheckOut" : "Proceed to CheckOut"}
                </button>
              </>
            )}
          </div>

        )}
      </main>
    </div>
  );
};

export default checkout;
