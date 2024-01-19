import React, { useEffect, useState } from "react";
import axios from "axios";

function AgentDetails({ profileId }) {
  const [agentDetails, setAgentDetails] = useState(null);
  const [editMode, setEditMode] = useState(false); // Edit mode state
  const [updatedAgent, setUpdatedAgent] = useState({}); // Store updated agent data
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteProfileId, setDeleteProfileId] = useState("");
  useEffect(() => {
    const fetchAgentDetails = async () => {
      try {
        const response = await axios.get(
          `http://192.168.29.18:3023/agent/profile/${profileId}`
        );
        setAgentDetails(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching agent details:", error);
      }
    };

    if (profileId !== null) {
      fetchAgentDetails();
    } else {
      setAgentDetails(null);
    }
  }, [profileId]);

  const toggleEditMode = () => {
    setEditMode(!editMode); // Toggle edit mode
  };

  const handleNameChange = (e) => {
    //e.preventDefault();

    // Update agent name when editing
    setUpdatedAgent({ ...updatedAgent, name: e.target.value });
  };

  const handlePhoneChange = (e) => {
    // e.preventDefault();
    // Update agent phone number when editing
    setUpdatedAgent({ ...updatedAgent, phonenumber: e.target.value });
  };

  const handleHouseIdChange = (e) => {
    // Update agent houseid when editing
    const updatedValue = e.target.value;
    setUpdatedAgent((prevState) => ({
      ...prevState,
      houseID: updatedValue,
    }));
  };

  const handleRoleChange = (e) => {
    // Update the "role" field when editing
    setUpdatedAgent({ ...updatedAgent, role: e.target.value });
  };

  const saveChanges = async () => {
    try {
      const response = await axios.put(
        `http://192.168.29.18:3023/agent/${profileId}`,
        { updatedAgent, profileId }
      );
      setAgentDetails(response.data);
      toggleEditMode();
    } catch (error) {
      console.error("Error updating agent details:", error);
    }
  };
  const handleDeleteConfirmation = () => {
    setShowDeleteConfirmation(true);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);
  };

  const handleDelete = async () => {
    console.log(profileId);

    console.log(deleteProfileId);
    try {
      const response = await axios.delete(`http://192.168.1.12:3023/agent/`, {
        data: {
          id: profileId,
          profileid: deleteProfileId,
        },
      });
      console.log(response);
      if (response.data) {
        setShowDeleteConfirmation(false);
      }

      console.log("Agent deleted:", response.data);

      // Handle the deletion response as needed
      // For example, show a confirmation message or redirect
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.error === "Agent has orders"
      ) {
        // Handle the specific error message with an alert
        alert("Agent has orders");
      }
      if (
        error.response &&
        error.response.data &&
        error.response.data.error === "No Products"
      ) {
        // Handle the specific error message with an alert
        alert("No Products pass null");
      }
      if (
        error.response &&
        error.response.data &&
        error.response.data.error === "server error"
      ) {
        // Handle the specific error message with an alert
        alert("server error");
      } else {
        // Handle other errors
        console.error("An error occurred:", error.response.data.error);
        alert(`server error ${error}`);
      }
    }
  };

  if (!agentDetails) {
    return null;
  }

  return (
    <div className="agent-details border border-gray-300 rounded p-4">
      <button
        onClick={editMode ? saveChanges : toggleEditMode}
        className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        {editMode ? "Save" : "Edit"}
      </button>
      <button
        onClick={handleDeleteConfirmation}
        className="p-2 bg-red-500 text-white rounded hover:bg-red-600 ml-2"
      >
        Delete
      </button>

      {showDeleteConfirmation && (
        <div className="my-4">
          <p className="text-red-600">
            Are you sure you want to delete this agent?
          </p>
          <input
            type="text"
            placeholder="Enter profileId"
            value={deleteProfileId}
            onChange={(e) => setDeleteProfileId(e.target.value)}
            className="border border-gray-300 p-2 rounded mt-2"
          />
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white rounded hover:bg-red-600 px-2 py-1"
          >
            Confirm Delete
          </button>
          <button
            onClick={handleCancelDelete}
            className="bg-gray-300 text-gray-700 rounded hover:bg-gray-400 px-2 py-1 ml-2"
          >
            Cancel
          </button>
        </div>
      )}
      <h2 className="my-4 text-lg font-semibold">Agent Details</h2>

      <div
        className={`grid grid-cols-3 gap-4 ${
          editMode ? "grid-rows-4" : "grid-rows-3"
        }`}
      >
        {editMode ? (
          // Render edit fields when in edit mode
          <>
            <div className="col-span-3 mb-4">
              <label htmlFor="name" className="block font-bold">
                Name:
              </label>
              <input
                type="text"
                id="name"
                value={updatedAgent.name || agentDetails.name}
                onChange={handleNameChange}
                className="w-full border border-gray-300 p-2 rounded"
              />
            </div>
            <div className="col-span-3 mb-4">
              <label htmlFor="phonenumber" className="block font-bold">
                Phone Number:
              </label>
              <input
                type="text"
                id="phonenumber"
                value={updatedAgent.phonenumber || agentDetails.phonenumber}
                onChange={handlePhoneChange}
                className="w-full border border-gray-300 p-2 rounded"
              />
            </div>
            <div className="col-span-3 mb-4">
              <label htmlFor="houseID" className="block font-bold">
                House ID:
              </label>
              <input
                type="text"
                id="houseID"
                value={updatedAgent.houseID || agentDetails.houseID}
                onChange={handleHouseIdChange}
                className="w-full border border-gray-300 p-2 rounded"
              />
            </div>
            <div className="col-span-3 mb-4">
              <label htmlFor="role" className="block font-bold">
                Role:
              </label>
              <input
                type="text"
                id="role"
                value={updatedAgent.role || agentDetails.role}
                onChange={handleRoleChange}
                className="w-full border border-gray-300 p-2 rounded"
              />
            </div>
          </>
        ) : (
          // Render view mode when not in edit mode
          <>
            <div className="col-span-1">
              <strong className="block">Name:</strong> {agentDetails.name}
            </div>
            <div className="col-span-2">
              <strong className="block">Phone Number:</strong>{" "}
              {agentDetails.phonenumber}
            </div>
            <div className="col-span-3">
              <strong className="block">House ID:</strong>{" "}
              {agentDetails.houseID}
            </div>
            <div className="col-span-3">
              <strong className="block">Role:</strong> {agentDetails.role}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default AgentDetails;
