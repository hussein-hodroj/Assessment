import React from 'react';
import { Modal, Button } from 'react-bootstrap';

function ConfirmDeleteModal({ show, onHide, onConfirm, task }) {

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Delete Task</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to delete the task: <strong>{task?.title}</strong>?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cancel</Button>
        <Button variant="danger" onClick={() => onConfirm(task.id)}>Delete</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ConfirmDeleteModal;
