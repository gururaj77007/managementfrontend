import React, { useEffect, useState } from "react";
import CreateUserCredentials from "../../Components/Agent/Createreal/CreateUserCredentials";
import CreateUserProfile from "../../Components/Agent/Createreal/CreateUserProfile";
import Sidebar from "../../Components/Home/Sidebar";
import firebaseApp from "../../firebase/firebase-config";

const CreateUserPage = () => {
  const [userCredentials, setUserCredentials] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [houseID, setHouseID] = useState(null);

  // Callback function to handle user credentials submission
  const handleUserCredentialsSubmit = (data) => {
    setUserCredentials(data);
  };

  // Callback function to handle user profile submission
  const handleUserProfileSubmit = (data) => {
    setUserProfile(data);
  };

  return (
    <div className="container mx-auto mt-4 ml-28">
      <div className="grid grid-cols-4 gap-4">
        <Sidebar />
        <div className="col-span-3">
          <div>
            <CreateUserCredentials onCreateUser={handleUserCredentialsSubmit} />
            {userCredentials && (
              <div className="mt-4">
                <h3>User Credentials Created:</h3>
                <pre>{JSON.stringify(userCredentials, null, 2)}</pre>
              </div>
            )}
          </div>
          {/* Render CreateUserProfile only if userCredentials exist */}
          {userCredentials && (
            <div>
              <CreateUserProfile
                onCreateProfile={handleUserProfileSubmit}
                houseID={houseID}
                userCredentials={userCredentials}
              />
              {userProfile && (
                <div className="mt-4">
                  <h3>User Profile Created:</h3>
                  <pre>{JSON.stringify(userProfile, null, 2)}</pre>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateUserPage;
