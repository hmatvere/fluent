import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import axios from 'axios';
import { useRouter } from 'next/router';


export interface LeaderboardEntry {
    language: string,
    name: string;
    score: number;
  }  

const GameOver = () => {
    
    const [name, setName] = useState('');
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const router = useRouter();
    const score = router.query.score as string;
    const language = router.query.language as string;
  
    const submitHighScore = async (name: string, score: number, language: string) => {
        //just for testing
        if (isNaN(score)) {
            score = 1;
          }
          if (true) {
            language = 'Hindi';
          }
      
        try {
            console.log("score:",score)
            console.log("score:",language)
          const response = await axios.post('https://us-central1-subtle-seat-368211.cloudfunctions.net/expressApi/inputScoreToLeaderboard', {
            name,
            score,
            language
          });
        
          console.log("Submit high score response:", response.data);
        } catch (error) {
          console.error("Error submitting high score:", error);
          throw error;
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

        const transformedData = response.data.map((entry: any) => ({
            language: entry.Language,
            name: entry.Name,
            score: entry.Score
          }));

            // Sort the leaderboard data by score in descending order
            transformedData.sort((a: LeaderboardEntry, b: LeaderboardEntry) => b.score - a.score);

          setLeaderboard(transformedData);
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
              submitHighScore(name, Number(score), language);
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
          <table>
  <thead>
    <tr>
      <th>Score</th>
      <th>Name</th>
      <th>Language</th>
    </tr>
  </thead>
  <tbody>
    {leaderboard.map((entry, index) => (
      <tr key={index}>
        <td>{entry.score}</td>
        <td>{entry.name}</td>
        <td>{entry.language}</td>
      </tr>
    ))}
  </tbody>
</table>
        </div>
      </>
    );
  };
  
  export default GameOver;