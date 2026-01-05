import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom"; // 1. useLocation eklendi
import PanelTemplate from "./PanelTemplate";

function Details() {
    const { id } = useParams();
    const location = useLocation(); // 2. window.location yerine hook kullanıldı

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [cart, setCart] = useState([]);

    const [info] = useState(() => {
        const stored = localStorage.getItem("info");
        return stored ? JSON.parse(stored) : {};
    });

    const personId = info?.person_id;
    const cartkey = personId ? `cart_${personId}` : null;

    // 3. Rol tespiti location.pathname üzerinden yapılıyor
    const role = location.pathname.startsWith("/manager")
        ? "manager"
        : location.pathname.startsWith("/employee")
            ? "employee"
            : "customer";

    const productImages = {
        1: "/images/Swal.png",
        2: "/images/scarf1.png",
        3: "/images/Bonnet1.png",
    };

    useEffect(() => {
        fetch(`https://nur-collection-backend-860749273875.europe-west1.run.app/product/${id}`)
            .then((res) => {
                if (!res.ok) throw new Error("Sunucu hatası: " + res.status);
                return res.json();
            })
            .then((data) => {
                setProduct(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Veri çekme hatası:", err);
                setLoading(false);
            });
    }, [id]);

    useEffect(() => {
        if (!cartkey) {
            setCart([]);
            return;
        }
        const storedCart = JSON.parse(localStorage.getItem(cartkey)) || [];
        setCart(storedCart);
    }, [cartkey]);

    const addToCart = (productToCart) => {
        if (!cartkey) {
            alert("User information could not be found, please log in again..");
            return;
        }
        let updatedCart = [...cart];
        const index = updatedCart.findIndex(item => item.product.product_id === productToCart.product_id);

        if (index !== -1) {
            if (updatedCart[index].quantity >= productToCart.quantity) {
                alert("Insufficient products in stock.!");
                return;
            }
            updatedCart[index].quantity += 1;
        } else {
            if (productToCart.quantity <= 0) {
                alert("This product is out of stock.!");
                return;
            }
            updatedCart.push({ product: productToCart, quantity: 1 });
        }
        localStorage.setItem(cartkey, JSON.stringify(updatedCart));
        setCart(updatedCart);
        alert("Product added to cart!");
    };

    if (loading) return <div>Loading...</div>;
    if (!product) return <div>Product not found.</div>;

    return (
        <PanelTemplate
            role={role} // 4. KRİTİK: PanelTemplate'e tespit edilen rolü gönderdik
            rightContent={
                <div style={{ padding: "20px" }}>
                    <h2 style={{ borderBottom: "2px solid #eee", paddingBottom: "10px" }}>
                        Ürün Detay Paneli (Master-Detail)
                    </h2>

                    <div style={{ display: "flex", gap: "40px", marginTop: "20px", flexWrap: "wrap" }}>
                        {/* SOL TARAF: Ürün Görseli */}
                        <div style={{ flex: "1", minWidth: "300px" }}>
                            <img
                                src={product.image_url && product.image_url !== "/images/default.png"
                                    ? product.image_url
                                    : (productImages[Number(product.category_id)] || "/images/default.png")}
                                alt={`${product.material} ${product.category_name}`}
                                style={{
                                    width: "100%",
                                    height: "450px",
                                    objectFit: "cover",
                                    borderRadius: "15px",
                                    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                                    display: "block"
                                }}
                                onError={(e) => { e.target.src = "/images/default.png"; }}
                            />
                        </div>

                        {/* SAĞ TARAF: Veritabanı Detayları */}
                        <div style={{ flex: "1", minWidth: "300px" }}>
                            <div style={{ backgroundColor: "#f9f9f9", padding: "20px", borderRadius: "12px" }}>
                                {/* Rol kontrolü için info?.role yerine yukarıda hesapladığımız role'ü de kullanabilirsin */}
                                {(role === "manager" || role === "employee") && (
                                    <p><strong>Product ID:</strong> #{product.product_id}</p>
                                )}
                                <p><strong>Category:</strong> {product.category_name}</p>

                                <p><strong>Material:</strong> {product.material}</p>
                                <p><strong>Color:</strong> {product.color}</p>
                                <p><strong>Price:</strong> <span style={{ color: "#2e7d32", fontSize: "1.2em", fontWeight: "bold" }}>{product.price} TL</span></p>
                                <p><strong>Stock Status:</strong> {product.quantity}</p>
                            </div>

                            {/* Sadece customer butonu görsün */}
                            {role === "customer" && (
                                <button
                                    onClick={() => addToCart(product)}
                                    style={{
                                        marginTop: "20px",
                                        width: "100%",
                                        padding: "15px",
                                        backgroundColor: "#ff9800",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "8px",
                                        cursor: "pointer",
                                        fontSize: "1.1em",
                                        fontWeight: "bold"
                                    }}
                                >
                                    Add to Cart
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            }
        />
    );
}

export default Details;