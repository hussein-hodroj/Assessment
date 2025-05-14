import React, { useEffect, useState } from 'react';
import axios from 'axios';

function LogList() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 10;

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/logs/getLogs');
        setLogs(response.data);
      } catch (error) {
        console.error('Failed to fetch logs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = logs.slice(indexOfFirstLog, indexOfLastLog);
  const totalPages = Math.ceil(logs.length / logsPerPage);

  const goToNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const goToPreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);

  if (loading) {
    return <div className="text-center mt-5">Loading logs...</div>;
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4">System Logs</h2>
      <table className="table table-bordered table-striped">
        <thead className="table-dark">
          <tr>
            <th className="text-center align-middle">Model</th>
            <th className="text-center align-middle">Event</th>
            <th className="p-2">Log Message</th>
          </tr>
        </thead>
        <tbody>
          {currentLogs.map(log => (
            <tr key={log.id}>
              <td className="text-center align-middle">{log.model_name}</td>
              <td className="text-center align-middle">{log.event}</td>
              <td className="p-2">{log.message}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="d-flex justify-content-between align-items-center mt-3">
        <div>
          <button
            className="btn btn-outline-secondary me-2"
            onClick={goToFirstPage}
            disabled={currentPage === 1}
          >
            First
          </button>
          <button
            className="btn btn-outline-primary me-2"
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
          >
            Previous
          </button>
        </div>
        <span>Page {currentPage} of {totalPages}</span>
        <div>
          <button
            className="btn btn-outline-primary me-2"
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
          <button
            className="btn btn-outline-secondary"
            onClick={goToLastPage}
            disabled={currentPage === totalPages}
          >
            Last
          </button>
        </div>
      </div>
    </div>
  );
}

export default LogList;
