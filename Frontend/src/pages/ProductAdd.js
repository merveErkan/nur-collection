import React, { useState } from "react";
import PanelTemplate from "./PanelTemplate";
import { useNavigate } from "react-router-dom";

function ProductAdd() {
    const navigate = useNavigate();
    const location = window.location;
    const role = location.pathname.startsWith("/manager") ? "manager" : location.pathname.startsWith("/employee") ? "employee" : "customer";
    const basePath = role === "manager" ? "/manager" : role === "employee" ? "/employee" : "/customer";

    const git = (page) => {
        navigate(`${page}`)
    }
    const [imageUrl, setImageUrl] = useState("");

    const [formData, setFormData] = useState({
        category_id: "",
        product_name: "",
        price: "",
        material: "",
        color: "",
        quantity: 0,
        size: "",       // Scarf
        lengt: "",     // Shawl
        body: ""     // Bonnet

    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const fileName = "/images/" + file.name;
            setImageUrl(fileName); // State'i güncelle
            console.log("Selected file name:", fileName);
        } else {

            setImageUrl("/images/default.png");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            ...formData,
            image_url: imageUrl
        };

        try {
            const response = await fetch("http://localhost:5003/product/insert", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            alert(data.message);

            if (data.success) {
                window.location.href = `${basePath}/productList`;
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred while adding the product.");
        }
    };
    return (
        <PanelTemplate
            title="Product Add"
            rightContent={
                <div className="panel button">
                    <form onSubmit={handleSubmit} style={{ width: "400px" }}>
                        <label>Catagory</label>
                        <select name="category_id" onChange={handleChange}>
                            <option value="">Select Category</option>
                            <option value="1">Swal</option>
                            <option value="2">Scarf</option>
                            <option value="3">Bonnet</option>
                        </select>

                        <input
                            name="product_name"
                            type="text"
                            placeholder="Product Name"
                            onChange={handleChange}
                        />

                        <input
                            name="price"
                            type="number"
                            placeholder="Price"
                            onChange={handleChange}
                        />
                        <input
                            name="material"
                            type="text"
                            placeholder="Material"
                            onChange={handleChange}
                        />
                        <input
                            name="color"
                            type="text"
                            placeholder="Color"
                            onChange={handleChange}
                        />
                        <input
                            name="quantity"
                            type="number"
                            placeholder="Quantity"
                            onChange={handleChange}
                        />
                        <label>Select Product Image:</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            style={{ marginBottom: "10px" }}
                        />
                        {imageUrl && <p style={{ fontSize: "12px", color: "gray" }}>Path to be saved: {imageUrl}</p>}

                        {/* Dynamic Fields */}
                        {formData.category_id === "2" && (
                            <input
                                name="size"
                                type="text"
                                placeholder="Size (e.g., 90x90)"
                                onChange={handleChange}
                            />
                        )}

                        {formData.category_id === "1" && (
                            <input
                                name="lengt"
                                type="number"
                                placeholder="Lengt (cm)"
                                onChange={handleChange}
                            />
                        )}

                        {formData.category_id === "3" && (
                            <select name="body" onChange={handleChange}>
                                <option value="">Select Body</option>
                                <option value="L">L</option>
                                <option value="M">M</option>
                                <option value="S">S</option>
                            </select>
                        )}

                        <button type="submit">Add Product</button>

                    </form>
                </div>
            }
        />
    );
}

export default ProductAdd;