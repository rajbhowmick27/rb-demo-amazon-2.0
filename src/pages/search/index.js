import Link from "next/link";
import Header from "../../components/Header";

import { createSpeechlySpeechRecognition } from "@speechly/speech-recognition-polyfill";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { useDispatch, useSelector } from "react-redux";
import { getSearchQuery, setSearch } from "../../slices/searchSlice";
import { getVoiceSearch, setVoiceSearch } from "../../slices/voiceSlice";
import VoiceSearch from "../../components/VoiceSearch";
import { useEffect } from "react";

const appId = "c74931e6-64d7-4a6b-a71d-c5ac0e5bab0e";
const SpeechlySpeechRecognition = createSpeechlySpeechRecognition(appId);
SpeechRecognition.applyPolyfill(SpeechlySpeechRecognition);

const index = () => {
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
    <div className="h-screen bg-gray-100">
      {voiceSearch ? <VoiceSearch closeVoiceSearch={closeVoiceSearch} /> : null}
      <Header openVoiceSearch={openVoiceSearch} />
      <main className="max-w-screen-lg mx-auto">
        <div className="flex flex-col p-10">
          <h1 className="text-3xl border-b mb-2 pb-1 border-yellow-400">
            No Search Results
          </h1>

          <Link href="/">
            <button className="button">Go to Home</button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default index;
