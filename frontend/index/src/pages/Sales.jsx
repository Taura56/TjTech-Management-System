import Layout from "../components/Layout";
import "../css/sales.css";
import { useState, useEffect } from "react";
import {
    fetchStocks,
    fetchCustomers,
    fetchSales,
    addSale,
    updateSale,
    deleteSale,
} from "../Services/api";

function Sales() {
    const [showForm, setShowForm] = useState(false);
    const [sales, setSales] = useState([]);
    const [editingSale, setEditingSale] = useState(null);
    const [products, setProducts] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [newSale, setNewSale] = useState({
        customer: "",
        product: "",
        quantity: 1,
        payment: "",
        phone: "",
        transactionCode: "",
    });

    useEffect(() => {
        const loadSalesData = async () => {
            try {
                const [productData, customerData, saleData] = await Promise.all([
                    fetchStocks(),
                    fetchCustomers(),
                    fetchSales(),
                ]);

                setProducts(productData);
                setCustomers(customerData);
                setSales(saleData);
                localStorage.setItem("products", JSON.stringify(productData));
                localStorage.setItem("customers", JSON.stringify(customerData));
                localStorage.setItem("sales", JSON.stringify(saleData));
            } catch (error) {
                setProducts(JSON.parse(localStorage.getItem("products")) || []);
                setCustomers(JSON.parse(localStorage.getItem("customers")) || []);
                setSales(JSON.parse(localStorage.getItem("sales")) || []);
            }
        };

        loadSalesData();
    }, []);

    const getProductPrice = (productName) => {
        const product = products.find((item) => item.name === productName);
        return product ? Number(product.sellingPrice ?? 0) : 0;
    };

    const handleAddSale = () => {
        setEditingSale(null);
        setNewSale({
            customer: "",
            product: "",
            quantity: 1,
            payment: "",
            phone: "",
            transactionCode: "",
        });
        setShowForm(true);
    };

    const handleEdit = (sale) => {
        setNewSale({
            customer: sale.customer,
            product: sale.product,
            quantity: sale.quantity,
            payment: sale.payment || "",
            phone: sale.phone || "",
            transactionCode: sale.transactionCode || "",
        });

        setEditingSale(sale);
        setShowForm(true);
    };

    const handleCancel = () => {
        setNewSale({
            customer: "",
            product: "",
            quantity: 1,
            payment: "",
            phone: "",
            transactionCode: "",
        });
        setEditingSale(null);
        setShowForm(false);
    };

    const handleSaveSale = async () => {
        if (!newSale.customer || !newSale.product || !newSale.payment || newSale.quantity <= 0) {
            alert("Please fill in all fields.");
            return;
        }

        if (newSale.payment === "M-Pesa" && !newSale.phone) {
            alert("Please enter M-Pesa phone number.");
            return;
        }

        if (newSale.payment === "Card" && !newSale.transactionCode) {
            alert("Please enter card reference.");
            return;
        }

        const selectedProduct = products.find((product) => product.name === newSale.product);
        if (!selectedProduct) {
            alert("Product not found.");
            return;
        }

        if (!editingSale && Number(newSale.quantity) > Number(selectedProduct.stock ?? 0)) {
            alert("Not enough stock available.");
            return;
        }

        const productPrice = getProductPrice(newSale.product);
        const payload = {
            customer: newSale.customer,
            product: newSale.product,
            quantity: Number(newSale.quantity),
            price: productPrice,
            total: productPrice * Number(newSale.quantity),
            payment: newSale.payment,
            phone: newSale.phone,
            transactionCode: newSale.transactionCode,
            paymentstatus: newSale.payment === "Cash" ? "Paid" : "Pending",
            date: new Date().toLocaleDateString(),
        };

        try {
            if (editingSale) {
                await updateSale(editingSale._id || editingSale.id, payload);
            } else {
                await addSale(payload);
            }

            const refreshedSales = await fetchSales();
            setSales(refreshedSales);
            localStorage.setItem("sales", JSON.stringify(refreshedSales));

            const refreshedProducts = await fetchStocks();
            setProducts(refreshedProducts);
            localStorage.setItem("products", JSON.stringify(refreshedProducts));
        } catch (error) {
            alert(error.message || "Unable to save sale");
            return;
        }

        handleCancel();
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this sale?");
        if (!confirmDelete) {
            return;
        }

        try {
            await deleteSale(id);
            const updatedSales = sales.filter((sale) => (sale._id || sale.id) !== id);
            setSales(updatedSales);
            localStorage.setItem("sales", JSON.stringify(updatedSales));
        } catch (error) {
            alert(error.message || "Unable to delete sale");
        }
    };

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

                <button className="add-sales-btn" onClick={handleAddSale}>
                    + Add Sale
                </button>

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
                                <th>Payment</th>
                                <th>Payment Status</th>
                                <th>Reference</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {sales.length === 0 ? (
                                <tr>
                                    <td colSpan="11">No sales data available.</td>
                                </tr>
                            ) : (
                                sales.map((sale) => (
                                    <tr key={sale._id || sale.id}>
                                        <td>{sale.id}</td>
                                        <td>{sale.customer}</td>
                                        <td>{sale.product}</td>
                                        <td>{sale.quantity}</td>
                                        <td>KSh {sale.price}</td>
                                        <td>KSh {sale.total}</td>
                                        <td>{sale.payment}</td>
                                        <td>{sale.paymentstatus}</td>
                                        <td>{sale.transactionCode || sale.phone}</td>
                                        <td>{sale.date}</td>
                                        <td>
                                            <button className="edit-btn" onClick={() => handleEdit(sale)}>
                                                Edit
                                            </button>
                                            <button className="delete-btn" onClick={() => handleDelete(sale._id || sale.id)}>
                                                Delete
                                            </button>
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
                                <select
                                    value={newSale.customer}
                                    onChange={(e) => setNewSale({ ...newSale, customer: e.target.value })}
                                >
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
                                <select
                                    value={newSale.product}
                                    onChange={(e) => setNewSale({ ...newSale, product: e.target.value })}
                                >
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
                                <input
                                    type="number"
                                    min="1"
                                    value={newSale.quantity}
                                    onChange={(e) => setNewSale({ ...newSale, quantity: Number(e.target.value) })}
                                />
                            </div>

                            <div className="form-group">
                                <label>Payment Method</label>
                                <select
                                    value={newSale.payment}
                                    onChange={(e) => setNewSale({ ...newSale, payment: e.target.value })}
                                >
                                    <option value="">Select Payment</option>
                                    <option value="Cash">Cash</option>
                                    <option value="M-Pesa">M-Pesa</option>
                                    <option value="Card">Card</option>
                                </select>
                            </div>

                            {newSale.payment === "M-Pesa" && (
                                <div className="form-group">
                                    <label>Phone Number</label>
                                    <input
                                        type="text"
                                        placeholder="254712345678"
                                        value={newSale.phone}
                                        onChange={(e) => setNewSale({ ...newSale, phone: e.target.value })}
                                    />
                                </div>
                            )}

                            {newSale.payment === "Card" && (
                                <div className="form-group">
                                    <label>Card Reference</label>
                                    <input
                                        type="text"
                                        placeholder="Authorization Number"
                                        value={newSale.transactionCode}
                                        onChange={(e) => setNewSale({ ...newSale, transactionCode: e.target.value })}
                                    />
                                </div>
                            )}

                            <div className="form-buttons">
                                <button className="save-btn" onClick={handleSaveSale}>
                                    {editingSale ? "Update Sale" : "Save Sale"}
                                </button>
                                <button className="cancel-btn" onClick={handleCancel}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}

export default Sales;
