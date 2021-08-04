import React from "react";
import { MicrophoneIcon, XCircleIcon } from "@heroicons/react/solid";

const VoiceSearch = ({ closeVoiceSearch }) => {
  return (
    <div className="fixed h-screen w-full pin z-50 overflow-auto bg-transparent flex">
      {/* Modal */}
      <div className="relative flex flex-col m-auto items-center w-2/3 rounded-lg shadow-lg bg-gradient-to-b from-gray-700 to-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 active:from-gray-500">
        {/* Header */}
        <div className="flex items-center w-full justify-between border-b border-blue-400 text-white">
          <div className="p-4 animate-pulse scale-150 ml-4">Listening...</div>
          <div>
            <XCircleIcon
              className="h-6 text-black mr-3"
              onClick={closeVoiceSearch}
            />
          </div>
        </div>

        {/* body */}
        <div className="h-36 flex items-center justify-center">
          <MicrophoneIcon className="h-16 p-3 rounded-full animate-pulse-fast scale-125 text-gray-600 bg-amazon_blue-light" />
        </div>
      </div>
    </div>
  );
};

export default VoiceSearch;
