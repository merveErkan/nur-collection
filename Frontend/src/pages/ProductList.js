import React, { useState, useEffect } from "react";
import PanelTemplate from "./PanelTemplate";
import { useNavigate, useLocation } from "react-router-dom";
import SplashScreen from './SplashScreen';

function ProductList() {
    const navigate = useNavigate();
    const location = window.location;
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);

    const [info, setInfo] = useState(() => {
        const stored = localStorage.getItem("info");
        return stored ? JSON.parse(stored) : {};
    });

    const role = location.pathname.startsWith("/manager") ? "manager" : location.pathname.startsWith("/employee") ? "employee" : "customer";
    const basePath = role === "manager" ? "/manager" : role === "employee" ? "/employee" : "/customer";

    const git = (page) => {
        navigate(`${basePath}/productList/${page}`)
    }

    // 1. Ürünleri çeken useEffect
    useEffect(() => {
        fetch("http://localhost:5003/product/list")
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setProducts(data.products);
                }
                setTimeout(() => {
                    setLoading(false);
                }, 1000);
            })
            .catch(err => {
                console.error("Loading error:", err);
                setLoading(false);
            });
    }, []);

    const personId = info?.person_id;
    const cartkey = personId ? `cart_${personId}` : null;


    useEffect(() => {
        if (!cartkey) {
            setCart([]);
            return;
        }

        const storedCart = JSON.parse(localStorage.getItem(cartkey)) || [];
        setCart(storedCart);
    }, [cartkey]);

    // 🔥 TÜM HOOKLAR (useEffect'ler) BİTTİ, ŞİMDİ KONTROL YAPABİLİRİZ
    if (loading) {
        return <SplashScreen text="Products are being prepared...." />;
    }

    // 3. Diğer fonksiyonlar ve değişkenler
    const productImages = {
        1: "/images/Swal.png",
        2: "/images/scarf1.png",
        3: "/images/Bonnet1.png",
    };

    const handleDetailClick = (id) => {
        navigate(`${basePath}/product-detail/${id}`); // Başına basePath eklediğimizden emin oluyoruz
    };
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product??")) return;
        try {
            const response = await fetch(`http://localhost:5003/product/delete/${id}`, { method: "DELETE" });
            const data = await response.json();
            if (data.success) {
                alert("Product deleted!");
                setProducts(prev => prev.filter(p => p.product_id !== id));
            } else { alert(data.message); }
        } catch (err) { alert("Error while deleting product."); }
    };

    const addToCart = (product) => {
        if (!cartkey) {
            alert("User information could not be found, please log in again..");
            return;
        }
        let updatedCart = [...cart];
        const index = updatedCart.findIndex(item => item.product.product_id === product.product_id);
        if (index !== -1) {
            if (updatedCart[index].quantity >= product.quantity) { alert("Insufficient products in stock.!"); return; }
            updatedCart[index].quantity += 1;
        } else {
            if (product.quantity <= 0) { alert("This product is out of stock.!"); return; }
            updatedCart.push({ product, quantity: 1 });
        }
        localStorage.setItem(cartkey, JSON.stringify(updatedCart));
        setCart(updatedCart);
    };

    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const handleIncreaseStock = async (productId) => {
        // URL'deki 'manager' kısmını 'product' olarak değiştirdik
        try {
            const response = await fetch(`http://localhost:5003/product/increaseStock/${productId}`, {
                method: "POST"
            });

            if (!response.ok) throw new Error("Sayfa bulunamadı (404)");

            const data = await response.json();
            if (data.success) {
                setProducts(prev =>
                    prev.map(p => p.product_id === productId ? { ...p, quantity: p.quantity + 1 } : p)
                );
            }
        } catch (err) {
            console.error("Hata:", err);
        }
    };

    return (
        <PanelTemplate
            title="Product List"
            rightContent={
                <div>
                    {role == "manager" && (
                        <>
                            <button type="button" onClick={() => git("productAdd")} style={{
                                backgroundColor: "#538456ff",
                                color: "white",
                                padding: "10px 20px",
                                borderRadius: "8px",
                                border: "none",
                                cursor: "pointer"
                            }}>ProductAdd</button>
                        </>
                    )}
                    {role == "employee" && (
                        <>
                            <button type="button" onClick={() => git("productAdd")} style={{
                                backgroundColor: "#538456ff",
                                color: "white",
                                padding: "10px 20px",
                                borderRadius: "8px",
                                border: "none",
                                cursor: "pointer"
                            }}>ProductAdd</button>
                        </>
                    )}
                    {role == "customer" && (
                        <div style={{ display: "flex", justifyContent: "flex-end" }}>

                            <button
                                onClick={() => git("account")}
                                style={{
                                    backgroundColor: "#538456ff",
                                    color: "white",
                                    padding: "10px 20px",
                                    borderRadius: "8px",
                                    border: "none",
                                    cursor: "pointer"
                                }}
                            >
                                {info?.username}
                            </button>

                            <button
                                onClick={() => git("productCart")}
                                style={{
                                    backgroundColor: "#538456ff",
                                    color: "white",
                                    padding: "10px 20px",
                                    borderRadius: "8px",
                                    border: "none",
                                    cursor: "pointer"
                                }}
                            >
                                Cart ({totalCount})
                            </button>

                        </div>

                    )}
                    <div className="product-grid">
                        {products.map(p => (
                            <div className="product-card" key={p.product_id}>

                                {/* MANAGER GÖRÜNÜMÜ */}
                                {role === "manager" && (
                                    <div style={{ cursor: "pointer" }}>
                                        <img
                                            src={p.image_url && p.image_url !== "/images/default.png" ? p.image_url : (productImages[p.category_id] || "/images/default.png")}
                                            alt={`${p.product_name} {p.category_name}`}
                                            className="product-cart"
                                            onError={(e) => { e.target.src = "/images/default.png"; }}
                                        />
                                        <h3>{p.product_name} {p.category_name}</h3>
                                        <p>{p.material}</p>
                                        <p>{p.price} ₺ - {p.quantity}</p>
                                        <button
                                            onClick={() => handleIncreaseStock(p.product_id)}
                                            style={{
                                                backgroundColor: "#2f4036",
                                                color: "white",
                                                border: "none",
                                                borderRadius: "4px",
                                                width: "25px",
                                                height: "25px",
                                                cursor: "pointer",
                                                fontSize: "16px",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center"
                                            }}
                                        >
                                            +1
                                        </button>
                                        <button
                                            onClick={() => handleDetailClick(p.product_id)}
                                            style={{
                                                backgroundColor: "#5abc60ff",
                                                color: "white",
                                                padding: "10px 20px",
                                                borderRadius: "8px",
                                                border: "none",
                                                cursor: "pointer",
                                                fontWeight: "bold"
                                            }}
                                        >
                                            View Details
                                        </button>
                                        <button type="button" onClick={() => handleDelete(p.product_id)} style={{ backgroundColor: "#cd2014ff", color: "white", padding: "10px 20px", borderRadius: "8px", border: "none", cursor: "pointer" }}>
                                            Delete
                                        </button>
                                    </div>
                                )}

                                {/* EMPLOYEE GÖRÜNÜMÜ */}
                                {role === "employee" && (
                                    <>
                                        <div style={{ cursor: "pointer" }}>
                                            <img
                                                src={p.image_url && p.image_url !== "/images/default.png" ? p.image_url : (productImages[p.category_id] || "/images/default.png")}
                                                alt={`${p.product_name} {p.category_name}`}
                                                className="product-image"
                                                onError={(e) => { e.target.src = "/images/default.png"; }}
                                            />
                                            <h3>{p.product_name} {p.category_name}</h3>
                                            <p>{p.material}</p>
                                            <p>{p.price} ₺ - {p.quantity}</p>
                                            <button
                                                onClick={() => handleIncreaseStock(p.product_id)}
                                                style={{
                                                    backgroundColor: "#2f4036",
                                                    color: "white",
                                                    border: "none",
                                                    borderRadius: "4px",
                                                    width: "25px",
                                                    height: "25px",
                                                    cursor: "pointer",
                                                    fontSize: "16px",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center"
                                                }}
                                            >
                                                +1
                                            </button>
                                            <button
                                                onClick={() => handleDetailClick(p.product_id)}
                                                style={{
                                                    backgroundColor: "#5abc60ff",
                                                    color: "white",
                                                    padding: "10px 20px",
                                                    borderRadius: "8px",
                                                    border: "none",
                                                    cursor: "pointer",
                                                    fontWeight: "bold"
                                                }}
                                            >
                                                View Details
                                            </button>

                                        </div>
                                        <button type="button" onClick={() => handleDelete(p.product_id)} style={{ backgroundColor: "#cd2014ff", color: "white", padding: "10px 20px", borderRadius: "8px", border: "none", cursor: "pointer" }}>
                                            Delete
                                        </button>
                                    </>
                                )}

                                {/* CUSTOMER GÖRÜNÜMÜ */}
                                {role === "customer" && (
                                    <>
                                        <div style={{ cursor: "pointer" }}>
                                            <img
                                                src={p.image_url && p.image_url !== "/images/default.png" ? p.image_url : (productImages[p.category_id] || "/images/default.png")}
                                                alt={`${p.product_name} {p.category_name}`}
                                                onError={(e) => { e.target.src = "/images/default.png"; }}
                                            />
                                            <h3>{p.product_name} {p.category_name}</h3>
                                            <p>{p.material}</p>
                                            <p>{p.price} ₺ - {p.quantity}</p>
                                        </div>
                                        <button
                                            onClick={() => handleDetailClick(p.product_id)}
                                            style={{
                                                backgroundColor: "#5abc60ff",
                                                color: "white",
                                                padding: "10px 20px",
                                                borderRadius: "8px",
                                                border: "none",
                                                cursor: "pointer",
                                                fontWeight: "bold"
                                            }}
                                        >
                                            View Details
                                        </button>
                                        <button type="button" onClick={() => addToCart(p)} style={{ padding: "10px", backgroundColor: "#538456ff", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}>
                                            Add to Cart
                                        </button>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </ div>

            }
        />
    );
}

export default ProductList;