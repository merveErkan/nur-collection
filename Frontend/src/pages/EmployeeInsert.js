import React, { useState } from "react";
import PanelTemplate from "./PanelTemplate";
import { useNavigate } from "react-router-dom";

function EmployeeInsert() {
    const navigate = useNavigate();
    const git = (page) => {
        navigate(`${page}`)
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
        password: "",
        hire_date: "",
        salary: "",
        service_duration: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:5003/employee/insert", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            alert(data.message);

        } catch (err) {
            console.error("Insert error:", err);
            alert("Error while inserting employee.");
        }
    };

    return (
        <PanelTemplate
            title="Employee Insert"
            rightContent={
                <div className="panel button">
                    <form onSubmit={handleSubmit}>
                        <input name="first_name" placeholder="First Name" onChange={handleChange} />
                        <input name="last_name" placeholder="Last Name" onChange={handleChange} />
                        <input name="gender" placeholder="Gender" onChange={handleChange} />
                        <input name="email" placeholder="Email" onChange={handleChange} />
                        <input name="address" placeholder="Address" onChange={handleChange} />
                        <input name="city" placeholder="City" onChange={handleChange} />
                        <input name="postal_code" placeholder="Postal Code" onChange={handleChange} />
                        <input name="phone_number" placeholder="Phone" onChange={handleChange} />
                        <input name="age" placeholder="Age" onChange={handleChange} />
                        <input name="username" placeholder="Username" onChange={handleChange} />
                        <input type="password" name="password" placeholder="Password" onChange={handleChange} />
                        <input name="hire_date" placeholder="Hire Date (YYYY-MM-DD)" onChange={handleChange} />
                        <input name="salary" placeholder="Salary" onChange={handleChange} />
                        <input name="service_duration" placeholder="Service Duration (e.g. 1 year)" onChange={handleChange} />

                        <button type="submit">Save Employee</button>
                    </form>
                </div>
            }
        />
    );
}

export default EmployeeInsert; 