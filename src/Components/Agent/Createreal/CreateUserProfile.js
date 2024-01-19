import React, { useState } from "react";
import axios from "axios"; // Import Axios
import firebaseApp from "../../../firebase/firebase-config";

const CreateUserProfile = ({ onCreateProfile, userCredentials }) => {
  console.log(userCredentials);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    phonenumber: "",
    houseID: "",

    role: userCredentials.role, // Add role field
    userId: userCredentials.uid,
    phoneNumber: "",
    userPassword: userCredentials.password,
    userEmail: userCredentials.username,
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Send a POST request to create the user profile
      const response = await axios.post(
        "http://192.168.29.18:3001/user/createProfile",
        formData
      );
      console.log("succefull");

      // Handle the response and update the state as needed
      onCreateProfile(response.data);

      // Reset the form fields
      setFormData({
        username: "",
        phonenumber: "",
        houseID: "",

        role: "", // Add role field
        userId: "",
        phoneNumber: "",
        userPassword: "",
        userEmail: "",
      });
    } catch (error) {
      if (error.response && error.response.status === 403) {
        // Handle 403 Forbidden error
        console.error("You do not have permission to create this profile.");
        // Display an error message to the user or redirect to an error page
      } else {
        console.error("Error creating user profile:", error);
        // Handle other types of errors, e.g., network errors
      }
      console.error("Error creating user profile:", error.data);
      // Handle error, e.g., display an error message
    }
  };

  return (
    <div className="container mx-auto mt-4 p-4 border rounded shadow-lg">
      <h2 className="text-2xl mb-4">Create User Profile</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block font-medium">
            UserName:
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            className="form-input w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="phoneNumber" className="block font-medium">
            Phone Number:
          </label>
          <input
            type="text"
            id="phonenumber"
            name="phonenumber"
            value={formData.phonenumber}
            onChange={handleInputChange}
            className="form-input w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="houseId" className="block font-medium">
            House ID:
          </label>
          <input
            type="text"
            id="houseID"
            name="houseID"
            value={formData.houseID}
            onChange={handleInputChange}
            className="form-input w-full"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="role" className="block font-medium">
            Role:
          </label>
          <input
            type="text"
            id="role"
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            className="form-input w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="UID" className="block font-medium">
            UID:
          </label>
          <input
            type="text"
            id="userId"
            name="userId"
            value={formData.userId}
            onChange={handleInputChange}
            className="form-input w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="name" className="block font-medium">
            userEmail:
          </label>
          <input
            type="text"
            id="userEmail"
            name="userEmail"
            value={formData.userEmail}
            onChange={handleInputChange}
            className="form-input w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="userPassword" className="block font-medium">
            Password:
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="userPassword"
              name="userPassword"
              value={formData.userPassword}
              onChange={handleInputChange}
              className="form-input w-full"
              required
            />
            <button
              type="button"
              className="absolute top-1/2 right-2 transform -translate-y-1/2 text-sm"
              onClick={handleTogglePassword}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Create Profile
        </button>
      </form>
    </div>
  );
};

export default CreateUserProfile;
