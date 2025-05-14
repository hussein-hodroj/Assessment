import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';
import useTags from '../tagComponents/useTags';
import CreateTag from '../tagComponents/createTagComponent';

function TaskModal({ show, handleClose, listId, onTaskCreated }) {
  const { tags, fetchTags } = useTags(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags_id: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (show) fetchTags();
  }, [show]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/tasks/createTask', {
        ...formData,
        list_id: listId,
      });

      onTaskCreated();
      setFormData({ title: '', description: '', tags_id: '' });
      handleClose();
    } catch (err) {
      console.error(err);
      setError('Failed to create task');
    }
  };

  const handleTagCreated = (newTag) => {
    fetchTags();
    setFormData((prev) => ({ ...prev, tags_id: newTag.id }));
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <div className="text-danger mb-2">{error}</div>}
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <CreateTag onTagCreated={handleTagCreated} />
          <Form.Group>
            <Form.Label>Tag</Form.Label>
            <Form.Select
              name="tags_id"
              value={formData.tags_id}
              onChange={handleChange}
              required
            >
              <option value="">Select a tag</option>
              {tags.map(tag => (
                <option key={tag.id} value={tag.id}>{tag.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="primary">Save</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default TaskModal;
