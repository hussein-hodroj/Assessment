import db from '../db.js';

const createLogsTable = async () => {
    try {    
        await db.query(`
          CREATE TABLE IF NOT EXISTS logs (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            model_id VARCHAR(255) NOT NULL,
            model_name VARCHAR(255) NOT NULL,
            event VARCHAR(255) NOT NULL,
            old_value JSONB,
            new_value JSONB,
            message VARCHAR(255),
            created_at TIMESTAMP
          );
        `);
    
      } catch (error) {
        console.error('Error creating table Logs:', error);
      }
    };

export default createLogsTable;
