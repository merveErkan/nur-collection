import React, { useEffect, useState } from "react";
import PanelTemplate from "./PanelTemplate";

function Orders() {
    const [orders, setOrders] = useState([]);
    const [pendingOrders, setPendingOrders] = useState([]);
    const [approvedOrders, setApprovedOrders] = useState([]);

    const fetchData = async () => {
        try {

            const resP = await fetch("https://nur-collection-backend-860749273875.europe-west1.run.app/order/pending");
            const dataP = await resP.json();
            if (dataP.success) setPendingOrders(dataP.orders);


            const resA = await fetch("https://nur-collection-backend-860749273875.europe-west1.run.app/order/approved-list");
            const dataA = await resA.json();
            if (dataA.success) setApprovedOrders(dataA.orders);
        } catch (error) {
            console.error("Veri çekme hatası:", error);
        }
    };
    useEffect(() => { fetchData(); }, []);

    useEffect(() => {
        fetch("https://nur-collection-backend-860749273875.europe-west1.run.app/order/pending")
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setOrders(data.orders);
                }
            });
    }, []);

    const handleApprove = async (id) => {
        const res = await fetch(`https://nur-collection-backend-860749273875.europe-west1.run.app/order/approve/${id}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                approved_by_id: localStorage.getItem("person_id"),
                approved_by_role: localStorage.getItem("role")
            })
        });
        const data = await res.json();
        if (data.success) {
            alert("Sipariş Onaylandı ve Arşive Taşındı!");
            fetchData(); // Listeleri yenilemek için verileri tekrar çek
        }
    };

    const handleReject = async (id) => {
        if (!window.confirm("Bu siparişi reddetmek ve tamamen silmek istediğine emin misin?")) return;

        const res = await fetch(`https://nur-collection-backend-860749273875.europe-west1.run.app/order/reject/${id}`, {
            method: "DELETE"
        });
        const data = await res.json();
        if (data.success) {
            alert("Sipariş tamamen silindi.");
            setPendingOrders(prev => prev.filter(o => o.pending_order_id !== id));
        }
    };

    return (
        <PanelTemplate
            title="Orders"
            rightContent={
                <div style={{ width: "100%" }}>


                    <h3 style={{ color: "#d35400", textAlign: "center" }}> Approved Orders</h3>
                    {approvedOrders.length === 0 ? (
                        <p>No approved orders yet.</p>
                    ) : (
                        <table className="orders-table" border="1" style={{
                            fontSize: "10px",
                            marginTop: "10px"
                        }}>
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Customer</th>
                                    <th>Order Date</th>
                                    <th>Total Amount</th>
                                    <th>Approved By</th>
                                </tr>
                            </thead>
                            <tbody>
                                {approvedOrders.map(o => (
                                    <tr key={o.order_id}>
                                        <td>{o.order_id}</td>
                                        <td>{o.customer_name}</td>
                                        <td>{o.order_date}</td>
                                        <td>{o.total_amount} ₺</td>
                                        <td> {o.approved_by_name} ({o.approved_by_role})</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}


                    <div style={{ margin: "50px 0" }}></div>

                    <h3 style={{ color: "#d35400", textAlign: "center" }}> Pending Orders</h3>
                    {pendingOrders.length === 0 ? (
                        <p>No pending orders.</p>
                    ) : (
                        <table className="orders-table" border="1" style={{
                            fontSize: "10px",
                            marginTop: "10px"
                        }}>
                            <thead>
                                <tr>
                                    <th>Pending ID</th>
                                    <th>Customer</th>
                                    <th>Order Date</th>
                                    <th>Total Amount</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pendingOrders.map(order => (
                                    <tr key={order.pending_order_id}>
                                        <td>{order.pending_order_id}</td>
                                        <td>{order.customer_name}</td>
                                        <td>{order.order_date}</td>
                                        <td>{order.total_amount} ₺</td>
                                        <td>
                                            <div className="action-buttons">
                                                <button
                                                    className="confirm-btn"
                                                    onClick={() => handleApprove(order.pending_order_id)}
                                                >
                                                    Confirm
                                                </button>
                                                <button
                                                    className="reject-btn"
                                                    onClick={() => handleReject(order.pending_order_id)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                    <div style={{ margin: "50px 0" }}></div>
                </div>
            }
        />
    );
}

export default Orders;
