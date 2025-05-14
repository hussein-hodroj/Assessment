import asyncHandler from 'express-async-handler';

import db from '../../db.js';

export const getTasks = asyncHandler(async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM tasks');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching data from PostgreSQL:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
});
