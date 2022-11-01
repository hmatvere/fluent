import React from "react";

type Props = {};

function Footer({}: Props) {
  return (
    <div>
      <footer className="text-center text-white">
        <div className="text-center p-4 bg-rgba(0, 0, 0, 0.2);">
          ©2023 Copyright Fluent
        </div>
      </footer>
    </div>
  );
}

export default Footer;
