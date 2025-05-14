import asyncHandler from 'express-async-handler';
import { body, param, validationResult } from 'express-validator';
import dotenv from 'dotenv';
import db from '../../db.js';

dotenv.config();

export const updateTask = asyncHandler(async (req, res) => {
  const taskId = req.params.id;

  await Promise.all([
    param('id').notEmpty().isUUID().run(req), // validate task ID
    body('title').notEmpty().isString().escape().run(req),
    body('description').notEmpty().isString().escape().run(req),
  ]);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("Validation error:", errors);
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const oldTaskResult = await db.query(`SELECT * FROM tasks WHERE id = $1`, [taskId]);
    if (oldTaskResult.rows.length === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }
    const oldTask = oldTaskResult.rows[0];

    const { title, description } = req.body;
    const updated_at = new Date();
    
    const updateQuery = `
      UPDATE tasks
      SET title = $1, description = $2, updated_at = $3
      WHERE id = $4
      RETURNING *;
    `;
    const values = [title, description, updated_at, taskId];
    const updatedTaskResult = await db.query(updateQuery, values);

     const logMessage = `the task: ${updatedTaskResult.rows[0].title} has been updated from ${oldTask.title, oldTask.description} to ${updatedTaskResult.rows[0].title, updatedTaskResult.rows[0].description}`;
     const logQuery = `
     INSERT INTO logs (model_id, model_name, event, old_value, new_value, message, created_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
   `;
    await db.query(logQuery, [
      taskId,
      'tasks',
      'update',
      oldTask,
      updatedTaskResult.rows[0],
      logMessage,
      updated_at
    ]);

    res.status(200).json({
      message: 'Task updated successfully',
      oldTask,
      updatedTask: updatedTaskResult.rows[0]
    });
  } catch (error) {
    console.error('Error while updating task:', error);
    res.status(500).json({ message: 'Failed to update task' });
  }
});
