import asyncHandler from 'express-async-handler';
import { body, validationResult } from 'express-validator';
import dotenv from 'dotenv';
import db from '../../db.js';

dotenv.config();

export const createNewTag = asyncHandler(async (req, res) => {
  
  await Promise.all([
    body('name').notEmpty().isString().escape().run(req),
  ]);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log ("error in validation:", errors)
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name } = req.body;
    const created_at = new Date();
 
      const sortResult = await db.query(
        'SELECT MAX(sort_order) AS max_order FROM tags'
      );
      const maxOrder = sortResult.rows[0].max_order || 0;
      const sort_order = maxOrder + 1;

    const insertQuery = `
      INSERT INTO tags (name, sort_order, created_at)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;

    const values = [name, sort_order, created_at];
    const result = await db.query(insertQuery, values);
    const newTag = result.rows[0];

    const logMessage = `new tag named: ${newTag.name} has been created`;
    const logQuery = `
    INSERT INTO logs (model_id, model_name, event, old_value, new_value, message, created_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
      `;
    await db.query(logQuery, [
    newTag.id,
    'tags',
    'create',
    null,
    newTag,
    logMessage,
    created_at,
  ]);

  res.status(201).json(newTag);
    } catch (error) {
      console.error('Error while creating tag:', error);
      res.status(500).json({ message: 'Failed to create tag' });
    }
  });
