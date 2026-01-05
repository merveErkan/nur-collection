import { useEffect, useState } from "react";
import React from "react";
import PanelTemplate from "./PanelTemplate";
import { useNavigate } from "react-router-dom";
import SplashScreen from './SplashScreen';

function MyOrder() {
    const navigate = useNavigate();
    const git = (page) => {
        navigate(`${page}`)
    }
    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        // Login dosyasında düzelttiğimiz 'info' paketini okuyoruz
        const storedInfo = localStorage.getItem("info");
        if (storedInfo) {
            const info = JSON.parse(storedInfo);
            console.log("Sorgulanan Person ID:", info.person_id);
            const pId = info.person_id;

            fetch(`https://nur-collection-backend-860749273875.europe-west1.run.app/order/my-orders/${pId}`)
                .then(res => res.json())
                .then(data => {
                    console.log("Backend'den gelen veri:", data);
                    if (data.success && data.orders.length > 0) {
                        setOrders(data.orders);
                    } else {
                        console.log("Sipariş listesi boş geldi");
                    }
                    setTimeout(() => {
                        setLoading(false);
                    }, 1000);
                })
                .catch(err => {
                    console.error("Loading error:", err);
                    setLoading(false);
                });
        }
    }, []);



    const tableStyle = {
        padding: "12px",
        textAlign: "left",
        border: "1px solid #ddd"
    };

    if (loading) {
        return <SplashScreen text="Orders are being prepared...." />;
    }
    return (
        <PanelTemplate
            title="My Order"
            rightContent={
                <div style={{ padding: "20px" }}>
                    {loading ? (
                        <p>Loading your orders...</p>
                    ) : orders.length === 0 ? (
                        <p>You don't have any orders yet.</p>
                    ) : (
                        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
                            <thead>
                                <tr style={{ backgroundColor: "#538456ff", color: "white" }}>
                                    <th style={tableStyle}>Order ID</th>
                                    <th style={tableStyle}>Date</th>
                                    <th style={tableStyle}>Total Amount</th>
                                    <th style={tableStyle}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((o) => (
                                    <tr key={o.order_id} style={{ borderBottom: "1px solid #ddd" }}>
                                        <td style={tableStyle}>{o.order_id}</td>
                                        <td style={tableStyle}>{o.order_date}</td>
                                        <td style={tableStyle}>{o.total_amount} ₺</td>
                                        <td style={tableStyle}>
                                            <span style={{ color: "green", fontWeight: "bold" }}>
                                                {o.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            }
        />
    );
}

export default MyOrder;