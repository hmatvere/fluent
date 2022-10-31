import React from "react";
import Image from "next/image";

type Props = {};

function Footer({}: Props) {
  return (
    <div>
      <footer className="text-center text-white">
        <div className="container p-6">
          <div className="grid lg:grid-cols-6 md:grid-cols-3 gap-4">
            <div className="lg:mb-0 mb-6">
              <img className="w-full rounded-md shadow-lg" src="" />
            </div>
            <div className="lg:mb-0 mb-6">
              <Image
                src="/../public/india.png"
                alt="Indian Flag"
                width={200}
                height={200}
              />
            </div>
            <div className="lg:mb-0 mb-6">
              <img className="w-full rounded-md shadow-lg" src="" />
            </div>
            <div className="lg:mb-0 mb-6">
              <img className="w-full rounded-md shadow-lg" src="" />
            </div>
            <div className="lg:mb-0 mb-6">
              <img className="w-full rounded-md shadow-lg" src="" />
            </div>
          </div>
        </div>
        <div className="text-center p-4 bg-rgba(0, 0, 0, 0.2);">
          © 2023 Copyright Fluent
        </div>
      </footer>
    </div>
  );
}

export default Footer;
