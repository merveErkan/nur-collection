import React, { useState, useEffect } from "react";
import PanelTemplate from "./PanelTemplate";

function ProductCart() {
    const [cart, setCart] = useState([]);
    const [info, setInfo] = useState(null);
    const [products, setProducts] = useState([]);

    // 1. Ürün listesini çek (Fiyat vb. güncel bilgiler için gerekebilir)
    useEffect(() => {
        fetch("http://localhost:5003/product/list")
            .then(res => res.json())
            .then(data => {
                if (data.success) setProducts(data.products);
            });
    }, []);

    // 2. Kullanıcı bilgisini ve o kullanıcıya özel sepeti yükle
    useEffect(() => {
        const storedInfo = localStorage.getItem("info");
        if (storedInfo) {
            const parsedInfo = JSON.parse(storedInfo);
            setInfo(parsedInfo);

            // 🔥 KRİTİK: Sepeti sadece bu kullanıcıya özel ID ile oku
            if (parsedInfo.person_id) {
                const userCartKey = `cart_${parsedInfo.person_id}`;
                const storedCart = JSON.parse(localStorage.getItem(userCartKey)) || [];
                setCart(storedCart);
            }
        }
    }, []);

    // Yardımcı görseller
    const productImages = {
        1: "/images/Swal.png",
        2: "/images/scarf1.png",
        3: "/images/Bonnet1.png",
    };

    // Dinamik sepet anahtarı
    const cartkey = info?.person_id ? `cart_${info.person_id}` : null;

    const decreaseQuantity = (productId) => {
        if (!cartkey) return;
        const updatedCart = cart
            .map(item =>
                item.product.product_id === productId
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
            )
            .filter(item => item.quantity > 0);

        localStorage.setItem(cartkey, JSON.stringify(updatedCart));
        setCart(updatedCart);
    };

    const clearCart = () => {
        if (!cartkey) return;
        localStorage.removeItem(cartkey);
        setCart([]);
    };

    const placeOrder = async () => {
        if (!info?.person_id) {
            alert("Session error, please log in again.");
            return;
        }
        if (cart.length === 0) {
            alert("Your basket is empty.");
            return;
        }

        const totalAmount = cart.reduce((sum, i) => sum + Number(i.product.price) * i.quantity, 0);

        const orderData = {
            customer_id: info.person_id,
            total_amount: totalAmount,
            items: cart.map(item => ({
                product_id: item.product.product_id,
                quantity: item.quantity,
                price: Number(item.product.price)
            }))
        };

        try {
            const response = await fetch("http://localhost:5003/order/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(orderData)
            });
            const data = await response.json();
            if (data.success) {
                alert("Sipariş alındı.");
                localStorage.removeItem(cartkey);
                setCart([]);
            } else {
                alert("Hata: " + data.message);
            }
        } catch (err) {
            alert("Connection error.");
        }
    };

    // UI render kısmı (return) aynı kalıyor...
    return (
        <PanelTemplate
            title="Product Cart"
            rightContent={
                <div className="cart-layout">
                    <div className="cart-products">
                        {cart.length === 0 ? <p>Your shopping cart is currently empty.</p> : (
                            <div className="product-gridcart">
                                {cart.map(item => (
                                    <div className="product-card" key={item.product.product_id}>
                                        <img
                                            src={item.product.image_url && item.product.image_url !== "/images/default.png" ? item.product.image_url : (productImages[item.product.category_id] || "/images/default.png")}
                                            alt={item.product.product_name}
                                            style={{ width: "100%", height: "200px", objectFit: "cover" }}
                                            onError={(e) => { e.target.src = "/images/default.png"; }}
                                        />
                                        <h3>{item.product.product_name}</h3>
                                        <p>{item.product.price} ₺ x {item.quantity}</p>
                                        <button onClick={() => decreaseQuantity(item.product.product_id)}>Adet Azalt</button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="cart-payment">
                        <h3>Summary</h3>
                        <p>Total: {cart.reduce((sum, i) => sum + i.quantity * Number(i.product.price), 0)} ₺</p>
                        {cart.length > 0 && <button className="pay-btn" onClick={placeOrder}>Proceed to payment</button>}
                        <button className="clear-btn" onClick={clearCart}>Clear Cart</button>
                    </div>
                </div>
            }
        />
    );
}

export default ProductCart;