import React, { useState } from "react";
import "../styles/Panel.css";
import { useNavigate } from "react-router-dom";
import PanelTemplate from "./PanelTemplate";


function ManagerPanel() {
    const navigate = useNavigate();
    const git = (page) => {
        navigate(`/manager/${page}`)

    };

    return (
        <PanelTemplate
            role="manager"
            rightContent={
                <h2>Welcome to the Manager Panel</h2>
            }
        />
    );
}

export default ManagerPanel;