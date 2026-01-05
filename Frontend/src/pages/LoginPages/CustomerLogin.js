import React, { useState } from "react";
import "../../styles/Selection.css";
import gorsel from "../../assets/image_3840.webp";
import { useNavigate } from "react-router-dom";

function CustomerLogin() {
  const navigate = useNavigate();
  const back = () => {
    navigate('/login/customer');
  }

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault(); // Burada giriş işlemi yapılacak


    try {
      const response = await fetch("http://localhost:5003/customer/login", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      console.log("LOGIN RESPONSE:", data);

      if (!data.success || !data.user) {
        setMessage(data.message || "Login failed");
        return;
      }
      const cleanedUser = {
        ...data.user,
        // Eğer backend hatalıysa ve username alanında adres varsa, ismi zorla birleştirip yazdırıyoruz
        username: (data.user.first_name && data.user.last_name)
          ? `${data.user.first_name} ${data.user.last_name}`
          : (data.user.username || "Müşteri")
      };

      // Önce eskiyi temizle (opsiyonel ama iyi)
      localStorage.removeItem("person_id");
      localStorage.removeItem("customer_id");
      localStorage.removeItem("info");

      // Doğru şekilde yaz
      localStorage.setItem("person_id", String(data.user.person_id));
      localStorage.setItem("customer_id", String(data.user.customer_id));
      localStorage.setItem("info", JSON.stringify(data.user));

      navigate("/customer/productList");

    }
    catch (err) {
      console.error("Login error:", err);
      setMessage("An error occurred during login. Please try again later.");
    }
  };



  return (
    <div className="roll-selection">
      <div className="roll-left">
        <h2> Customer Login </h2>
        <form className=" login-form" onSubmit={handleSubmit}>
          <input type="text" placeholder="UserName" value={username} onChange={(e) => setUsername(e.target.value)} />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button>Login</button>
          <button type="button" onClick={back}>
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

export default CustomerLogin;



