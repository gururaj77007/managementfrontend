import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../store/authcontext";

const DisplayServicesByHouseId = ({ houseId }) => {
  const [services, setServices] = useState([]);
  const [editableServiceIndex, setEditableServiceIndex] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [newVacancy, setNewVacancy] = useState(1);
  const authContext = useContext(AuthContext);

  useEffect(() => {
    // Fetch services by houseId from the server
    const fetchServices = async () => {
      try {
        const response = await axios.get(
          `http://192.168.29.18:3024/Service/services-by-houseid/${1}`
        );
        setServices(response.data.services);
      } catch (error) {
        console.error("Error fetching services:", error.response.data.error);
      }
    };

    fetchServices();
  }, [houseId]); // Include houseId as a dependency for the useEffect

  const handleTimeChange = (serviceIndex, timeIndex, field, newValue) => {
    const newServices = [...services];
    newServices[serviceIndex].serviceSlots[0].time[timeIndex][field] = newValue;
    setServices(newServices);
  };

  const handleAddTimeSlot = (serviceIndex) => {
    const newServices = [...services];
    newServices[serviceIndex].serviceSlots[0].time.push({
      time: "",
      vacancy: 1,
    });
    setServices(newServices);
  };

  const handleRemoveTimeSlot = (serviceIndex, timeIndex) => {
    const newServices = [...services];
    newServices[serviceIndex].serviceSlots[0].time.splice(timeIndex, 1);
    setServices(newServices);
  };

  const handleEditToggle = async (serviceIndex) => {
    if (isEditing) {
      // Save changes to the server
      try {
        await axios.put(
          `http://192.168.29.18:3024/Service/update-service/${services[serviceIndex]._id}`,
          {
            serviceName: services[serviceIndex].serviceName,
            Houseid: services[serviceIndex].Houseid,
            serviceSlots: services[serviceIndex].serviceSlots,
          }
        );
        console.log("Changes saved successfully");
      } catch (error) {
        console.error("Error saving changes:", error.response.data.error);
      }
    }

    setIsEditing(!isEditing);
    setEditableServiceIndex(isEditing ? null : serviceIndex);
  };

  const handleAddDate = async (serviceIndex) => {
    try {
      // Send a request to the server to add a new date and time
      await axios.post(
        `http://192.168.29.18:3024/Service/add-date/${services[serviceIndex].serviceName}`,
        {
          date: newDate,
          time: [
            {
              time: newTime,
              vacancy: newVacancy,
            },
          ],
        }
      );

      // Refresh the services after adding a new date
      const response = await axios.get(
        `http://192.168.29.18:3024/Service/services-by-houseid/${1}`
      );
      setServices(response.data.services);

      // Reset the form values
      setNewDate("");
      setNewTime("");
      setNewVacancy(1);
    } catch (error) {
      console.error("Error adding date:", error.response.data.error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-semibold mb-4">
        Services for House ID: {houseId}
      </h2>

      {services.map((service, serviceIndex) => (
        <div key={serviceIndex} className="mb-4">
          <div className="flex items-center">
            <h3 className="text-xl font-semibold mb-2">
              {service.serviceName}
            </h3>
            <button
              type="button"
              onClick={() => handleEditToggle(serviceIndex)}
              className="ml-4 bg-yellow-500 text-white p-2 rounded-md"
            >
              {isEditing && editableServiceIndex === serviceIndex
                ? "Save Changes"
                : "Edit"}
            </button>
          </div>

          {service.serviceSlots.map((serviceSlot, slotIndex) => (
            <div key={slotIndex} className="mb-4">
              <p className="font-bold">Date: {serviceSlot.date}</p>

              {serviceSlot.time.map((time, timeIndex) => (
                <div key={timeIndex} className="flex items-center mt-2">
                  <p className="mr-2">{time.time}</p>

                  {isEditing && editableServiceIndex === serviceIndex ? (
                    <>
                      {/* Edit time functionality */}
                      <input
                        type="text"
                        value={time.time}
                        onChange={(e) =>
                          handleTimeChange(
                            serviceIndex,
                            timeIndex,
                            "time",
                            e.target.value
                          )
                        }
                        className="mr-2 p-2 border rounded-md"
                        placeholder="Edit Time"
                      />

                      {/* Edit vacancy functionality */}
                      <input
                        type="number"
                        value={time.vacancy}
                        onChange={(e) =>
                          handleTimeChange(
                            serviceIndex,
                            timeIndex,
                            "vacancy",
                            e.target.value
                          )
                        }
                        className="mr-2 p-2 border rounded-md"
                        placeholder="Edit Vacancy"
                      />
                    </>
                  ) : (
                    <p className="mr-2">Vacancy: {time.vacancy}</p>
                  )}

                  {isEditing && editableServiceIndex === serviceIndex && (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          handleRemoveTimeSlot(serviceIndex, timeIndex)
                        }
                        className="bg-red-500 text-white p-2 rounded-md ml-2"
                      >
                        Remove
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>
          ))}

          {isEditing && editableServiceIndex === serviceIndex && (
            <div className="mt-2">
              {/* Add Date Form */}
              <label className="block mb-2">Add New Date:</label>
              <input
                type="text"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="mr-2 p-2 border rounded-md"
                placeholder="Enter Date"
              />

              <label className="block mb-2">Add New Time:</label>
              <input
                type="text"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="mr-2 p-2 border rounded-md"
                placeholder="Enter Time"
              />

              <label className="block mb-2">Add New Vacancy:</label>
              <input
                type="number"
                value={newVacancy}
                onChange={(e) => setNewVacancy(e.target.value)}
                className="mr-2 p-2 border rounded-md"
                placeholder="Enter Vacancy"
              />

              <button
                type="button"
                onClick={() => handleAddDate(serviceIndex)}
                className="bg-green-500 text-white p-2 rounded-md mt-2"
              >
                Add Date
              </button>
            </div>
          )}
        </div>
      ))}

      {/* Display a global "Save Changes" button when not editing a particular service */}
      {isEditing && editableServiceIndex === null && (
        <button
          onClick={handleEditToggle}
          className="bg-blue-500 text-white p-2 rounded-md mr-2"
        >
          Save Changes
        </button>
      )}
    </div>
  );
};

export default DisplayServicesByHouseId;
