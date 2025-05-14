import asyncHandler from 'express-async-handler';
import db from '../../db.js';

export const getLists = asyncHandler(async (req, res) => {
  try {
    const result = await db.query(
      `SELECT lists.id::text as list_id, 
              lists.name, 
              COALESCE(
                json_agg(
                  json_build_object(
                    'id', tasks.id::text,
                    'title', tasks.title,
                    'description', tasks.description,
                    'sort_order', tasks.sort_order,
                    'list_id', tasks.list_id,
                    'tag', tags.name
                  )
                ) FILTER (WHERE tasks.id IS NOT NULL AND is_deleted=false), '[]'::json
              ) AS tasks
       FROM lists
       LEFT JOIN tasks ON tasks.list_id = lists.id::text
       LEFT JOIN tags ON tags.id::text = tasks.tags_id

       GROUP BY lists.id`
    );

    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching data from PostgreSQL:", err);
    res.status(500).json({ message: "Something went wrong", error: err.message });
  }
});
