import React, { useState, useEffect } from 'react';
import "../styles/Panel.css";
import { useNavigate } from "react-router-dom";
import PanelTemplate from "./PanelTemplate";

function EmployeePanel() {
    const navigate = useNavigate();
    const git = (page) => {
        navigate(`${page}`)
    }


    return (
        <PanelTemplate
            title="EmployeePanel"
            role="employee"
            rightContent={
                <h2>Welcome to the Employee Panel</h2>
            }
        />

    );
}

export default EmployeePanel;
