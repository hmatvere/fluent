import React from 'react';
import BackgroundCircles from './BackgroundCircles';

const { useState, useEffect  } = React;

let DUN :boolean = false;
let an = "";

const MAX_TIME = 30;
const GameHin = () => {

    //Hindi Words
    const words = [
        
        {
            word: "aasha",
            hint: "Hope"
        },
        {
            word: "namaste",
            hint: "Hello or goodbye"
        },
        {
            word: "dhanyavaad",
            hint: "Thank you"
        },
        {
            word: "sundara",
            hint: "Beautiful"
        },
        {
            word: "zyaada kuch nahi",
            hint: "'Nothing Much'"
        },
        {
            word: "kaisa chal raha hai",
            hint: "'How are you?'"
        },
        {
            word: "Ap se milkar kushi hui",
            hint: "'Nice to meet you'"
        },
        {
            word: "paraakram",
            hint: "Courage"
        },
        {
            word: "raina",
            hint: "Night"
        },
        {
            word: "haan",
            hint: "Yes"
        },
        {
            word: "nahi",
            hint: "No"
        },
        {
            word: "chalo",
            hint: "'Let's go'"
        },
        {
            word: "ruko",
            hint: "Stop"
        },
        {
            word: "accha",
            hint: "Good"
        },
        {
            word: "khaana",
            hint: "Food"
        }

    ]
    const [word, setWord] = useState("");
    const [hint, setHint] = useState("No hint");
    const [answerWord, setAnswerWord] = useState("No answer");
    const [inputText, setInputText] = useState("enter a word");
    const [maxInputLength, setMaxInputLength] = useState(30);

    const startGame = () => {

        let randomWord = words[Math.floor(Math.random() * words.length)];
        //split word into array of letters
        let wordArray = randomWord.word.split("");
        for (let i = wordArray.length - 1; i > 0; i--) {
            //generate random number
            let j = Math.floor(Math.random() * (i + 1));
            //randomly shuffle word array into a new scrambled word
            [wordArray[i], wordArray[j]] = [wordArray[j], wordArray[i]];

        }
        //pass scrambled word as wordText
        setWord(wordArray.join(""));

        //pass relevant hint as hintText
        setHint(randomWord.hint);
        //pass relevant unscrambled version of the word
        setAnswerWord(randomWord.word.toLowerCase());
        an = randomWord.word.toLowerCase();
        setInputText("Enter a word...");
        //specify the max length of a guess as the length of the word in question
        setMaxInputLength(answerWord.length);
    }

    const Timer = () => {


        const [timeLeft, setTimeLeft] = useState(MAX_TIME);
        
        // useEffect hook to update the timer every second
        useEffect(() => {
            const interval = setInterval(() => {
                setTimeLeft((prevTimeElapsed) => prevTimeElapsed - 1);
            }, 1000);
            return () => clearInterval(interval); // clear interval on unmount
        }, []);
        
        return (
    
            <p className="time">Time Left: <span><b>{timeLeft}</b>s</span></p>
        );
        };


    function checkWord(){
        const _inputText = document.querySelector("input");
        //console.log(answerWord);
        if(_inputText?.value === answerWord){
            alert("Congratulations, you got the word right!");
            startGame();
        }
        else{
            alert("Wrong word");
        }
    }

    // useEffect hook to update the timer every second
    useEffect(() => {
        startGame();
        const dun = setTimeout(() => {
            alert(`You are out of time, ${an} was the answer`);
            startGame();
        }, MAX_TIME * 1000);
        //make sure it doesn't spam if we spam refresh
        return () => clearTimeout(dun);

    }, []);

    return (
        <div className="h-screen flex flex-col text-5xl font-bold text-white text-center bg-gray-900 space-y-8 ">
            <BackgroundCircles />
            <div className="content ">
                <h2>Unscramble</h2>
                <p className="word">{word}</p>
                <div className="details">
                    <p className="hint">Hint: {hint} <span></span></p>
                    <Timer/>
                </div>
                <input type="text" placeholder="Enter a valid word"/>
                <div className="buttons">
                    <button onClick = {checkWord} className="check-word">Check Word</button>
                </div>
            </div>
        </div>

    );
}

export default GameHin;

