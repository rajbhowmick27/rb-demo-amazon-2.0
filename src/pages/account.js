import { useSession } from "next-auth/client";
import Link from "next/link";
import Header from "../components/Header";

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

const account = () => {
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

      <main className="max-w-screen-xl mx-auto bg-gray-100 h-screen">
        <h1 className="text-3xl p-10 border-b mb-2 pb-1 border-yellow-400 font-bold">
          Your Account
        </h1>

        {session && (
          <div className="lg:flex">
            {/* left */}
            <div className="flex flex-col p-10">
              <div className="flex items-center mt-4 space-x-6">
                <img
                  src={session.user.image}
                  alt={session.user.name}
                  width={200}
                  height={200}
                  objectFit="contain"
                  className="rounded-full cursor-pointer"
                />

                <div className="flex flex-col items-start space-y-4">
                  <div className="flex items-center justify-center shadow-xl p-4 font-xl text-black font-bold">
                    {session.user.name}
                  </div>
                  <div className="flex items-center justify-center shadow-xl p-4 font-xl text-black font-bold">
                    {session.user.email}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center flex-grow mt-8 sm:mt-0">
              <div className="w-full flex flex-col items-center justify-center space-y-2 md:ml-12 sm:flex-grow-1">
                <Link href="/orders">
                  <button className="button w-3/4">Go to Orders</button>
                </Link>
                <Link href="/">
                  <button className="button w-3/4">Go to Home</button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default account;
