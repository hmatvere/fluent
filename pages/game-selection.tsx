/*
Author: Henri Matvere
*/

import Head from "next/head";
import Header from "../components/Header";
import { useRouter } from "next/router";
import React from "react";

type GameSelectionProps = {};

function GameSelection({}: GameSelectionProps) {
  const router = useRouter();

  const { lang } = router.query;
  console.log("lang:", lang);

  const handleGameSelection = (game: string) => {
    router.push({
      pathname: `/${game}`,
      query: { lang },
    });
  };

  return (
    <div className="bg-neutral-900 text-white h-screen snap-y snap-mandatory overflow-scroll z-0 scrollbar-hide">
      <Head>
        <title>Game Selection</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main className="max-w-3xl mx-auto py-8 text-center">
        <h3 className="uppercase tracking-[20px] text-[#00E7F2] text-2xl pt-40">
          Select a Game
        </h3>
        <div className="h-screen flex flex-col relative text-center md:text-left md:flex-row max-w-7xl p-10 justify-evenly mx-auto items-center">
          <div
            className="bg-[#000000] rounded-xl w-[300px] h-[300px] flex flex-col items-center justify-center duration-500 hover:scale-110 cursor-pointer"
            onClick={() => handleGameSelection("pronounciation-game")}
          >
            <h1 className="text-5xl font-bold text-white">Pronunciation</h1>
          </div>
          <div
            className="bg-[#000000] rounded-xl w-[300px] h-[300px] flex flex-col items-center justify-center duration-500 hover:scale-110 cursor-pointer"
            onClick={() => handleGameSelection("wordsearch")}
          >
            <h1 className="text-5xl font-bold text-white">Wordsearch</h1>
          </div>
        </div>
      </main>
      <footer className="absolute bottom-0 w-full text-center py-4">
        <a>
          <div className="text-sm text-gray-500">©2023 Fluent. All rights reserved.</div>
        </a>
      </footer>
    </div>
  );
}
  
  export default GameSelection;