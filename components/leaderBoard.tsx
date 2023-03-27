/*
Author: Henri Matvere
*/

// import React, { useState, useEffect, useCallback } from 'react';
// import axios from 'axios';
// import { LeaderboardEntry } from '../pages/pronounciation-game-over';

// const Leaderboard: React.FC = () => {
//   const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

//   const getLeaderBoard = useCallback(async (): Promise<LeaderboardEntry[]> => {
//     try {
//       const response = await axios.get('https://us-central1-subtle-seat-368211.cloudfunctions.net/getLeaderboard', {
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });

//       return response.data;
//     } catch (error) {
//       console.error('Error fetching leaderboard data:', error);
//       throw new Error('Failed to fetch leaderboard data');
//     }
//   }, []);

//   useEffect(() => {
//     const fetchData = async () => {
//       const data = await getLeaderBoard();
//       setLeaderboard(data);
//     };

//     fetchData();
//   }, [getLeaderBoard]);

//   return (
//     <ul className="list-disc list-inside">
//       {leaderboard.map((entry, index) => (
//         <li key={index} className="text-lg mb-2">
//           {entry.name} - {entry.score}
//         </li>
//       ))}
//     </ul>
//   );
// };

// export default Leaderboard;

import React from 'react';
import { LeaderboardEntry } from '../pages/pronounciation-game-over';

export interface Props {
  leaderboard: LeaderboardEntry[];
}

const Leaderboard = ({ leaderboard }: Props) => {
  return (
    <table className="table-auto">
      <thead>
        <tr>
          <th className="px-4 py-2">#</th>
          <th className="px-4 py-2">Name</th>
          <th className="px-4 py-2">Score</th>
        </tr>
      </thead>
      <tbody>
        {leaderboard.map((entry, index) => (
          <tr key={index}>
            <td className="border px-4 py-2">{index + 1}</td>
            <td className="border px-4 py-2">{entry.name}</td>
            <td className="border px-4 py-2">{entry.score}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Leaderboard;