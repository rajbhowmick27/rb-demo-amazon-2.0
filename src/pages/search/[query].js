import Header from "../../components/Header";
import { useRouter } from "next/router";
import VoiceSearch from "../../components/VoiceSearch";
import Banner from "../../components/Banner";
import ProductFeed from "../../components/ProductFeed";
import { getSearchQuery, setSearch } from "../../slices/searchSlice";
import { useDispatch, useSelector } from "react-redux";
import { getVoiceSearch } from "../../slices/voiceSlice";
import { useEffect } from "react";
import Head from "next/head";

import { createSpeechlySpeechRecognition } from "@speechly/speech-recognition-polyfill";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";


const appId = "c74931e6-64d7-4a6b-a71d-c5ac0e5bab0e";
const SpeechlySpeechRecognition = createSpeechlySpeechRecognition(appId);
SpeechRecognition.applyPolyfill(SpeechlySpeechRecognition);

const search = ({products}) => {
    const router = useRouter();
    const query = router.query.query;

    const {search} = useSelector(getSearchQuery);
    const voiceSearch = useSelector(getVoiceSearch);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setSearch(query));
    },[query,dispatch])

    const commands = [
        {
          command: "*",
          callback: (finalTranscript) => {
            dispatch(setSearch(finalTranscript));
          },
        },
      ];
    
      const {
        transcript,
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
      }, [voiceSearch,dispatch]);

    const filteredProducts = products.filter((product) => 
    product.title.toLowerCase().includes(search?.toLowerCase() || "") || 
    product.category.toLowerCase() === (search?.toLowerCase() || "")
  );

  useEffect(() => {}, [filteredProducts]);

    return (
        <div className="bg-gray-100">
      <Head>
        <title>Amazon 2.0</title>
      </Head>

      {voiceSearch ? (
        <VoiceSearch closeVoiceSearch={closeVoiceSearch} />
      ) : null}

      {/* Header */}
      <Header openVoiceSearch={openVoiceSearch} />

      <main className="max-w-screen-xl mx-auto">
        {/* Banner */}
        <Banner />

        {/* Product Feed */}
        <ProductFeed products={filteredProducts} />
      </main>
    </div>
    );
}

export default search

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
