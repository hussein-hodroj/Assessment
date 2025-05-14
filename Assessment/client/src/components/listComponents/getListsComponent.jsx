import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DragDropContext } from '@hello-pangea/dnd';
import DraggableTaskList from '../taskComponents/dragDropComponent';
import TaskModal from '../taskComponents/popupComponent';
import UpdateModal from '../taskComponents/updateComponent';
import ConfirmDeleteModal from '../taskComponents/deleteComponent';

function GetListsComponent() {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [activeListId, setActiveListId] = useState(null);
  const [editingTask, setEditingTask] = useState(false);
  const [deletingTask, setDeletingTask] = useState(null);

  const fetchLists = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/lists/getLists');
      setLists(response.data);
    } catch (error) {
      console.error('Failed to fetch lists:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLists();
  }, []);

  const handleOpenModal = (listId) => {
    setActiveListId(listId);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setActiveListId(null);
  };

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;

    const sourceListId = source.droppableId;
    const destinationListId = destination.droppableId;

    // Prevent update if same position
    if (
      sourceListId === destinationListId &&
      source.index === destination.index
    ) {
      return;
    }

    try {
      await axios.put(`http://localhost:5000/api/tasks/dragDropTasks/${draggableId}`, {
        newListId: destinationListId,
        newSortOrder: destination.index,
      });

      fetchLists();
    } catch (error) {
      console.error('Drag and drop update failed:', error);
    }
  };

  const handleUpdateSubmit = async (updatedTask) => {
    try {
      await axios.put(`http://localhost:5000/api/tasks/updateTask/${updatedTask.id}`, {
        title: updatedTask.title,
        description: updatedTask.description,
      });
      setEditingTask(null);
      fetchLists();
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  };

  const handleDeleteConfirm = async (taskId) => {
    try {
      await axios.post(`http://localhost:5000/api/tasks/deleteTask/${taskId}`);
      setDeletingTask(null);
      fetchLists();
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  if (loading) return <div className="text-center mt-5">Loading lists...</div>;

  return (
    <div className="container-fluid">
      <h4 className="text-center mb-4">KANBAN Board</h4>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="row justify-content-center">
          {lists.map((list, index) => (
            <div className="col-md-4 col-sm-12 mb-3" key={index}>
              <div className="card h-100 border border-dark">
                <div className="card-header text-center fw-bold border-bottom">
                  {list.name}
                </div>
                <div className="card-body">
                  <DraggableTaskList
                    tasks={list.tasks}
                    listId={list.list_id.toString()}
                    onEditTask={(task) => setEditingTask(task)}
                    onDeleteTask={(taskId) => {
                      const task = list.tasks.find((t) => t.id === taskId);
                      setDeletingTask(task);
                    }}
                  />
                </div>
                <div className="card-footer bg-white border-top">
                  <button
                    type="button"
                    className="btn btn-outline-dark w-100"
                    onClick={() => handleOpenModal(list.list_id)}
                  >
                    Add Task
                  </button>
                </div>
              </div>

              <UpdateModal
                show={!!editingTask}
                task={editingTask}
                onHide={() => setEditingTask(null)}
                onSubmit={handleUpdateSubmit}
              />
              <ConfirmDeleteModal
                show={!!deletingTask}
                task={deletingTask}
                onHide={() => setDeletingTask(null)}
                onConfirm={handleDeleteConfirm}
              />
            </div>
          ))}
        </div>
      </DragDropContext>

      <TaskModal
        show={showModal}
        handleClose={handleCloseModal}
        listId={activeListId}
        onTaskCreated={fetchLists}
      />
    </div>
  );
}

export default GetListsComponent;
