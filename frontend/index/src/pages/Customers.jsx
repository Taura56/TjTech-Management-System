import Layout from "../components/Layout";
import "../css/customer.css";
import {useState} from "react";
function Customers(){
    const[search,setSearch] = useState("");
    const[customers,setCustomers] = useState([
        {
            id: 1, name: "John Doe",
            email: "john.doe@example.com",
            phone: "123-456-7890",
            location: "Los Angeles"
        },
        {
            id: 2, name: "Jane Smith", 
            email: "jane.smith@example.com",
            phone: "098-765-4321",
            location: "New York"
        }
    ]);
    const [newCustomer, setNewCustomer] = useState({
        name: "",
        email: "",
        phone: "",
        location: ""
    });
    const handleAddcustomer = () => {
        if(
            !newCustomer.name ||
            !newCustomer.email ||
            !newCustomer.phone ||
            !newCustomer.location
        )
        {
            alert("Please fill in all fields.");
            return;
        }
        const customer = {
            id: customers.length + 1,
           ...newCustomer
        };
        setCustomers([...customers, customer]);
        setNewCustomer({
            name: "",
            email: "",
            phone: "",
            location: ""
        });
        setShowForm(false);
    };
    const [showForm, setShowForm] = useState(false);
    const handleDeleteCustomer = (id) => {
        if(window.confirm("Are you sure you want to delete this customer?")){
            const updatedCustomers = customers.filter((customer) => customer.id !== id);
            setCustomers(updatedCustomers);
        }
    };
    const [editingCustomer, setEditingCustomer] = useState(null);
    const handleEditCustomer = (customer) => {
        setEditingCustomer(customer);
        setNewCustomer({
            name: customer.name,
            email: customer.email,
            phone: customer.phone,
            location: customer.location
        });
        setShowForm(true);
    };
    return(
        <Layout title="Customers">
            <div className="customer-header">
                <input type="text"value={search}  onChange={(e)=>setSearch(e.target.value)} placeholder="Search Customers..." />
                <button onClick={() => {
                    setEditingCustomer(null);
                    setNewCustomer({
                        name: "",
                        email: "",
                        phone: "",
                        location: ""
                    });
                    setShowForm(true);
                }}>
                    Add Customer
                </button>
            </div>
            <div className="customer-form">
                {showForm && (
                    <div>
                        <h2>Add Customer</h2>
                        <input
                            type="text"
                            placeholder="Name"
                            value={newCustomer.name}
                            onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={newCustomer.email}
                            onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                        />
                        <input
                            type="text"
                            placeholder="Phone"
                            value={newCustomer.phone}
                            onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                        />
                        <input
                            type="text"
                            placeholder="Location"
                            value={newCustomer.location}
                            onChange={(e) => setNewCustomer({...newCustomer, location: e.target.value})}
                        />
                        <button onClick={handleAddcustomer}>{editingCustomer ? "Update Customer" : "SaveCustomer"}</button>
                        <button onClick={() => setShowForm(false)}>Cancel</button>
                    </div>
                )}
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Location</th>
                    </tr>
                </thead>
                <tbody>
                    {customers.filter((customer) => customer.name.toLowerCase().includes(search.toLowerCase()))
                    .map((customer) => (
                        <tr key={customer.id}>
                            <td>{customer.name}</td>
                            <td>{customer.email}</td>
                            <td>{customer.phone}</td>
                            <td>{customer.location}</td>

                            <td>
                                <button className="edit-button" 
                                    onClick={()=>handleEditCustomer(customer)}>
                                    Edit
                                </button>
                                <button className="delete-button"
                                    onClick={()=>handleDeleteCustomer(customer.id)}>
                                    Delete
                                </button>
                            </td>   
                        </tr>
                        
                    ))}
                </tbody>
            </table>
        </Layout>
    );
}
export default Customers;