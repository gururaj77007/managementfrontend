import React, { useState } from "react";
import firebaseApp from "../../firebase/firebase-config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../store/authcontext";
import { useContext } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigate();
  const authcon = useContext(AuthContext);
  console.log(authcon);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await signInWithEmailAndPassword(
        firebaseApp,
        email,
        password
      );

      // Check if login was successful
      if (response.user) {
        // Store the UID in local storage
        //localStorage.setItem("uid", response.user.uid);
        authcon.authenticate(response.user.uid);
        console.log("UID stored in local storage:", response.user.uid);
        navigation("/");

        // Redirect or perform other actions here for successful login
      } else {
        console.error("Login failed.");
      }
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
