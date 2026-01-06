import React, { useEffect, useState } from "react";
import PanelTemplate from "./PanelTemplate";
import EmployeeInsert from "./EmployeeInsert";
import { useNavigate, useLocation } from "react-router-dom";

function EmployeeList() {
    const navigate = useNavigate();
    const [employees, setEmployees] = useState([]);
    const git = (page) => {
        navigate(`${page}`)
    }
    const location = useLocation();

    // API'den çalışanları çek
    useEffect(() => {
        fetch("http://localhost:5003/manager/employeeList")
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setEmployees(data.employees);
                }
            })
            .catch(err => console.error("Fetch error:", err));
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this employee??")) return;

        try {
            const response = await fetch(`http://localhost:5003/manager/employeeDelete/${id}`, {
                method: "DELETE"
            });

            const data = await response.json();

            if (data.success) {
                alert("Employee deleted!");


                setEmployees(prev => prev.filter(emp => emp.person_id !== id));
            } else {
                alert(data.message);
            }

        } catch (err) {
            console.error("Delete error:", err);
            alert("Error while deleting employee.");
        }
    };


    return (
        <PanelTemplate
            title="Employee List"
            rightContent={
                <div style={{ width: "100%" }}>
                    <button type="button" onClick={() => git("employeeInsert")} style={{
                        backgroundColor: "#538456ff",
                        color: "white",
                        padding: "10px 20px",
                        borderRadius: "8px",
                        border: "none",
                        cursor: "pointer"
                    }}>İnsert</button>
                    <table className="orders-table" border="1" style={{
                        fontSize: "10px",
                        marginTop: "10px"
                    }}>
                        <thead>
                            <tr>
                                <th>Person ID</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Gender</th>
                                <th>Email</th>
                                <th>Address</th>
                                <th>City</th>
                                <th>Postal Code</th>
                                <th>Phone Number</th>
                                <th>Age</th>
                                <th>Username</th>
                                <th>Hire Date</th>
                                <th>Salary</th>
                                <th>Service Duration</th>
                            </tr>
                        </thead>

                        <tbody>
                            {employees.map(emp => (
                                <tr key={emp.person_id}>
                                    <td>{emp.person_id}</td>
                                    <td>{emp.first_name}</td>
                                    <td>{emp.last_name}</td>
                                    <td>{emp.gender}</td>
                                    <td>{emp.email}</td>
                                    <td>{emp.address}</td>
                                    <td>{emp.city}</td>
                                    <td>{emp.postal_code}</td>
                                    <td>{emp.phone_number}</td>
                                    <td>{emp.age}</td>
                                    <td>{emp.username}</td>
                                    <td>{emp.hire_date}</td>
                                    <td>{emp.salary}</td>
                                    <td>{emp.service_duration}</td>

                                    <td>
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(emp.person_id)}
                                            style={{
                                                backgroundColor: "#c50b0bff",
                                                color: "white",
                                                padding: "8px 20px",
                                                borderRadius: "8px",
                                                border: "none",
                                                cursor: "pointer"
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>

                            ))}
                        </tbody>
                    </table>
                </div>
            }
        />
    );
}

export default EmployeeList;
