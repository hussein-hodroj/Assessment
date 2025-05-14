import asyncHandler from 'express-async-handler';
import { body, validationResult } from 'express-validator';
import dotenv from 'dotenv';
import db from '../../db.js';

dotenv.config();

export const createNewTask = asyncHandler(async (req, res) => {

  await Promise.all([
    body('title').notEmpty().isString().escape().run(req),
    body('description').notEmpty().isString().escape().run(req),
    body('tags_id').notEmpty().isString().escape().run(req),
    body('list_id').notEmpty().isString().escape().run(req),
  ]);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log ("error in validation:", errors)
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { title, description, tags_id, list_id } = req.body;
    const created_at = new Date();

     const tagCheck = await db.query('SELECT id FROM tags WHERE id = $1', [tags_id]);
     if (tagCheck.rowCount === 0) {
       return res.status(400).json({ message: 'Invalid tags_id: not found in tag table' });
     }
 
     const listCheck = await db.query('SELECT id FROM lists WHERE id = $1', [list_id]);
     if (listCheck.rowCount === 0) {
       return res.status(400).json({ message: 'Invalid list_id: not found in list table' });
     }
 
      const sortResult = await db.query(
        'SELECT MAX(sort_order) AS max_order FROM tasks'
      );
      const maxOrder = sortResult.rows[0].max_order || 0;
      const sort_order = maxOrder + 1;

    const insertQuery = `
      INSERT INTO tasks (title, description, tags_id, list_id, sort_order, created_at)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;

    const values = [title, description, tags_id, list_id, sort_order, created_at];
    const result = await db.query(insertQuery, values);
    const newTask = result.rows[0];

    const logMessage = `new task named: ${newTask.title} has been created`;
    const logQuery = `
    INSERT INTO logs (model_id, model_name, event, old_value, new_value, message, created_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
      `;
    await db.query(logQuery, [
    newTask.id,
    'tasks',
    'create',
    null,
    newTask,
    logMessage,
    created_at,
  ]);

  res.status(201).json(newTask);
    } catch (error) {
      console.error('Error while creating task:', error);
      res.status(500).json({ message: 'Failed to create task' });
    }
  });
