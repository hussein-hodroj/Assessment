import React from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { FaEdit, FaTrash } from 'react-icons/fa';

function DraggableTaskList({ tasks, listId, onEditTask, onDeleteTask }) {
  return (
    <Droppable droppableId={listId}>
      {(provided) => (
        <div
          className="d-flex flex-column gap-2"
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          {[...tasks]
            .sort((a, b) => a.sort_order - b.sort_order)
            .map((task, index) => (
              <Draggable key={task.id} draggableId={task.id.toString()} index={task.sort_order}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="border rounded shadow-sm p-2 bg-light d-flex justify-content-between align-items-start"
                  >
                    <div>
                      <span className="badge text-bg-primary mb-1">
                        {task.tag || 'No tag'}
                      </span>
                      <div className="fw-semibold">{task.title}</div>
                    </div>
                    <div className="d-flex align-items-end justify-content-end gap-2 mt-4">
                      <FaEdit
                        className="text-primary"
                        style={{ cursor: 'pointer' }}
                        onClick={() => onEditTask(task)}
                        title="Edit Task"
                      />
                      <FaTrash
                        className="text-danger"
                        style={{ cursor: 'pointer' }}
                        onClick={() => onDeleteTask(task.id)}
                        title="Delete Task"
                      />
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
}

export default DraggableTaskList;
