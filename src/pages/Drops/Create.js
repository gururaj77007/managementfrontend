import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Create() {
  // State variables for input values and validation
  const [dropName, setDropName] = useState("");

  const [dropToBeLiveDate, setDropToBeLiveDate] = useState(new Date());
  const [dropToBeLiveTime, setDropToBeLiveTime] = useState(getCurrentTime());

  // State variables for validation messages
  const [dropNameError, setDropNameError] = useState("");
  const [dropToBeLiveDateError, setDropToBeLiveDateError] = useState("");
  const [dropToBeLiveTimeError, setDropToBeLiveTimeError] = useState("");

  // Regular expressions for validation
  const dropNameRegex = /^[A-Za-z0-9]+$/;
  const dropToBeLiveDateRegex = /^\d{4}-\d{2}-\d{2}$/; // Example: YYYY-MM-DD
  const dropToBeLiveTimeRegex = /^\d{2}:\d{2}$/; // Example: HH:MM
  const navigate = useNavigate();

  // Function to get the current time in HH:MM format
  function getCurrentTime() {
    const now = new Date();
    return new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      now.getHours(),
      now.getMinutes()
    );
  }

  // Effect to update dropToBeLiveTime when the component mounts
  useEffect(() => {
    setDropToBeLiveTime(getCurrentTime());
  }, []);

  // Event handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation logic
    if (!dropName.match(dropNameRegex)) {
      setDropNameError("Drop Name must contain only letters and numbers.");
      return;
    }
    setDropNameError("");

    // Format the date to be in the YYYY-MM-DD format
    const formattedDate = dropToBeLiveDate.toISOString().split("T")[0];

    if (!formattedDate.match(dropToBeLiveDateRegex)) {
      setDropToBeLiveDateError("Invalid date format. Use YYYY-MM-DD.");
      return;
    }
    setDropToBeLiveDateError("");

    // Format the time to be in the HH:MM format
    const formattedTime = dropToBeLiveTime.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    });

    if (!formattedTime.match(dropToBeLiveTimeRegex)) {
      setDropToBeLiveTimeError("Invalid time format. Use HH:MM.");
      return;
    }
    setDropToBeLiveTimeError("");

    // Concatenate date and time before submitting
    const dropToBeLive = `${formattedDate} ${formattedTime}`;

    console.log(dropName, dropToBeLive, dropToBeLiveDate);
    try {
      const response = await axios.post("http://localhost:3025/drops/create", {
        dropsName: dropName,
        dropToBeLive: dropToBeLive,
      });

      console.log("Drop created:", response.data);

      // Display success alert
      alert("Drop created successfully!");
      navigate(-1);

      // Add additional logic here if needed
    } catch (error) {
      console.error("Error creating drop:", error);

      // Display error alert
      alert("Error creating drop. Please try again.");

      // Handle errors as needed
    }

    // Add your logic here to handle the form submission
    // You can use the state variables (dropName, dropToBeLive) in this function
  };

  return (
    <div className="container mx-auto mt-8">
      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto bg-white p-8 shadow-md rounded"
      >
        <div className="mb-4">
          <label
            htmlFor="dropName"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Drop Name
          </label>
          <input
            type="text"
            id="dropName"
            className={`appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              dropNameError ? "border-red-500" : ""
            }`}
            placeholder="Enter Drop Name"
            value={dropName}
            onChange={(e) => setDropName(e.target.value)}
            pattern={dropNameRegex.source}
          />
          {dropNameError && (
            <p className="text-red-500 text-xs italic">{dropNameError}</p>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="dropToBeLiveDate"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Drop To Be Live Date
          </label>
          <DatePicker
            selected={dropToBeLiveDate}
            onChange={(date) => setDropToBeLiveDate(date)}
            dateFormat="yyyy-MM-dd"
            className={`appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              dropToBeLiveDateError ? "border-red-500" : ""
            }`}
          />
          {dropToBeLiveDateError && (
            <p className="text-red-500 text-xs italic">
              {dropToBeLiveDateError}
            </p>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="dropToBeLiveTime"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Drop To Be Live Time
          </label>
          <DatePicker
            selected={dropToBeLiveTime}
            onChange={(time) => setDropToBeLiveTime(time)}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={15}
            dateFormat="HH:mm"
            timeCaption="Time"
            className={`appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              dropToBeLiveTimeError ? "border-red-500" : ""
            }`}
          />
          {dropToBeLiveTimeError && (
            <p className="text-red-500 text-xs italic">
              {dropToBeLiveTimeError}
            </p>
          )}
        </div>
        <div className="flex items-center justify-center">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Create Drop
          </button>
        </div>
      </form>
    </div>
  );
}

export default Create;
