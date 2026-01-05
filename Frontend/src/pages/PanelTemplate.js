import React from "react";
import "../styles/Panel.css";
import { useNavigate, useLocation } from "react-router-dom";

function PanelTemplate({ title, rightContent }) {
    const navigate = useNavigate();
    const location = useLocation();

    const role = location.pathname.startsWith("/manager") ? "manager" : location.pathname.startsWith("/employee") ? "employee" : "customer";


    const basePath = role === "manager" ? "/manager" : role === "employee" ? "/employee" : "/customer";

    const git = (page) => {
        navigate(`${basePath}/${page}`);
    };

    const goManagerLogin = () => {
        navigate("/login/manager");
    };
    const goEmployeeLogin = () => {
        navigate("/login/employee");
    }
    const goCustomerLogin = () => {
        navigate("/login/customer/login")
    }

    return (
        <div className="panel-container">
            <div className="panel-left">
                <h2>{role === "manager" ? "Manager Panel" : role === "employee" ? "Employee Panel" : "Customer Panel"}</h2>

                <form>
                    {role === "manager" && (
                        <>
                            <button type="button" onClick={() => git("employeeList")}>EmployeeList</button>
                            <button type="button" onClick={() => git("productList")}>ProductList</button>
                            <button type="button" onClick={() => git("orders")}>Orders</button>
                            <button type="button" onClick={() => git("reports")}>Reports</button>
                            <button type="button" onClick={goManagerLogin}>Out</button>

                        </>
                    )}

                    {role === "employee" && (
                        <>
                            <button type="button" onClick={() => git("productList")}>ProductList</button>
                            <button type="button" onClick={() => git("orders")}>Orders</button>
                            <button type="button" onClick={goEmployeeLogin}>Out</button>
                        </>
                    )}
                    {role === "customer" && (
                        <>
                            <button type="button" onClick={() => git("productList")}>ProductList</button>
                            <button type="button" onClick={() => git("myOrder")}>MyOrder</button>
                            <button type="button" onClick={goCustomerLogin}>Out</button>
                        </>
                    )}
                </form>
            </div>

            <div className="panel-right">
                <h2>{title}</h2>
                {rightContent}
            </div>
        </div>
    );
}

export default PanelTemplate;
