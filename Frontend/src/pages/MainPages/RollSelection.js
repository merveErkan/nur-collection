import React from "react";
//react-router-dom kütüphanesinden useNavigate fonksiyonunu içe aktarıyoruz.
// Bu fonksiyon, JavaScript ile sayfalar arasında yönlendirme yapmamızı sağlar.
import { useNavigate } from "react-router-dom";
import "../../styles/Selection.css";
import gorsel from "../../assets/image_3840.webp";

function RollSelection() {
    // useNavigate fonksiyonu sayesinde yönlendirme yapabilmek için "navigate" değişkenini tanımlıyoruz.
    const navigate = useNavigate();

    const git = (roll) => {
        navigate(`/login/${roll}`);
    };

    return (
        <div className="roll-selection">
            {/* Sol taraf: yazı ve butonlar */}
            <div className="roll-left">
                <h2>Select Your Login Type</h2>
                <button onClick={() => git("manager")}>Manager</button>
                <button onClick={() => git("employee")}>Employee</button>
                <button onClick={() => git("customer")}>Customer</button>
            </div>

            {/* Sağ taraf: görsel */}
            <div className="roll-right">
                <img src={gorsel} alt="Rol Görseli" />
            </div>
        </div>
    );
}

export default RollSelection;
