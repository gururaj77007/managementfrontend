import React from "react";
import { useNavigate } from "react-router-dom";
import firebaseApp from "../../firebase/firebase-config"; // Import Firebase auth
import Sidebar from "../../Components/Home/Sidebar";
import { AuthContext } from "../../store/authcontext";
import { useContext } from "react";
import { QRCodeSVG } from "qrcode.react";

const Home = () => {
  const location = useNavigate();
  const authcon = useContext(AuthContext);
  console.log(authcon);

  const handleLogout = async () => {
    try {
      // Sign out the user from Firebase
      await authcon.logout();

      // Redirect to the login page or any other desired location
      location("/auth"); // You should define your login route path
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div>
      // <Sidebar></Sidebar>
      <button className="ml-40" onClick={handleLogout}>
        Logout
      </button>
      <div className="ml-40">
        <QRCodeSVG value={"ra,:jnhdaskcj"} />
      </div>
    </div>
  );
};

export default Home;
