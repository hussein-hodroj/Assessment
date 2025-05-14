import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'; 
import createTasksTable from './models/tasks.js'
import createTagsTable from './models/tags.js'
import createListsTable from './models/lists.js'
import createLogsTable from './models/logs.js'
import getListsRoutes from './routes/listsRoutes/getListsRoute.js'; 
import createTaskRoute from './routes/tasksRoutes/createTaskRoute.js'; 
import updatedTaskRoute from './routes/tasksRoutes/updateTaskRoute.js'; 
import getTasksRoute from './routes/tasksRoutes/getTaskRoute.js'; 
import deleteTaskRoute from './routes/tasksRoutes/deleteTaskRoute.js'; 
import getLogsRoute from './routes/logsRoutes/getLogsRoute.js'; 
import createTagRoute from './routes/tagsRoutes/createTagRoute.js'; 
import getTagsRoute from './routes/tagsRoutes/getTagsRoute.js'; 
import dragDropRoute from './routes/tasksRoutes/dragDropRoute.js'

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());  

createTasksTable();
createTagsTable();
createListsTable();
createLogsTable();

app.use('/api/lists', getListsRoutes);
app.use('/api/tasks', createTaskRoute);
app.use('/api/tasks', updatedTaskRoute);
app.use('/api/tasks', getTasksRoute);
app.use('/api/tasks', deleteTaskRoute);
app.use('/api/logs', getLogsRoute);
app.use('/api/tags', createTagRoute);
app.use('/api/tags', getTagsRoute);
app.use('/api/tasks', dragDropRoute);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});