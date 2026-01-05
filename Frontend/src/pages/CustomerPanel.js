import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PanelTemplate from "./PanelTemplate";

function CustomerPanel() {
    const navigate = useNavigate();
    const git = (page) => {
        navigate(`${page}`)
    }
    return (
        <PanelTemplate
            title={CustomerPanel}
            role="customer"
            rightContent={
                <h2></h2>

            }
        />
    );
}

export default CustomerPanel;