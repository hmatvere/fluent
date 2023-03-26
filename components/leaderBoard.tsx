/*
Author: Henri Matvere
*/

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { LeaderboardEntry } from '../pages/pronounciation-game-over';

const Leaderboard: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  const getLeaderBoard = useCallback(async (): Promise<LeaderboardEntry[]> => {
    try {
      const response = await axios.get('https://us-central1-subtle-seat-368211.cloudfunctions.net/getLeaderboard', {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch leaderboard data');
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getLeaderBoard();
      setLeaderboard(data);
    };

    fetchData();
  }, [getLeaderBoard]);

  return (
    <ul className="list-disc list-inside">
      {leaderboard.map((entry, index) => (
        <li key={index} className="text-lg mb-2">
          {entry.name} - {entry.score}
        </li>
      ))}
    </ul>
  );
};

export default Leaderboard;