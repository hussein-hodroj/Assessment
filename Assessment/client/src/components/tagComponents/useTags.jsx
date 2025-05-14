import { useState, useEffect } from 'react';
import axios from 'axios';

const useTags = (autoFetch = true) => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(autoFetch);

  const fetchTags = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/tags/getTags');
      setTags(res.data);
    } catch (err) {
      console.error('Failed to fetch tags:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch) fetchTags();
  }, [autoFetch]);

  return { tags, loading, fetchTags, setTags };
};

export default useTags;
