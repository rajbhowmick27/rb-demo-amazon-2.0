import Image from "next/image";
import { Transition } from "@tailwindui/react";
import Link from "next/link";

import {
  MenuIcon,
  SearchIcon,
  ShoppingCartIcon,
} from "@heroicons/react/outline";

import {
  MicrophoneIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  XCircleIcon,
} from "@heroicons/react/solid";
import { useState } from "react";

import { signIn, signOut, useSession } from "next-auth/client";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { selectItems } from "../slices/basketSlice";
import { getSearchQuery, setSearch } from "../slices/searchSlice";

const Header = ({ openVoiceSearch }) => {
  const [show, setShow] = useState(false);
  const { search } = useSelector(getSearchQuery);

  const router = useRouter();

  const dispatch = useDispatch();

  const handleChange = (e) => {
    dispatch(setSearch(e.target.value));
  };

  const clearSearch = () => {
    dispatch(setSearch(""));
    router.push("/");
  };

  const [session] = useSession();

  // retrieve the items from the store
  const { total } = useSelector(selectItems);

  const toggleShow = () => {
    setShow(!show);
  };

  return (
    <header>
      {/* Top Nav */}
      <div className="flex items-center bg-amazon_blue flex-grow py-2">
        <div className="mt-3 flex items-center flex-grow-0">
          <Image
            src="https://links.papareact.com/f90"
            onClick={() => {
              if (search?.length !== 0) {
                dispatch(setSearch(""));
              }
              router.push("/");
            }}
            width={150}
            height={40}
            objectFit="contain"
            className="cursor-pointer"
          />
        </div>

        {/* Search */}
        <div className="flex items-center flex-grow space-x-2">
          <div className="flex items-center h-10 rounded-md flex-grow cursor-pointer bg-yellow-400 hover:bg-yellow-500">
            <input
              className="p-2 h-full w-6 flex-grow flex-shrink rounded-l-md focus:outline-none px-4"
              type="text"
              placeholder="Search"
              value={search?.toLowerCase()}
              onChange={handleChange}
            />
            {search?.length > 0 && (
              <div className="bg-white flex items-center justify-center h-10">
                <XCircleIcon className="h-6 text-black" onClick={clearSearch} />
              </div>
            )}

            <SearchIcon className="h-12 p-4" onClick={handleChange} />
          </div>
          <MicrophoneIcon
            className="h-8 text-gray-300 cursor-pointer"
            onClick={openVoiceSearch}
          />
        </div>

        {/* Right */}
        <div className="text-white flex items-center text-xs space-x-2 sm:space-x-6 mx-2 sm:mx-6 whitespace-nowrap">
          {/* For small breakpoint */}

          {session ? (
            <div className="m-1 flex items-center justify-center sm:space-x-2 rounded-l-full rounded-r-full bg-black p-1 relative">
              <img
                loading="lazy"
                src={session.user.image}
                alt={session.user.name}
                width={40}
                height={40}
                objectFit="contain"
                className="rounded-full cursor-pointer"
              />
              <div className="flex items-center justify-center sm:p-1 cursor-pointer">
                <p className="hidden sm:block font-extrabold text-lg">
                  {session.user.name}
                </p>
                {show ? (
                  <ChevronUpIcon
                    onClick={toggleShow}
                    className="h-6 cursor-pointer"
                  />
                ) : (
                  <ChevronDownIcon
                    onClick={toggleShow}
                    className="h-6 cursor-pointer"
                  />
                )}
              </div>

              {/* Dropdown */}
              <Transition
                show={show}
                enter="transition ease-out duration-100 transform"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="transition ease-in duration-50 transform"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <div className="z-30 origin-top-right absolute right-0 w-48 py-2 mt-1 bg-black translate-y-3 rounded-lg shadow-md">
                  <Link href="#">
                    <a className="list_item">My Account</a>
                  </Link>
                  <Link href="/orders">
                    <a className="list_item">Orders</a>
                  </Link>
                  <Link href="/returns">
                    <a className="list_item">Returns</a>
                  </Link>
                  <Link href="#">
                    <a className="list_item" onClick={signOut}>
                      Log Out
                    </a>
                  </Link>
                </div>
              </Transition>
            </div>
          ) : (
            <>
              <div onClick={signIn} className="cursor-pointer link">
                <p className="hover:underline">Hello, Sign In</p>
                <p className="font-extrabold md:text-sm">Account & Lists</p>
              </div>

              <div className="cursor-pointer link">
                <p>Returns</p>
                <p className="font-extrabold md:text-sm">& Orders</p>
              </div>
            </>
          )}

          <div
            className="link relative flex items-center"
            onClick={() => router.push("/checkout")}
          >
            <span className="absolute top-0 right-0 md:right-10 h-4 w-4 bg-yellow-400 text-center rounded-full text-black font-bold">
              {total}
            </span>

            <ShoppingCartIcon className="h-8 sm:h-10" />
            <p className="hidden md:inline font-extrabold md:text-sm">Basket</p>
          </div>
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="flex items-center space-x-3 p-2 pl=6 bg-amazon_blue-light text-white text-sm">
        <p
          className="link flex items-center"
          onClick={() => {
            dispatch(setSearch(""));
            router.push("/");
          }}
        >
          <MenuIcon className="h-6 mr-1" />
          All
        </p>
        <p className="link" onClick={() => router.push("/search/Electronics")}>
          Electronics
        </p>
        <p
          className="link"
          onClick={() => router.push("/search/" + "Men's" + " Clothing")}
        >
          Men's Clothing
        </p>
        <p
          className="link"
          onClick={() => router.push("/search/" + "Women's" + " Clothing")}
        >
          Women's Clothing
        </p>
        <p
          className="link hidden sm:inline-flex"
          onClick={() => router.push("/search/Jewelery")}
        >
          Jewelery
        </p>
        <p className="link hidden sm:inline-flex">Amazon Business</p>
        <p className="link hidden sm:inline-flex">Prime</p>
        <p className="link hidden lg:inline-flex">Today's Deals</p>
        <p className="link hidden lg:inline-flex">Prime Video</p>
        <p className="link hidden lg:inline-flex">Health & Personal Care</p>
      </div>
    </header>
  );
};

export default Header;

// https://i.postimg.cc/4NTq5cM1/download.jpg
