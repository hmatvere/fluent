import React from "react";

type Props = {};

function Services({}: Props) {
  return (
    <div className="h-screen flex flex-col relative text-center md:text-left md:flex-row max-w-7xl p-10 justify-evenly mx-auto items-center">
      <h3 className="absolute top-24 uppercase tracking-[20px] text-[#00E7F2] text-#00E7F2 text-2xl pt-40">
        Languages We Currently Teach
      </h3>
      <div className="bg-[#000000] rounded-xl w-[300px] h-[300px] flex flex-col items-center justify-center duration-500 hover:scale-110">
        <h1 className="text-5xl font-bold">Hindi</h1>
      </div>
      <div className="bg-[#000000] rounded-xl w-[300px] h-[300px] flex flex-col items-center justify-center duration-500 hover:scale-110">
        <h1 className="text-5xl font-bold">Gujarati</h1>
      </div>
      <div className="bg-[#000000] rounded-xl w-[300px] h-[300px] flex flex-col items-center justify-center duration-500 hover:scale-110">
        <h1 className="text-5xl font-bold">Nepalese</h1>
      </div>
    </div>
  );
}

export default Services;
