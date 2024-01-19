import React, { useState } from "react";
import axios from "axios"; // Import Axios
import firebaseApp from "../../../firebase/firebase-config";

const CreateUserCredentials = ({ onCreateUser }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "store",
    houseid: "", // Add the new "houseid" field
  });

  const [errors, setErrors] = useState({}); // Initialize error state

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const errors = {};

    // Check if the fields are empty
    if (!formData.username.trim()) {
      errors.username = "Username is required";
    }

    if (!formData.password.trim()) {
      errors.password = "Password is required";
    }

    if (!formData.houseid.trim()) {
      // Validate the "houseid" field
      errors.houseid = "House ID is required";
    }

    // You can add more validation rules here

    return errors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length === 0) {
      try {
        const idToken = await firebaseApp.currentUser.getIdToken();

        // Create a headers object with the authorization token
        const headers = {
          Authorization: `Bearer ${idToken}`,
        };
        // Send the form data to your server using Axios
        const response = await axios.post(
          "http://192.168.29.18:3001/user/createusercred",
          formData,
          { headers }
        ); // Replace "/api/users" with your actual API endpoint

        // Assuming your server responds with the created user data
        onCreateUser(response.data);

        // Reset the form fields
        setFormData({
          username: "",
          password: "",
          role: "store", // Reset the role to the default value
          houseid: "", // Reset the houseid field
        });

        // Clear validation errors
        setErrors({});
      } catch (error) {
        if (error.response && error.response.status === 403) {
          // Display a simple browser alert for a 403 Forbidden error
          window.alert("You do not have permission to create this profile.");
        } else {
          console.error("Error creating user profile:", error);
          // Handle other types of errors, e.g., network errors
        }
      }
    } else {
      // Display validation errors
      setErrors(validationErrors);
    }
  };

  return (
    <div className="container mx-auto mt-4 p-4 border rounded shadow-lg">
      <h2 className="text-2xl mb-4">Create User Credentials</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="username" className="block font-medium">
            Username:
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            className={`form-input w-full ${
              errors.username ? "border-red-500" : ""
            }`}
            required
          />
          {errors.username && (
            <p className="text-red-500 mt-1">{errors.username}</p>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block font-medium">
            Password:
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className={`form-input w-full ${
              errors.password ? "border-red-500" : ""
            }`}
            required
          />
          {errors.password && (
            <p className="text-red-500 mt-1">{errors.password}</p>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="houseid" className="block font-medium">
            House ID:
          </label>
          <input
            type="text"
            id="houseid"
            name="houseid"
            value={formData.houseid}
            onChange={handleInputChange}
            className={`form-input w-full ${
              errors.houseid ? "border-red-500" : ""
            }`}
            required
          />
          {errors.houseid && (
            <p className="text-red-500 mt-1">{errors.houseid}</p>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="role" className="block font-medium">
            Role:
          </label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            className="form-select w-full"
          >
            <option value="admin">Admin</option>{" "}
            <option value="agentmanager">Agent Manager</option>{" "}
            <option value="shipmentmanager">Shipment Manager</option>{" "}
            <option value="sourceingagent">Sourceingagent</option>{" "}
            <option value="shipmentagent">Shipment Agent</option>
            <option value="master">MAste</option>
            <option value="store">store</option>
            <option value="client">client</option>
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Create User
        </button>
      </form>
    </div>
  );
};

export default CreateUserCredentials;
