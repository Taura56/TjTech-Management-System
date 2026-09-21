import Layout from "../components/Layout";
import "../css/sales.css";
import { useState, useEffect} from "react";

function Sales() {
    // Modal state
    const [showForm, setShowForm] = useState(false);

    // Sales data
   const [sales, setSales] = useState(() => {
    const savedSales = localStorage.getItem("sales");

    return savedSales
        ? JSON.parse(savedSales)
        : [];
});

    // Track the sale being edited
    const [editingSale, setEditingSale] = useState(null);

    // Form data
    const [newSale, setNewSale] = useState({
        customer: "",
        product: "",
        quantity: 1,
        price: 0
    });
const [products, setProducts] = useState([]);
const [customers, setCustomers] = useState([]);

useEffect(() => {

    const savedProducts =
        JSON.parse(localStorage.getItem("products")) || [];

    const savedCustomers =
        JSON.parse(localStorage.getItem("customers")) || [];

    setProducts(savedProducts);
    setCustomers(savedCustomers);

}, []);

useEffect(() => {

    localStorage.setItem(
        "sales",
        JSON.stringify(sales)
    );

}, [sales]);


    // Get product price
    function getProductPrice(product) {
        if (product === "Laptop") {
            return 850;
        }

        if (product === "Mouse") {
            return 20;
        }

        return 0;
    }

    // Open modal for adding a new sale
    function handleAddSale() {
        setEditingSale(null);

        setNewSale({
            customer: "",
            product: "",
            quantity: 1,
            price: 0
        });

        setShowForm(true);
    }

    // Open modal and load sale data for editing
    function handleEdit(sale) {
        setNewSale({
            customer: sale.customer,
            product: sale.product,
            quantity: sale.quantity,
            price: sale.price
        });

        setEditingSale(sale);
        setShowForm(true);
    }

    // Save new sale or update existing sale
    function handleSaveSale() {
        if (
            !newSale.customer ||
            !newSale.product ||
            newSale.quantity <= 0
        ) {
            alert("Please fill in all fields.");
            return;
        }

        const price = getProductPrice(newSale.product);

        // UPDATE EXISTING SALE
        if (editingSale) {
            const updatedSales = sales.map((sale) => {
                if (sale.id === editingSale.id) {
                    return {
                        ...sale,
                        customer: newSale.customer,
                        product: newSale.product,
                        quantity: newSale.quantity,
                        price: price,
                        total: price * newSale.quantity
                    };
                }

                return sale;
            });

            setSales(updatedSales);

        } else {
            // ADD NEW SALE

            const newId =
                sales.length > 0
                    ? Math.max(...sales.map((sale) => sale.id)) + 1
                    : 1;

            const sale = {
                id: newId,
                customer: newSale.customer,
                product: newSale.product,
                quantity: newSale.quantity,
                price: price,
                total: price * newSale.quantity,
                date: new Date().toLocaleDateString()
            };

            setSales([...sales, sale]);
        }

        // Reset everything
        setNewSale({
            customer: "",
            product: "",
            quantity: 1,
            price: 0
        });

        setEditingSale(null);
        setShowForm(false);
    }

    // Delete sale
    function handleDelete(id) {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this sale?"
        );

        if (confirmDelete) {
            const updatedSales = sales.filter(
                (sale) => sale.id !== id
            );

            setSales(updatedSales);
        }
    }

    // Cancel form
    function handleCancel() {
        setNewSale({
            customer: "",
            product: "",
            quantity: 1,
            price: 0
        });

        setEditingSale(null);
        setShowForm(false);
    }

    // Calculate total number of sales
    const totalSales = sales.length;

    // Calculate total items sold
    const totalItems = sales.reduce(
        (total, sale) => total + sale.quantity,
        0
    );

    // Calculate total revenue
    const totalRevenue = sales.reduce(
        (total, sale) => total + sale.total,
        0
    );

    return (
        <Layout title="Sales">

            <div className="sales-page">

                {/* HEADER */}
                <div className="sales-header">
                    <div>
                        <p>
                            Manage your sales and transactions
                        </p>
                    </div>
                </div>

                {/* ADD SALE BUTTON */}
                <button
                    className="add-sales-btn"
                    onClick={handleAddSale}
                >
                    + Add Sale
                </button>


                {/* SALES SUMMARY */}
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


                {/* SALES TABLE */}
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
                                    <td colSpan="8">
                                        No sales data available.
                                    </td>
                                </tr>

                            ) : (

                                sales.map((sale) => (

                                    <tr key={sale.id}>

                                        <td>{sale.id}</td>

                                        <td>
                                            {sale.customer}
                                        </td>

                                        <td>
                                            {sale.product}
                                        </td>

                                        <td>
                                            {sale.quantity}
                                        </td>

                                        <td>
                                            KSh {sale.price}
                                        </td>

                                        <td>
                                            KSh {sale.total}
                                        </td>

                                        <td>
                                            {sale.date}
                                        </td>

                                        <td>

                                            {/* EDIT BUTTON */}
                                            <button
                                                className="edit-btn"
                                                onClick={() =>
                                                    handleEdit(sale)
                                                }
                                            >
                                                Edit
                                            </button>


                                            {/* DELETE BUTTON */}
                                            <button
                                                className="delete-btn"
                                                onClick={() =>
                                                    handleDelete(sale.id)
                                                }
                                            >
                                                Delete
                                            </button>

                                        </td>

                                    </tr>

                                ))

                            )}

                        </tbody>

                    </table>

                </div>


                {/* ADD / EDIT SALE MODAL */}
                {showForm && (

                    <div className="modal-overlay">

                        <div className="sale-modal">

                            <h2>
                                {editingSale
                                    ? "Edit Sale"
                                    : "New Sale"}
                            </h2>


                            {/* CUSTOMER */}
                            <div className="form-group">

                                <label>
                                    Customer
                                </label>

                                <select
                                    value={newSale.customer}
                                    onChange={(e) =>
                                        setNewSale({
                                            ...newSale,
                                            customer: e.target.value
                                        })
                                    }
                                >
                                    {customers.map((customer) => (
                                        <option
                                            key={customer.id}
                                            value={customer.name}
                                        >
                                            {customer.name}
                                        </option>
                                    ))}

                                </select>

                            </div>


                            {/* PRODUCT */}
                            <div className="form-group">

                                <label>
                                    Product
                                </label>

                                <select
                                    value={newSale.product}
                                    onChange={(e) =>
                                        setNewSale({
                                            ...newSale,
                                            product: e.target.value
                                        })
                                    }
                                >

                                    {products.map((product) => (
                                        <option
                                            key={product.id}
                                            value={product.name}
                                        >
                                            {product.name}
                                        </option>
                                    ))}

                                </select>

                            </div>


                            {/* QUANTITY */}
                            <div className="form-group">

                                <label>
                                    Quantity
                                </label>

                                <input
                                    type="number"
                                    min="1"
                                    value={newSale.quantity}
                                    onChange={(e) =>
                                        setNewSale({
                                            ...newSale,
                                            quantity: Number(
                                                e.target.value
                                            )
                                        })
                                    }
                                />

                            </div>


                            {/* FORM BUTTONS */}
                            <div className="form-buttons">

                                <button
                                    className="save-btn"
                                    onClick={handleSaveSale}
                                >
                                    {editingSale
                                        ? "Update Sale"
                                        : "Save Sale"}
                                </button>


                                <button
                                    className="cancel-btn"
                                    onClick={handleCancel}
                                >
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