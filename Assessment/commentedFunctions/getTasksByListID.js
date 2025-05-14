// import asyncHandler from 'express-async-handler';
// import db from '../../db.js';

// export const getTasksByListID = asyncHandler(async (req, res) => {
//   const listID = req.params.id;

//   try {
//     const result = await db.query(`SELECT tasks.*, tags.name AS tag_name
//        FROM tasks
//        JOIN tags ON tasks.tags_id = tags.id::text
//        WHERE tasks.list_id = $1 AND is_deleted = false`, 
//        [listID]);

//     if (result.rows.length === 0) {
//       return [];
//     }

//     res.status(200).json(result.rows); 
//   } catch (err) {
//     console.error("Error fetching data from PostgreSQL:", err);
//     res.status(500).json({ message: "Something went wrong" });
//   }
// });
