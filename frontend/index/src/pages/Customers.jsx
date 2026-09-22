import Layout from "../components/Layout";
import "../css/customer.css";
import { useState, useEffect } from "react";
import { fetchCustomers, addCustomer, updateCustomer, deleteCustomer } from "../Services/api";

function Customers() {
    const [search, setSearch] = useState("");
    const [customers, setCustomers] = useState([]);
    const [newCustomer, setNewCustomer] = useState({
        name: "",
        email: "",
        phone: "",
        location: "",
    });
    const [showForm, setShowForm] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState(null);

    useEffect(() => {
        const loadCustomers = async () => {
            try {
                const data = await fetchCustomers();
                setCustomers(data);
                localStorage.setItem("customers", JSON.stringify(data));
            } catch (error) {
                const savedCustomers = JSON.parse(localStorage.getItem("customers")) || [];
                setCustomers(savedCustomers);
            }
        };

        loadCustomers();
    }, []);

    const handleAddcustomer = async () => {
        if (!newCustomer.name || !newCustomer.email || !newCustomer.phone || !newCustomer.location) {
            alert("Please fill in all fields.");
            return;
        }

        try {
            if (editingCustomer) {
                const updated = await updateCustomer(editingCustomer._id, newCustomer);
                setCustomers((current) => current.map((customer) => customer._id === updated._id ? updated : customer));
            } else {
                const created = await addCustomer(newCustomer);
                setCustomers((current) => [created, ...current]);
            }
        } catch (error) {
            alert(error.message || "Unable to save customer");
            return;
        }

        setNewCustomer({ name: "", email: "", phone: "", location: "" });
        setEditingCustomer(null);
        setShowForm(false);
    };

    const handleDeleteCustomer = async (id) => {
        if (!window.confirm("Are you sure you want to delete this customer?")) {
            return;
        }

        try {
            await deleteCustomer(id);
            setCustomers((current) => current.filter((customer) => customer._id !== id));
        } catch (error) {
            alert(error.message || "Unable to delete customer");
        }
    };

    const handleEditCustomer = (customer) => {
        setEditingCustomer(customer);
        setNewCustomer({
            name: customer.name,
            email: customer.email,
            phone: customer.phone,
            location: customer.location,
        });
        setShowForm(true);
    };

    return (
        <Layout title="Customers">
            <div className="customer-header">
                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search Customers..." />
                <button onClick={() => {
                    setEditingCustomer(null);
                    setNewCustomer({ name: "", email: "", phone: "", location: "" });
                    setShowForm(true);
                }}>
                    Add Customer
                </button>
            </div>
            <div className="customer-form">
                {showForm && (
                    <div>
                        <h2>{editingCustomer ? "Edit Customer" : "Add Customer"}</h2>
                        <input
                            type="text"
                            placeholder="Name"
                            value={newCustomer.name}
                            onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={newCustomer.email}
                            onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Phone"
                            value={newCustomer.phone}
                            onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Location"
                            value={newCustomer.location}
                            onChange={(e) => setNewCustomer({ ...newCustomer, location: e.target.value })}
                        />
                        <button onClick={handleAddcustomer}>{editingCustomer ? "Update Customer" : "SaveCustomer"}</button>
                        <button onClick={() => setShowForm(false)}>Cancel</button>
                    </div>
                )}
            </div>
            <div className="table-container">
                <table className="customer-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Location</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.filter((customer) => customer.name?.toLowerCase().includes(search.toLowerCase()))
                        .map((customer) => (
                            <tr key={customer._id || customer.id}>
                                <td>{customer.name}</td>
                                <td>{customer.email}</td>
                                <td>{customer.phone}</td>
                                <td>{customer.location}</td>

                                <td>
                                    <button className="edit-button" onClick={() => handleEditCustomer(customer)}>
                                        Edit
                                    </button>
                                    <button className="delete-button" onClick={() => handleDeleteCustomer(customer._id || customer.id)}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Layout>
    );
}
export default Customers;