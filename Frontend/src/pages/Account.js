import React, { useEffect } from "react";
import PanelTemplate from "./PanelTemplate";
import { useNavigate } from "react-router-dom";

function Account() {
    const navigate = useNavigate();
    const git = (page) => {
        navigate(`${page}`)
    }
    const [info, setInfo] = React.useState({});

    // Bilgilerin çekildiği sayfadaki useEffect (Örnek)
    useEffect(() => {
        const personId = localStorage.getItem("person_id"); // ✅ doğru key

        if (!personId || personId === "null" || personId === "undefined") {
            console.error("person_id bulunamadı -> login sayfasına yönlendiriliyor");
            navigate("/login/customer"); // ✅ senin route'una göre düzelt
            return;
        }

        fetch(`https://nur-collection-backend-860749273875.europe-west1.run.app/customer/info/${personId}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    // Backend cevap alan adına göre: data.user veya data.info olabilir
                    setInfo(data.user || data.info);
                } else {
                    console.error("info error:", data.message);
                }
            })
            .catch((err) => console.error("fetch error:", err));
    }, [navigate]);


    return (
        <PanelTemplate
            title="My Account"
            rightContent={
                <div>
                    <p><b>First Name: </b>{info.first_name}</p>
                    <p><b>Last Name: </b>{info.last_name}</p>
                    <p><b>Gender: </b>{info.gender}</p>
                    <p><b>Email: </b>{info.email}</p>
                    <p><b>Address: </b>{info.adress || info.address}</p>
                    <p><b>City : </b>{info.city}</p>
                    <p><b>Post Code: </b>{info.postal_code}</p>
                    <p><b>Phone: </b>{info.phone || info.phone_number}</p>
                    <p><b>Age: </b>{info.age}</p>
                    <p><b>UserName: </b>{info.username}</p>


                </div>


            }
        />
    );
}

export default Account;