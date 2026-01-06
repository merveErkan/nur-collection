import React, { useEffect, useState } from "react";
import PanelTemplate from "./PanelTemplate";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function Reports() {
    const [persons, setPersons] = useState([]);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5003/manager/generalReport")
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setPersons(data.report);
                }
            })
        // Product verilerini çek
        fetch("http://localhost:5003/manager/productList")
            .then(res => res.json())
            .then(data => { if (data.success) setProducts(data.products); });
    }, []);

    // ==========================================
    //   PDF OLUŞTURMA VE İNDİRME FONKSİYONU
    // ==========================================
    const personDownloadPDF = () => {
        try {
            const doc = new jsPDF({
                orientation: "landscape",
                unit: "mm",
                format: "a4"
            });

            // Başlık Ayarları
            doc.setFontSize(18);
            doc.setTextColor(40);
            doc.text("General Staff and Customer Report", 14, 15);

            doc.setFontSize(10);
            doc.text(`Date: ${new Date().toLocaleString()}`, 14, 22);

            // Tablo Sütunlarını Tanımla
            const tableColumn = ["ID", "First Name", "Last Name", "Gender", "Email", "Address", "City", "Posal Code", "Phone Number", "Age", "Role", "Username"];

            // Tablo Verilerini Hazırla
            const tableRows = persons.map(p => [
                p.person_id,
                p.first_name,
                p.last_name,
                p.gender,
                p.email,
                p.address,
                p.city,
                p.postal_code,
                p.phone_number,
                p.age,
                p.role,
                p.username
            ]);

            autoTable(doc, {
                head: [tableColumn],
                body: tableRows,
                startY: 30,
                theme: 'grid',
                headStyles: { fillColor: [83, 132, 86] },
                styles: { fontSize: 9 }
            });

            // Dosyayı Kaydet
            doc.save("Person_General_Report.pdf");

        } catch (error) {
            console.error("Detailed PDF Error:", error);
            alert("The PDF could not be created. Please check that the libraries are installed.");
        }
    };

    const productDownloadPDF = () => {
        try {
            const doc = new jsPDF({
                orientation: "landscape",
                unit: "mm",
                format: "a4"
            });

            doc.setFontSize(18);
            doc.text("Stock Status and Inventory Report", 14, 15);
            doc.setFontSize(10);
            doc.text(`Report Date: ${new Date().toLocaleString()}`, 14, 22);

            // Tablo Sütunları
            const tableColumn = [
                "ID", "Category ID", "Price", "Material", "Color", "Stock Quantity"
            ];

            // Tablo Verileri
            const tableRows = products.map(p => [
                p.product_id,
                p.category_id,
                `${p.price} TL`,
                p.material,
                p.color,
                p.quantity
            ]);

            // PDF Tablosunu Oluştur
            autoTable(doc, {
                head: [tableColumn],
                body: tableRows,
                startY: 30,
                theme: 'striped',
                headStyles: { fillColor: [83, 132, 86] },
                didDrawCell: (data) => {

                    if (data.column.index === 5 && data.cell.section === 'body') {
                        const quantity = parseInt(data.cell.raw);
                        if (quantity < 2) {
                            doc.setTextColor(255, 0, 0); // Kırmızı yazı
                        }
                    }
                }
            });

            doc.save("Stok_Durum_Raporu.pdf");
        } catch (error) {
            console.error("PDF Hatası:", error);
            alert("Stok raporu oluşturulurken bir hata oluştu.");
        }
    };
    return (
        <PanelTemplate
            title="Reports"
            rightContent={
                <div>


                    <div style={{ width: "100%" }}>
                        <div style={{ marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <h2 style={{ color: "#2f4036" }}>General Person List</h2>

                            <button
                                type="button"
                                onClick={personDownloadPDF}
                                style={{
                                    backgroundColor: "#538456ff",
                                    color: "white",
                                    padding: "10px 25px",
                                    borderRadius: "8px",
                                    border: "none",
                                    cursor: "pointer",
                                    fontWeight: "bold",
                                    boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
                                }}
                            >
                                Download Person Report PDF
                            </button>
                        </div>

                        <table className="orders-table" border="1" style={{
                            fontSize: "10px",
                            marginTop: "10px"
                        }}>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>First Name</th>
                                    <th>Last Name</th>
                                    <th>Gender</th>
                                    <th>Email</th>
                                    <th>address</th>
                                    <th>City</th>
                                    <th>postal_code</th>
                                    <th>Phone</th>
                                    <th>Age</th>
                                    <th>Username</th>
                                    <th>Role</th>
                                </tr>
                            </thead>
                            <tbody>
                                {persons.map(p => (
                                    <tr key={p.person_id} style={{ cursor: "pointer" }}>
                                        <td>{p.person_id}</td>
                                        <td>{p.first_name}</td>
                                        <td>{p.last_name}</td>
                                        <td>{p.gender}</td>
                                        <td>{p.email}</td>
                                        <td>{p.address}</td>
                                        <td>{p.city}</td>
                                        <td>{p.postal_code}</td>
                                        <td>{p.phone_number}</td>
                                        <td>{p.age}</td>
                                        <td>{p.username}</td>
                                        <td style={{ fontWeight: "bold" }}>{p.role}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div style={{ width: "100%", maxWidth: "1000px" }}>
                        <div style={{ marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <h2 style={{ color: "#2f4036" }}>Stock Status (Products)</h2>
                            <button
                                type="button"
                                onClick={productDownloadPDF}
                                style={{
                                    backgroundColor: "#538456ff",
                                    color: "white",
                                    padding: "10px 25px",
                                    borderRadius: "8px",
                                    border: "none",
                                    cursor: "pointer",
                                    fontWeight: "bold",
                                    boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
                                }}
                            >
                                Download Product Report PDF
                            </button>
                        </div>
                        <table className="orders-table" style={{ fontSize: "11px", backgroundColor: "#f9fbf9" }}>
                            <thead >
                                <tr>
                                    <th>Product ID</th>
                                    <th>Category Id</th>
                                    <th>Price</th>
                                    <th>Material</th>
                                    <th>Color</th>
                                    <th>Image URL</th>
                                    <th style={{ minWidth: "100px" }}>Stock Quantity</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map(p => (
                                    <tr key={p.product_id} style={{ backgroundColor: p.stock_quantity < 5 ? "#ffebed" : "transparent" }}>
                                        <td>{p.product_id}</td>
                                        <td>{p.category_id}</td>
                                        <td>{p.price}</td>
                                        <td>{p.material} TL</td>
                                        <td>{p.color}</td>
                                        <td>{p.image_url}</td>
                                        <td style={{ padding: "4px", fontWeight: "bold", color: p.quantity < 2 ? "red" : "black" }}>
                                            {p.quantity} {p.quantity < 2 && "(Low!)"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            }
        />
    );
}

export default Reports;