import React, { useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function Create() {
  const [formData, setFormData] = useState({
    serviceName: "",
    Houseid: "", // Set the default Houseid here or update dynamically
    serviceSlots: [
      {
        date: new Date(),
        time: [],
      },
    ],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDateChange = (date, index) => {
    setFormData((prevData) => {
      const newServiceSlots = [...prevData.serviceSlots];
      newServiceSlots[index].date = date;
      return {
        ...prevData,
        serviceSlots: newServiceSlots,
      };
    });
  };

  const handleTimeChange = (index, timeIndex, field, newValue) => {
    setFormData((prevData) => {
      const newServiceSlots = [...prevData.serviceSlots];
      newServiceSlots[index].time[timeIndex][field] = newValue;
      return {
        ...prevData,
        serviceSlots: newServiceSlots,
      };
    });
  };

  const addTimeSlot = (index) => {
    setFormData((prevData) => {
      const newServiceSlots = [...prevData.serviceSlots];
      newServiceSlots[index].time.push({ time: "", vacancy: 1 });
      return {
        ...prevData,
        serviceSlots: newServiceSlots,
      };
    });
  };

  const removeTimeSlot = (index, timeIndex) => {
    setFormData((prevData) => {
      const newServiceSlots = [...prevData.serviceSlots];
      newServiceSlots[index].time.splice(timeIndex, 1);
      return {
        ...prevData,
        serviceSlots: newServiceSlots,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://192.168.29.18:3024/Service/create-service",
        formData
      );

      console.log(response.data);

      setFormData({
        serviceName: "",
        Houseid: 1, // Reset the Houseid after submission
        serviceSlots: [
          {
            date: new Date(),
            time: [],
          },
        ],
      });
    } catch (error) {
      console.error("Error creating service:", error.response.data.error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-semibold mb-4">Create Data Service</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="serviceName"
            className="block text-gray-700 font-bold"
          >
            Service Name
          </label>
          <input
            type="text"
            id="serviceName"
            name="serviceName"
            value={formData.serviceName}
            onChange={handleInputChange}
            className="mt-1 p-2 w-full border rounded-md"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="Houseid" className="block text-gray-700 font-bold">
            House ID
          </label>
          <input
            type="number"
            id="Houseid"
            name="Houseid"
            value={formData.Houseid}
            onChange={handleInputChange}
            className="mt-1 p-2 w-full border rounded-md"
          />
        </div>

        {formData.serviceSlots.map((serviceSlot, index) => (
          <div key={index} className="mb-4">
            <label
              htmlFor={`date-${index}`}
              className="block text-gray-700 font-bold"
            >
              Date
            </label>
            <DatePicker
              selected={serviceSlot.date}
              onChange={(date) => handleDateChange(date, index)}
              dateFormat="dd-MM-yyyy"
              className="mt-1 p-2 w-full border rounded-md"
            />

            {serviceSlot.time.map((time, timeIndex) => (
              <div key={timeIndex} className="flex items-center mt-2">
                <input
                  type="text"
                  id={`time-${index}-${timeIndex}`}
                  name={`time-${index}-${timeIndex}`}
                  value={time.time}
                  onChange={(e) =>
                    handleTimeChange(index, timeIndex, "time", e.target.value)
                  }
                  className="mr-2 p-2 border rounded-md"
                  placeholder="Time"
                />

                <input
                  type="number"
                  id={`vacancy-${index}-${timeIndex}`}
                  name={`vacancy-${index}-${timeIndex}`}
                  value={time.vacancy}
                  onChange={(e) =>
                    handleTimeChange(
                      index,
                      timeIndex,
                      "vacancy",
                      e.target.value
                    )
                  }
                  className="mr-2 p-2 border rounded-md"
                  placeholder="Vacancy"
                />

                <button
                  type="button"
                  onClick={() => removeTimeSlot(index, timeIndex)}
                  className="bg-red-500 text-white p-2 rounded-md"
                >
                  Remove
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={() => addTimeSlot(index)}
              className="mt-2 bg-green-500 text-white p-2 rounded-md"
            >
              Add Time Slot
            </button>
          </div>
        ))}

        <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">
          Create Data Service
        </button>
      </form>
    </div>
  );
}

export default Create;
