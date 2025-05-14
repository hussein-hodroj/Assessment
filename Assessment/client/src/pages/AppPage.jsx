import React from "react";
import { useState } from "react";
import LogList from "../components/logComponents/getLogsComponent";
import GetListsComponent from "../components/listComponents/getListsComponent";

function AppPage() {
  const [showLogs, setShowLogs] = useState(false);
  const [showTasks, setShowTasks] = useState(true);
  return (
    <div className="container-fluid min-vh-100 border border-dark p-3">
  <h6 className="mb-3">APP</h6>

  <div className="d-flex justify-content-between border border-dark p-2 mb-3">
    <button
      type="button"
      className="btn btn-outline-primary"
      onClick={() => {
        setShowLogs(false);
        setShowTasks(true);
      }}
    >
      HOME
    </button>
    <button
      type="button"
      className="btn btn-outline-secondary"
      onClick={() => {
        setShowLogs(true);
        setShowTasks(false);
      }}
    >
      Log
    </button>
  </div>

  <div className="border border-dark p-3" style={{ minHeight: '70vh' }}>
    {showLogs && <LogList />}
    {showTasks && <GetListsComponent />}
  </div>
</div>
  );
}

export default AppPage;
