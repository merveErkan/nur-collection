import React, { useState } from "react";
import "../../styles/Selection.css";
import gorsel from "../../assets/image_3840.webp";
import { useNavigate } from "react-router-dom";
import EmployeePanel from "../EmployeePanel";

function EmployeeLogin() {
  const navigate = useNavigate();
  const login = () => {
    navigate('/login');
  } //bir önceki sayfaya gider

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault(); // Burada giriş işlemi yapılacak

    try {
      const response = await fetch("https://nur-collection-backend-860749273875.europe-west1.run.app/employee/login", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        // 🔥 Önceki tüm verileri kökten temizle
        localStorage.clear();

        // 🔹 Standart "info" paketi
        const userInfo = {
          person_id: data.person_id,
          role: data.role,
          username: data.first_name + " " + data.last_name
        };

        localStorage.setItem("person_id", String(data.person_id));
        localStorage.setItem("role", data.role);
        localStorage.setItem("info", JSON.stringify(userInfo));

        setMessage("Login Successful");
        setTimeout(() => navigate("/employee/panel"), 500);
      }

      else {
        setMessage(data.message);
      }
    }
    catch (err) {
      console.error("Login error:", err);
      setMessage("An error occurred during login. Please try again later.");
    }
  };

  return (
    <div className="roll-selection">
      <div className="roll-left">
        <h2>Employee Login </h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <input type="text" placeholder="UserName" value={username} onChange={(e) => setUsername(e.target.value)} />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="submit">Login</button>
          <button type="button" onClick={login}>
            Back
          </button>
        </form>
        <p>{message}</p>
      </div>

      <div className="roll-right">
        <img src={gorsel} alt="Rol-Görseli" />
      </div>
    </div>
  );
}

export default EmployeeLogin;
