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
    price: 0,
    payment: "",
    phone: "",
    transactionCode: "",
    paymentStatus: "Pending"
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
   function getProductPrice(productName) {

    const product = products.find(
        (item) => item.name === productName
    );

    if (product) {
        return Number(product.sellingPrice);
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
            price: 0,
            payment: "",
            phone: "",
            transactionCode: "",
            paymentStatus: "Pending"
        });

        setShowForm(true);
    }

    // Open modal and load sale data for editing
    function handleEdit(sale) {
        setNewSale({
            customer: sale.customer,
            product: sale.product,
            quantity: sale.quantity,
            price: sale.price,
            payment: sale.payment,
            phone: sale.phone,
            transactionCode: sale.transactionCode,
            paymentStatus: sale.paymentStatus
        });

        setEditingSale(sale);
        setShowForm(true);
    }

    // Save new sale or update existing sale
    function handleSaveSale() {  
        if (
            !newSale.customer ||
            !newSale.product ||
            !newSale.payment ||
            newSale.quantity <= 0
        ) {
            alert("Please fill in all fields.");
            return;
        }
        //Requre phone number for M-Pesa payment
        if (
            newSale.payment === "M-Pesa" &&
            !newSale.phone
        ) {
            alert("Phone number is required for M-Pesa payment.");
            return;
        }
        // Require transaction code for Card payment
        if (
            newSale.payment === "Card" &&
            !newSale.transactionCode
        ) {
            alert("Transaction code is required for Card payment.");
            return;
        }

        const price = getProductPrice(newSale.product);
            const selectedProduct = products.find(
                (product) => product.name === newSale.product
            );

            if (!selectedProduct) {
                alert("Product not found.");
                return;
            }

            if (newSale.quantity > selectedProduct.stock) {
                alert("Not enough stock available.");
                return;
            }

        // UPDATE EXISTING SALE
        // UPDATE EXISTING SALE
if (editingSale) {

    const oldQuantity = editingSale.quantity;
    const newQuantity = newSale.quantity;


    // Calculate difference
    const quantityDifference = newQuantity - oldQuantity;


    // Update stock
    const updatedProducts = products.map((product) => {

        if (product.name === newSale.product) {

            return {
                ...product,
                stock: product.stock - quantityDifference
            };

        }

        return product;

    });


    setProducts(updatedProducts);

    localStorage.setItem(
        "products",
        JSON.stringify(updatedProducts)
    );


                // Update sale record
                const updatedSales = sales.map((sale) => {

                    if (sale.id === editingSale.id) {

                        return {
                            ...sale,
                            customer: newSale.customer,
                            product: newSale.product,
                            quantity: newQuantity,
                            price: price,
                            total: price * newQuantity,
                            payment: newSale.payment,
                            phone: newSale.phone,
                            transactionCode: newSale.transactionCode,
                            paymentStatus: newSale.paymentStatus
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
                payment: newSale.payment,
                phone: newSale.phone,
                transactionCode: newSale.transactionCode,
                paymentStatus: "paid",
                date: new Date().toLocaleDateString()
            };

            setSales([...sales, sale]);
                            // Reduce product stock
                const updatedProducts = products.map((product) => {

                    if (product.name === newSale.product) {

                        return {
                            ...product,
                            stock: product.stock - newSale.quantity
                        };

                    }

                    return product;

                });

                // Save updated products
                setProducts(updatedProducts);

                localStorage.setItem(
                    "products",
                    JSON.stringify(updatedProducts)
                );
                        }

        // Reset everything
        setNewSale({
            customer: "",
            product: "",
            quantity: 1,
            price: 0,
            payment: "",
            phone: "",
            transactionCode: "",
            paymentStatus: ""
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

                    // Find the sale being deleted
                    const deletedSale = sales.find(
                        (sale) => sale.id === id
                    );


                    // Return stock back to products
                    const updatedProducts = products.map((product) => {

                        if (product.name === deletedSale.product) {

                            return {
                                ...product,
                                stock: product.stock + deletedSale.quantity
                            };

                        }

                        return product;

                    });


                    // Update products
                    setProducts(updatedProducts);

                    localStorage.setItem(
                        "products",
                        JSON.stringify(updatedProducts)
                    );


                    // Remove sale
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
            price: 0,
            payment: "",
            phone: "",
            transactionCode: "",
            paymentStatus: ""
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
                                <th>Payment</th>
                                <th>Phone/Reference</th>
                                <th>Payment Status</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>

                            {sales.length === 0 ? (

                                <tr>
                                    <td colSpan="11">
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
                                            {sale.payment}
                                        </td>

                                        <td>
                                            {sale.phone||sale.transactionCode}
                                        </td>

                                        <td>
                                            {sale.paymentStatus}
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
                                    <option value="">
                                        Select Customer
                                    </option>
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
                                    <option value="">
                                        Select Product
                                    </option>

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
                                {/* PAYMENT METHOD */}

                                        <div className="form-group">

                                        <label>
                                        Payment Method
                                        </label>

                                        <select
                                        value={newSale.payment}
                                        onChange={(e)=>
                                        setNewSale({
                                            ...newSale,
                                            payment:e.target.value
                                        })
                                        }
                                        >

                                        <option value="">
                                        Select Payment
                                        </option>

                                        <option value="Cash">
                                        Cash
                                        </option>

                                        <option value="M-Pesa">
                                        M-Pesa
                                        </option>

                                        <option value="Card">
                                        Card
                                        </option>

                                        </select>

                                        </div>

                            {/* PAYMENT FIELD for MPESA */}
                                    {newSale.payment === "M-Pesa" && (
                                        <div className="form-group">
                                            <label>Phone Number</label>

                                            <input
                                                type="text"
                                                placeholder="254712345678"
                                                value={newSale.phone}
                                                onChange={(e) =>
                                                    setNewSale({
                                                        ...newSale,
                                                        phone: e.target.value
                                                    })
                                                }
                                            />
                                        </div>
                                    )}
                                    
                                         {/*PAYMENT FIELD for CARD */}  
                                          {newSale.payment === "Card" && (
                                                <div className="form-group">
                                                    <label>Card Reference</label>

                                                    <input
                                                        type="text"
                                                        placeholder="Authorization Number"
                                                        value={newSale.transactionCode}
                                                        onChange={(e) =>
                                                            setNewSale({
                                                                ...newSale,
                                                                transactionCode: e.target.value
                                                            })
                                                        }
                                                    />
                                                </div>
                                            )}
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