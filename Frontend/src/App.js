import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";

import RollSelection from "./pages/MainPages/RollSelection";
import ManagerLogin from "./pages/LoginPages/ManagerLogin";
import EmployeeLogin from "./pages/LoginPages/EmployeeLogin";
import CustomerLogin from "./pages/LoginPages/CustomerLogin";
import CustomerLog from "./pages/LoginPages/CustomerLog";
import CustomerSignUp from "./pages/LoginPages/CustomerSignUp";
import ManagerPanel from "./pages/ManagerPanel";
import EmployeePanel from "./pages/EmployeePanel";
import CustomerPanel from "./pages/CustomerPanel.js";
import EmployeeList from "./pages/EmployeeList";
import ProductList from "./pages/ProductList.js";
import Orders from "./pages/Orders.js";
import EmployeeInsert from "./pages/EmployeeInsert.js";
import ProductAdd from "./pages/ProductAdd.js";
import ProductCart from "./pages/ProductCart.js";
import MyOrder from "./pages/MyOrder.js";
import Account from "./pages/Account.js";
import Reports from "./pages/Reports.js";
import Details from "./pages/Details.js";

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<RollSelection />} />
                <Route path="/login/manager" element={<ManagerLogin />} />
                <Route path="/manager/panel" element={<ManagerPanel />} />
                <Route path="/manager/employeeList" element={<EmployeeList />} />
                <Route path="/manager/employeeList/employeeInsert" element={<EmployeeInsert />} />
                <Route path="/manager/productList" element={<ProductList />} />
                <Route path="/employee/productList" element={<ProductList />} />
                <Route path="/manager/productList/productAdd" element={<ProductAdd />} />
                <Route path="/employee/productList/productAdd" element={<ProductAdd />} />
                <Route path="/manager/orders" element={<Orders />} />
                <Route path="/manager/reports" element={<Reports />} />
                <Route path="/employee/orders" element={<Orders />} />
                <Route path="/login/employee" element={<EmployeeLogin />} />
                <Route path="/employee/panel" element={<EmployeePanel />} />
                <Route path="/login/customer" element={<CustomerLog />} />
                <Route path="/login/customer/log" element={<CustomerLog />} />
                <Route path="/login/customer/signup" element={<CustomerSignUp />} />
                <Route path="/login/customer/login" element={<CustomerLogin />} />
                <Route path="/customer/myOrder" element={<MyOrder />} />
                <Route path="/customer/productList" element={<ProductList />} />
                // :id kısmı dinamik bir parametre olduğunu gösterir.
                <Route path="/manager/product-detail/:id" element={<Details />} />
                <Route path="/employee/product-detail/:id" element={<Details />} />
                <Route path="/customer/product-detail/:id" element={<Details />} />
                <Route path="/customer/productList/account" element={<Account />} />
                <Route path="/customer/productList/productCart" element={<ProductCart />} />
            </Routes>
        </Router>
    );
}
