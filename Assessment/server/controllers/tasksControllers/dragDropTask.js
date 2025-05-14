import asyncHandler from 'express-async-handler';
import dotenv from 'dotenv';
import db from '../../db.js';

dotenv.config();

export const dragDropTask = asyncHandler(async (req, res) => {
  const taskId = req.params.id;
  const { newListId, newSortOrder } = req.body;

  const client = await db.connect();

  try {
    await client.query('BEGIN');

    const taskQuery = await client.query(
      'SELECT list_id, sort_order, title FROM tasks WHERE id = $1 FOR UPDATE',
      [taskId]
    );

    if (taskQuery.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Task not found' });
    }

    const oldTask = taskQuery.rows[0];
    const oldListId = oldTask.list_id;
    const oldSortOrder = oldTask.sort_order;

    const movedBetweenLists = oldListId !== newListId;

    if (movedBetweenLists) {
      await client.query(
        `UPDATE tasks SET sort_order = sort_order - 1
         WHERE list_id = $1 AND sort_order > $2`,
        [oldListId, oldSortOrder]
      );

      await client.query(
        `UPDATE tasks SET sort_order = sort_order + 1
         WHERE list_id = $1 AND sort_order >= $2`,
        [newListId, newSortOrder]
      );
    } else {
      if (newSortOrder < oldSortOrder) {
        await client.query(
          `UPDATE tasks SET sort_order = sort_order + 1
           WHERE list_id = $1 AND sort_order >= $2 AND sort_order < $3`,
          [oldListId, newSortOrder, oldSortOrder]
        );
      } else if (newSortOrder > oldSortOrder) {
        await client.query(
          `UPDATE tasks SET sort_order = sort_order - 1
           WHERE list_id = $1 AND sort_order > $2 AND sort_order <= $3`,
          [oldListId, oldSortOrder, newSortOrder]
        );
      }
    }

    const updateResult = await client.query(
      `UPDATE tasks SET list_id = $1, sort_order = $2, updated_at = NOW()
       WHERE id = $3 RETURNING *`,
      [newListId, newSortOrder, taskId]
    );

    const updatedTask = updateResult.rows[0];

    const listNamesQuery = await client.query(
      'SELECT id, name FROM lists WHERE id = $1 OR id = $2',
      [oldListId, newListId]
    );
    
    const listNameMap = {};
    listNamesQuery.rows.forEach(row => {
      listNameMap[row.id] = row.name;
    });
    
    const oldListName = listNameMap[oldListId] || `List ${oldListId}`;
    const newListName = listNameMap[newListId] || `List ${newListId}`;
    
    const logMessage = movedBetweenLists
      ? `Task "${oldTask.title}" moved from list '${oldListName}' to '${newListName}'`
      : `Task "${oldTask.title}" reordered within list '${oldListName}'`;

    await client.query(
      `INSERT INTO logs (model_id, model_name, event, old_value, new_value, message, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
      [
        taskId,
        'tasks',
        'update',
        JSON.stringify(oldTask),
        JSON.stringify(updatedTask),
        logMessage
      ]
    );

    await client.query('COMMIT');

    res.status(200).json({
      message: 'Task updated successfully',
      oldTask,
      updatedTask
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error while moving task:', error);
    res.status(500).json({ message: 'Failed to move task due to a server error' });
  } finally {
    client.release();
  }
});
