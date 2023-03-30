import React from 'react';

const { useState } = React;

const Countdown = () => {

    const [timeLeft, setTimeLeft] = useState(30);

    function tick(){
        setTimeLeft(timeLeft-1);
        if(timeLeft <= 0){
            //alert(`You are out of time, ${answerWord} was the answer`);
        }
    }

    function startTimer() {
        setInterval(tick, 1000);
    }
    startTimer();
    return (

        <p className="time">Time Left: <span><b>{timeLeft}</b>s</span></p>
    );
};

export default Countdown;
