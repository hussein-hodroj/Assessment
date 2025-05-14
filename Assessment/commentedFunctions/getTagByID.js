// import asyncHandler from 'express-async-handler';
// import db from '../../db.js';

// export const getTagByID = asyncHandler(async (req, res) => {
//   const tagID = req.params.id;

//   try {
//     const result = await db.query('SELECT * FROM tags WHERE id = $1', [tagID]);

//     if (result.rows.length === 0) {
//       return res.status(404).json({ message: 'tag not found' });
//     }

//     res.status(200).json(result.rows[0]); 
//   } catch (err) {
//     console.error("Error fetching data from PostgreSQL:", err);
//     res.status(500).json({ message: "Something went wrong" });
//   }
// });
