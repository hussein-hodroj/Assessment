import asyncHandler from 'express-async-handler';
import dotenv from 'dotenv';
import db from '../../db.js';

dotenv.config();

export const deleteTask = asyncHandler(async (req, res) => {
    const taskId = req.params.id;
  
    try {
  
      const deleted_at = new Date();
      const is_deleted = true;

      const existingTaskQuery = 'SELECT * FROM tasks WHERE id = $1';
      const existingTaskResult = await db.query(existingTaskQuery, [taskId]);

      if (existingTaskResult.rowCount === 0) {
        return res.status(404).json({ message: 'Task not found' });
      }

      const oldTask = existingTaskResult.rows[0];

      const softDeleteQuery = `
        UPDATE tasks
        SET is_deleted = $1, deleted_at = $2
        WHERE id = $3
        RETURNING *;
      `;
      const deletedTaskResult = await db.query(softDeleteQuery, [is_deleted, deleted_at, taskId]);
      const deletedTask = deletedTaskResult.rows[0];

      const logMessage = `the task: ${deletedTask.title} has been deleted`;
      const logQuery = `
        INSERT INTO logs (model_id, model_name, event, old_value, new_value, message ,created_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `;
      await db.query(logQuery, [
        taskId,
        'tasks',
        'delete',
        oldTask,
        null,
        logMessage,
        deleted_at
      ]);

      res.status(200).json({
        message: 'Task soft-deleted successfully, and log created successfuly',
        deletedTask: deletedTask
      });
    } catch (error) {
      console.error('Error while soft-deleting task:', error);
      res.status(500).json({ message: 'Failed to delete task' });
    }
  });
