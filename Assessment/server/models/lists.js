import db from '../db.js';

const createListsTable = async () => {
    try {    
        await db.query(`
          CREATE TABLE IF NOT EXISTS lists (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            name VARCHAR(255) NOT NULL
          );
        `);
    
      } catch (error) {
        console.error('Error creating table lists:', error);
      }
    };

export default createListsTable;
