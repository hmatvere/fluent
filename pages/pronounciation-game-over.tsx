import React, { useState, useEffect, useCallback } from 'react';

type LeaderboardEntry = {
  name: string;
  score: number;
};

const GameOver = ({ score }: { score: number }) => {
  const [name, setName] = useState('');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  const getLeaderBoard = useCallback(async (): Promise<LeaderboardEntry[]> => {
    const response = await fetch('https://us-central1-subtle-seat-368211.cloudfunctions.net/getLeaderboard', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch leaderboard data');
    }

    const data = await response.json();
    return data;
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getLeaderBoard();
      setLeaderboard(data);
    };

    fetchData();
  }, [getLeaderBoard]);

  const submitHighScore = async (name: string, score: number) => {
    const response = await fetch('https://us-central1-subtle-seat-368211.cloudfunctions.net/inputScoreToLeaderboard', {
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

  return (
    <>
      <h1>Game Over</h1>
      <h2>Your score: {score}</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submitHighScore(name, score);
        }}
      >
        <label>
          Your Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <button type="submit">Submit Score</button>
      </form>
      <h2>Leaderboard</h2>
      <ul>
        {leaderboard.map((entry, index) => (
          <li key={index}>
            {entry.name} - {entry.score}
          </li>
        ))}
      </ul>
    </>
  );
};

export default GameOver;