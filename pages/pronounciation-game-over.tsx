import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import axios from 'axios';

export interface LeaderboardEntry {
    name: string;
    score: number;
  }  

const GameOver = ({ score }: { score: number }) => {
    const [name, setName] = useState('');
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  
    const submitHighScore = async (name: string, score: number) => {
      const response = await fetch('https://us-central1-subtle-seat-368211.cloudfunctions.net/expressApi/inputScoreToLeaderboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, score }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to submit high score');
      }
    };
  
    async function fetchLeaderboard() {
      console.log('Fetching leaderboard data!');
      try {
        const response = await axios.get('https://us-central1-subtle-seat-368211.cloudfunctions.net/expressApi/getLeaderboard', {
            headers: {
                'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
				'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
			  },
        });
    
        console.log("leaderboard data:", response.data);
        setLeaderboard(response.data);
      } catch (error) {
        console.error("Error fetching leaderboard data:", error);
        throw error;
      }
    }
  
    useEffect(() => {
      fetchLeaderboard();
    }, []);
  
    return (
      <>
        <Head>
          <title>Game Over</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Header />
        <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-900 text-white">
          <h1 className="text-4xl font-bold mb-4">Game Over</h1>
          <h2 className="text-2xl font-bold mb-4">Your score: {score}</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submitHighScore(name, score);
            }}
          >
            <label className="mb-2">
              Your Name:
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="ml-2 p-2 bg-gray-800 border border-gray-700 rounded"
              />
            </label>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Submit Score
            </button>
          </form>
          <h2 className="text-2xl font-bold mb-4">Leaderboard</h2>
          <ul>
            {leaderboard.map((entry, index) => (
              <li key={index}>
                {entry.name} - {entry.score}
              </li>
            ))}
          </ul>
        </div>
      </>
    );
  };
  
  export default GameOver;