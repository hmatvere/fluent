import React from "react";
import Link from "next/link";

type Props = {};

function Services({}: Props) {
  return (
    <div className="h-screen flex flex-col relative text-center md:text-left md:flex-row max-w-7xl p-10 justify-evenly mx-auto items-center">
      <h3 className="absolute top-24 uppercase tracking-[20px] text-[#00E7F2] text-#00E7F2 text-2xl pt-40">
        Languages We Currently Teach
      </h3>
      <Link href={{ pathname: '/game-selection', query: { lang: 'Hindi' } }}>
  <div className="bg-[#000000] rounded-xl w-[300px] h-[300px] flex flex-col items-center justify-center duration-500 hover:scale-110 cursor-pointer">
    <h1 className="text-5xl font-bold">Hindi</h1>
  </div>
</Link>
      <Link href="/game-selection">
        <div className="bg-[#000000] rounded-xl w-[300px] h-[300px] flex flex-col items-center justify-center duration-500 hover:scale-110 cursor-pointer">
          <h1 className="text-5xl font-bold">Gujarati</h1>
        </div>
      </Link>
      <Link href="/game-selection">
        <div className="bg-[#000000] rounded-xl w-[300px] h-[300px] flex flex-col items-center justify-center duration-500 hover:scale-110 cursor-pointer">
          <h1 className="text-5xl font-bold">Nepalese</h1>
        </div>
      </Link>
    </div>
  );
}

export default Services;