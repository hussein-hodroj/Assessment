import React, { useState } from 'react';
import axios from 'axios';
import { Row, Col, Form, Button } from 'react-bootstrap';

function CreateTag({ onTagCreated }) {
  const [newTagName, setNewTagName] = useState('');
  const [error, setError] = useState('');

  const handleTagCreate = async () => {
    if (!newTagName.trim()) {
      setError('Tag name is required');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/tags/createTag', {
        name: newTagName,
      });

      setNewTagName('');
      setError('');
      onTagCreated(res.data); // Send back new tag to parent
    } catch (err) {
      console.error('Failed to create tag:', err);
      setError('Failed to create tag');
    }
  };

  return (
    <Form.Group className="mb-3">
      <Form.Label>Create New Tag</Form.Label>
      <Row>
        <Col xs={8}>
          <Form.Control
            type="text"
            placeholder="Enter tag name"
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
          />
        </Col>
        <Col>
          <Button variant="success" onClick={handleTagCreate}>
            Create Tag
          </Button>
        </Col>
      </Row>
      {error && <div className="text-danger mt-1">{error}</div>}
    </Form.Group>
  );
}

export default CreateTag;
