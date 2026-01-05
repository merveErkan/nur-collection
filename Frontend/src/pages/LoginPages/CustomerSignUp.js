import React, { useState } from "react";
import "../../styles/Selection.css";
import gorsel from "../../assets/image_3840.webp";
import { useNavigate } from "react-router-dom";

function CustomerSignUp() {
  const navigate = useNavigate();
  const login = () => {
    navigate('/login/customer');
  }

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    gender: "",
    email: "",
    address: "",
    city: "",
    postal_code: "",
    phone_number: "",
    age: "",
    username: "",
    password: ""
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://nur-collection-backend-860749273875.europe-west1.run.app/customer/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      setMessage(data.message);
    } catch (err) {
      console.error("Signup error:", err);
      setMessage("An error occurred during signup. Please try again later.");
    }
  };

  return (
    <div className="roll-selection">
      <div className="roll-left">
        <h2>Sign Up</h2>
        <form className="login-form" onSubmit={handleSubmit}>

          <input name="first_name" type="text" placeholder="First Name" onChange={handleChange} />
          <input name="last_name" type="text" placeholder="Last Name" onChange={handleChange} />
          <input name="gender" type="text" placeholder="Gender" onChange={handleChange} />
          <input name="email" type="text" placeholder="Email" onChange={handleChange} />
          <input name="address" type="text" placeholder="Address" onChange={handleChange} />
          <input name="city" type="text" placeholder="City" onChange={handleChange} />
          <input name="postal_code" type="text" placeholder="Post Code" onChange={handleChange} />
          <input name="phone_number" type="text" placeholder="Phone Number
          " onChange={handleChange} />
          <input name="age" type="text" placeholder="Age" onChange={handleChange} />
          <input name="username" type="text" placeholder="User Name" onChange={handleChange} />
          <input name="password" type="password" placeholder="Password" onChange={handleChange} />
          <button type="submit">Sign Up</button>
          <button type="button" onClick={login}>Back</button>
        </form>
        <p>{message}</p>
      </div>

      <div className="roll-right">
        <img src={gorsel} alt="Rol-Görseli" />
      </div>
    </div>
  );
}

export default CustomerSignUp;
