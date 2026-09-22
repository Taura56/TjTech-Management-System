import Layout from "../components/Layout";
import "../css/sales.css";
import { useState, useEffect } from "react";
import { fetchSales, addSale, updateSale, deleteSale, fetchCustomers, fetchStocks } from "../Services/api";

function Sales() {
    const [showForm, setShowForm] = useState(false);
    const [sales, setSales] = useState(() => {
        const savedSales = localStorage.getItem("sales");
        return savedSales ? JSON.parse(savedSales) : [];
    });
    const [editingSale, setEditingSale] = useState(null);
    const [newSale, setNewSale] = useState({
        customer: "",
        product: "",
        quantity: 1,
        price: 0,
    });
    const [products, setProducts] = useState([]);
    const [customers, setCustomers] = useState([]);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [salesData, customerData, productData] = await Promise.all([
                    fetchSales(),
                    fetchCustomers(),
                    fetchStocks(),
                ]);

                setSales(salesData);
                setCustomers(customerData);
                setProducts(productData);
                localStorage.setItem("sales", JSON.stringify(salesData));
                localStorage.setItem("customers", JSON.stringify(customerData));
                localStorage.setItem("products", JSON.stringify(productData));
            } catch (error) {
                setSales(JSON.parse(localStorage.getItem("sales")) || []);
                setCustomers(JSON.parse(localStorage.getItem("customers")) || []);
                setProducts(JSON.parse(localStorage.getItem("products")) || []);
            }
        };

        loadData();
    }, []);

    function getProductPrice(productName) {
        const product = products.find((item) => item.name === productName);
        return product ? Number(product.sellingPrice || product.price || 0) : 0;
    }

    function handleAddSale() {
        setEditingSale(null);
        setNewSale({ customer: "", product: "", quantity: 1, price: 0 });
        setShowForm(true);
    }

    function handleEdit(sale) {
        setNewSale({
            customer: sale.customer,
            product: sale.product,
            quantity: sale.quantity,
            price: sale.price,
        });

        setEditingSale(sale);
        setShowForm(true);
    }

    async function handleSaveSale() {
        if (!newSale.customer || !newSale.product || newSale.quantity <= 0) {
            alert("Please fill in all fields.");
            return;
        }

        const price = getProductPrice(newSale.product);
        const payload = {
            customer: newSale.customer,
            product: newSale.product,
            quantity: Number(newSale.quantity),
            price,
            total: price * Number(newSale.quantity),
            date: new Date().toLocaleDateString(),
        };

        try {
            if (editingSale) {
                const updatedSale = await updateSale(editingSale._id || editingSale.id, payload);
                setSales((current) => current.map((sale) => (sale._id || sale.id) === (updatedSale._id || updatedSale.id) ? updatedSale : sale));
            } else {
                const createdSale = await addSale(payload);
                setSales((current) => [createdSale, ...current]);
            }
        } catch (error) {
            alert(error.message || "Unable to save sale");
            return;
        }

        setNewSale({ customer: "", product: "", quantity: 1, price: 0 });
        setEditingSale(null);
        setShowForm(false);
    }

    async function handleDelete(id) {
        const confirmDelete = window.confirm("Are you sure you want to delete this sale?");

        if (!confirmDelete) {
            return;
        }

        try {
            await deleteSale(id);
            setSales((current) => current.filter((sale) => (sale._id || sale.id) !== id));
        } catch (error) {
            alert(error.message || "Unable to delete sale");
        }
    }

    function handleCancel() {
        setNewSale({ customer: "", product: "", quantity: 1, price: 0 });
        setEditingSale(null);
        setShowForm(false);
    }

    const totalSales = sales.length;
    const totalItems = sales.reduce((total, sale) => total + Number(sale.quantity || 0), 0);
    const totalRevenue = sales.reduce((total, sale) => total + Number(sale.total || 0), 0);

    return (
        <Layout title="Sales">
            <div className="sales-page">
                <div className="sales-header">
                    <div>
                        <p>Manage your sales and transactions</p>
                    </div>
                </div>

                <button className="add-sales-btn" onClick={handleAddSale}>+ Add Sale</button>

                <div className="sales-summary">
                    <div className="summary-card">
                        <h3>Total Sales</h3>
                        <p>{totalSales}</p>
                    </div>

                    <div className="summary-card">
                        <h3>Orders</h3>
                        <p>{sales.length}</p>
                    </div>

                    <div className="summary-card">
                        <h3>Items Sold</h3>
                        <p>{totalItems}</p>
                    </div>

                    <div className="summary-card">
                        <h3>Revenue</h3>
                        <p>KSh {totalRevenue}</p>
                    </div>
                </div>

                <div className="sales-table">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Customer</th>
                                <th>Product</th>
                                <th>Quantity</th>
                                <th>Price</th>
                                <th>Total</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {sales.length === 0 ? (
                                <tr>
                                    <td colSpan="8">No sales data available.</td>
                                </tr>
                            ) : (
                                sales.map((sale, index) => (
                                    <tr key={sale._id || sale.id || index}>
                                        <td>{index + 1}</td>
                                        <td>{sale.customer}</td>
                                        <td>{sale.product}</td>
                                        <td>{sale.quantity}</td>
                                        <td>KSh {sale.price}</td>
                                        <td>KSh {sale.total}</td>
                                        <td>{sale.date}</td>
                                        <td>
                                            <button className="edit-btn" onClick={() => handleEdit(sale)}>Edit</button>
                                            <button className="delete-btn" onClick={() => handleDelete(sale._id || sale.id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {showForm && (
                    <div className="modal-overlay">
                        <div className="sale-modal">
                            <h2>{editingSale ? "Edit Sale" : "New Sale"}</h2>

                            <div className="form-group">
                                <label>Customer</label>
                                <select value={newSale.customer} onChange={(e) => setNewSale({ ...newSale, customer: e.target.value })}>
                                    <option value="">Select Customer</option>
                                    {customers.map((customer) => (
                                        <option key={customer.id || customer._id} value={customer.name}>
                                            {customer.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Product</label>
                                <select value={newSale.product} onChange={(e) => setNewSale({ ...newSale, product: e.target.value })}>
                                    <option value="">Select Product</option>
                                    {products.map((product) => (
                                        <option key={product.id || product._id} value={product.name}>
                                            {product.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Quantity</label>
                                <input type="number" min="1" value={newSale.quantity} onChange={(e) => setNewSale({ ...newSale, quantity: Number(e.target.value) })} />
                            </div>

                            <div className="form-buttons">
                                <button className="save-btn" onClick={handleSaveSale}>{editingSale ? "Update Sale" : "Save Sale"}</button>
                                <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}

export default Sales;