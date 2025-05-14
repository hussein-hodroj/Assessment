// import asyncHandler from 'express-async-handler';
// import db from '../../db.js';

// export const getLogByID = asyncHandler(async (req, res) => {
//   const logID = req.params.id;

//   try {
//     const result = await db.query('SELECT * FROM logs WHERE id = $1', [logID]);

//     if (result.rows.length === 0) {
//       return res.status(404).json({ message: 'Log not found' });
//     }

//     res.status(200).json(result.rows[0]); // Return single log object
//   } catch (err) {
//     console.error("Error fetching data from PostgreSQL:", err);
//     res.status(500).json({ message: "Something went wrong" });
//   }
// });
