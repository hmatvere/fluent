
import React, { useState, useEffect } from 'react';
import ReactModal from 'react-modal';
import LANGUAGE_MAP from "../pages/hindi-page";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from '@fortawesome/free-solid-svg-icons';


type Props = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  language: string;
  setLanguage: React.Dispatch<React.SetStateAction<string>>;
};

const LanguageSelectModal: React.FC<Props> = ({
  isOpen,
  setIsOpen,
  language,
  setLanguage,
}) => {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [setIsOpen]);

  return (
    <>
      {isOpen && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 9999,
            backgroundColor: "rgba(0,0,0,0.5)",
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div className="bg-grey p-4 rounded-lg">
            <button onClick={() => setIsOpen(false)}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <h2 className="text-2xl font-bold mb-4">Select Language</h2>
            <select
              className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              {Object.keys(LANGUAGE_MAP).map((lang) => (
                <option key={lang} value={LANGUAGE_MAP[lang]}>
                  {lang}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </>
  );
};

export default LanguageSelectModal;