import React from "react";
import "../../styles/Selection.css";
import gorsel from "../../assets/image_3840.webp";
import { useNavigate } from "react-router-dom";

function CustomerLog() {
    const navigate = useNavigate();
    const login = () => {
        navigate('/login');
    }
    const git = (roll) => {
        navigate(`/login/customer/${roll}`);
    };
    return (
        <div className="roll-selection">
            <div className="roll-left">
                <h2>Select Your Login Type</h2>
                <button onClick={() => git("login")}> Login </button>
                <button onClick={() => git("signup")}> Sign Up </button>
                <button type="button" onClick={login}>
                    Back
                </button>
            </div>

            <div className="roll-right">
                <img src={gorsel} alt="Rol Görseli" />
            </div>
        </div>
    );
}

export default CustomerLog;
