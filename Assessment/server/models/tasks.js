import db from '../db.js';

const createTasksTable = async () => {
    try {    
        await db.query(`
          CREATE TABLE IF NOT EXISTS tasks (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            title VARCHAR(255) NOT NULL,
            description VARCHAR(255) NOT NULL,
            tags_id VARCHAR(255) NOT NULL,
            list_id VARCHAR(255) NOT NULL,
            sort_order INTEGER,
            is_deleted BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP,
            updated_at TIMESTAMP,
            deleted_at TIMESTAMP          
           );
        `);
    
      } catch (error) {
        console.error('Error creating table tasks:', error);
      }
    };

export default createTasksTable;
