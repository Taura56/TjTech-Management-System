import Layout from "../components/Layout";
import "../css/services.css";
import { useState, useEffect } from "react";
import { fetchServices, addService, updateService, deleteService } from "../Services/api";

function Services() {
    const [services, setServices] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [newService, setNewService] = useState({
        name: "",
        category: "",
        price: "",
        description: "",
        status: "Available",
    });

    useEffect(() => {
        const loadServices = async () => {
            try {
                const data = await fetchServices();
                setServices(data);
                localStorage.setItem("services", JSON.stringify(data));
            } catch (error) {
                const savedServices = JSON.parse(localStorage.getItem("services")) || [];
                setServices(savedServices);
            }
        };

        loadServices();
    }, []);

    const handleAdd = () => {
        setEditingService(null);
        setNewService({
            name: "",
            category: "",
            price: "",
            description: "",
            status: "Available",
        });
        setShowForm(true);
    };

    const handleSave = async () => {
        if (!newService.name || !newService.category || !newService.price) {
            alert("Please fill all fields");
            return;
        }

        try {
            if (editingService) {
                await updateService(editingService._id || editingService.id, {
                    ...newService,
                    price: Number(newService.price),
                });
            } else {
                await addService({
                    ...newService,
                    price: Number(newService.price),
                });
            }

            const refreshedServices = await fetchServices();
            setServices(refreshedServices);
            localStorage.setItem("services", JSON.stringify(refreshedServices));
        } catch (error) {
            alert(error.message || "Unable to save service");
            return;
        }

        setShowForm(false);
        setEditingService(null);
        setNewService({
            name: "",
            category: "",
            price: "",
            description: "",
            status: "Available",
        });
    };

    const handleEdit = (service) => {
        setEditingService(service);
        setNewService({
            name: service.name,
            category: service.category,
            price: String(service.price),
            description: service.description || "",
            status: service.status || "Available",
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Delete this service?");
        if (!confirmDelete) {
            return;
        }

        try {
            await deleteService(id);
            const updatedServices = services.filter((service) => (service._id || service.id) !== id);
            setServices(updatedServices);
            localStorage.setItem("services", JSON.stringify(updatedServices));
        } catch (error) {
            alert(error.message || "Unable to delete service");
        }
    };

    return (
        <Layout title="Services">
            <div className="services-page">
                <div className="services-header">
                    <h2>Service Management</h2>
                    <button className="add-service-btn" onClick={handleAdd}>
                        + Add Service
                    </button>
                </div>

                <div className="services-table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Description</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {services.length === 0 ? (
                                <tr>
                                    <td colSpan="7" style={{ textAlign: "center" }}>
                                        No services found.
                                    </td>
                                </tr>
                            ) : (
                                services.map((service) => (
                                    <tr key={service._id || service.id}>
                                        <td>{service.id}</td>
                                        <td>{service.name}</td>
                                        <td>{service.category}</td>
                                        <td>KSh {service.price}</td>
                                        <td>{service.description}</td>
                                        <td>{service.status}</td>
                                        <td>
                                            <button className="edit-btn" onClick={() => handleEdit(service)}>
                                                Edit
                                            </button>
                                            <button className="delete-btn" onClick={() => handleDelete(service._id || service.id)}>
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
                        <div className="service-modal">
                            <h2>{editingService ? "Edit Service" : "Add Service"}</h2>

                            <input
                                placeholder="Service name"
                                value={newService.name}
                                onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                            />

                            <input
                                placeholder="Category"
                                value={newService.category}
                                onChange={(e) => setNewService({ ...newService, category: e.target.value })}
                            />

                            <input
                                type="number"
                                placeholder="Price"
                                value={newService.price}
                                onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                            />

                            <textarea
                                placeholder="Description"
                                value={newService.description}
                                onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                            />

                            <select
                                value={newService.status}
                                onChange={(e) => setNewService({ ...newService, status: e.target.value })}
                            >
                                <option>Available</option>
                                <option>Unavailable</option>
                            </select>

                            <button onClick={handleSave}>Save</button>
                            <button onClick={() => setShowForm(false)}>Cancel</button>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}

export default Services;
