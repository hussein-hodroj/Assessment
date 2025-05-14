import db from '../db.js';

const createTagsTable = async () => {
    try {
    
        await db.query(`
          CREATE TABLE IF NOT EXISTS tags (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            name VARCHAR(255) NOT NULL,
            sort_order INTEGER,
            created_at TIMESTAMP
          );
        `);
    
      } catch (error) {
        console.error('Error creating table tags:', error);
      }
    };

export default createTagsTable;
