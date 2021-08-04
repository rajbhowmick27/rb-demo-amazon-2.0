import Head from "next/head";
import { useEffect, useState } from "react";
import Banner from "../components/Banner";
import Header from "../components/Header";
import ProductFeed from "../components/ProductFeed";

import VoiceSearch from "../components/VoiceSearch";

import { createSpeechlySpeechRecognition } from "@speechly/speech-recognition-polyfill";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { useDispatch, useSelector } from "react-redux";
import { getSearchQuery, setSearch } from "../slices/searchSlice";
import { getVoiceSearch, setVoiceSearch } from "../slices/voiceSlice";
import { useRouter } from "next/router";

const appId = "c74931e6-64d7-4a6b-a71d-c5ac0e5bab0e";
const SpeechlySpeechRecognition = createSpeechlySpeechRecognition(appId);
SpeechRecognition.applyPolyfill(SpeechlySpeechRecognition);

export default function Home({ products }) {
  const { search } = useSelector(getSearchQuery);
  const voiceSearch = useSelector(getVoiceSearch);

  const dispatch = useDispatch();

  const router = useRouter();

  const commands = [
    {
      command: "*",
      callback: (finalTranscript) => {
        if(finalTranscript?.length !== 0)
          router.push('/search/'+finalTranscript)
        else
          router.push('/')
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
  }, [voiceSearch,dispatch,closeVoiceSearch]);

  
  const filteredProducts = products.filter((product) => 
    product.title.toLowerCase().includes(search?.toLowerCase() || "") || 
    product.category.toLowerCase() === (search?.toLowerCase() || "")
  );

  // useEffect(() => {}, [filteredProducts]);

  // if (!browserSupportsSpeechRecognition) {
  //   return (<span>Browser doesn't support speech recognition.</span>);
  // }

  return (
    <div className="bg-gray-100">
      <Head>
        <title>Amazon 2.0</title>
      </Head>

      {voiceSearch ? (
        <VoiceSearch
          closeVoiceSearch={closeVoiceSearch}
        />
      ) : null}

      {/* Header */}
      <Header
        openVoiceSearch={openVoiceSearch}
      />

      <main className="max-w-screen-xl mx-auto">
        {/* Banner */}
        <Banner />

        {/* Product Feed */}
        <ProductFeed products={filteredProducts} />
      </main>
    </div>
  );
}

export async function getServerSideProps(context) {
  const products = await fetch("https://fakestoreapi.com/products").then(
    (res) => res.json()
  );

  return {
    props: {
      products,
    },
  };
}
