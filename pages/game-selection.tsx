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
    <div className="h-screen flex flex-col relative text-center md:text-left md:flex-row max-w-7xl p-10 justify-evenly mx-auto items-center">
      <h3 className="absolute top-24 uppercase tracking-[20px] text-[#00E7F2] text-#00E7F2 text-2xl pt-40">
        Select a Game
      </h3>
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
  );
}

export default GameSelection;