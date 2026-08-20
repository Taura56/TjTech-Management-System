import Layout from "../components/Layout";
import "../css/products.css";
import { useState } from "react";
function Products(){
    const[search,setSearch] = useState("");
    const [products, setProducts] = useState([
        { 
            id: 1, 
            name: "Laptop",
            category: "Electronics",
            price: 850, 
            stock: 15 
        },
        { 
            id: 2, 
            name: "Mouse", 
            category: "Electronics", 
            price: 25, 
            stock: 50 
        }
    ]);
    const [newProduct, setNewProduct] = useState({
        id: "",
        name: "",
        category: "",
        price: "",
        stock: ""
    }); 
    const[showForm, setShowForm] = useState(false);

    const handleAddProduct = () => {
        if(
            !newProduct.name||
            !newProduct.category||
            !newProduct.price||
           ! newProduct.stock)
           {
            alert("Please fill in all fields");
            return;
           }
           const product = {
            id:products.length+1,
            name:newProduct.name,
            category:newProduct.category,
            price:newProduct.price,
            stock:newProduct.stock
           };
        
          setProducts([...products, product]);
            setNewProduct({ 
                id: "", 
                name: "", 
                category: "", 
                price: "", 
                stock: "" 
            });
            setShowForm(false);
        
    };
    const [editingId, setEditingId] = useState(null);
    const[editingProduct, setEditingproduct] = useState({
        name:"",
        category:"",
        price:"",
        stock:""
    });
    const handleEdit=(product) => {
        console.log(product);
        setEditingId(product.id);
        setEditingproduct(product);
        setShowForm(true);}

        const handleUpdateProduct = () => {

    if (
        !editingProduct.name ||
        !editingProduct.category ||
        !editingProduct.price ||
        !editingProduct.stock
    ) {
        alert("Please fill in all fields");
        return;
    }

    const updatedProducts = products.map((product) =>
        product.id === editingId ? editingProduct : product
    );

    setProducts(updatedProducts);

    setEditingId(null);

    setEditingproduct({
        name: "",
        category: "",
        price: "",
        stock: ""
    });

    setShowForm(false);};

//DELETE PRODUCT FUNCTION
const handleDeleteProduct = (productId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if(!confirmDelete){ return;}
    const updatedProducts = products.filter((product) => product.id !== productId);
    setProducts(updatedProducts);
};
    return(
   <Layout title="Products">
        <div className="products-page">
            <div className="products-header">
                <button className="add-btn"onClick={() =>{
                                        setEditingId(null);
                                        setEditingproduct({
                                            name:"",
                                            category:"",
                                            price:"",
                                            stock:""
                                        })
                                        setNewProduct({
                                            id: "",
                                            name: "",
                                            category: "",
                                            price: "",
                                            stock: ""
                                        })
                                        setShowForm(true)}
                                    }>
                    +Add Product
                </button>
            </div>

            <div className="search-box">
                <input type="text" placeholder="Search Products..." value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
        
        
            {showForm && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="product-form">
                            <h2>{editingId ? "Edit Product" : "Add Product"}</h2>
                            <input type="text" placeholder="Product Name" value={editingId ? editingProduct.name : newProduct.name}
                                onChange={(e) =>{if(editingId){setEditingproduct({...editingProduct, name: e.target.value})}
                                else{setNewProduct({...newProduct, name: e.target.value})}}}
                            />
                        
                            <input type="text" placeholder="Category" value={editingId ? editingProduct.category : newProduct.category}
                            onChange={(e) =>{if(editingId){setEditingproduct({...editingProduct, category: e.target.value})}
                                                else{setNewProduct({...newProduct, category: e.target.value})}}}
                            />

                            <input type="number" placeholder="Price" value={editingId ? editingProduct.price : newProduct.price}
                                onChange={(e) =>{if(editingId){setEditingproduct({...editingProduct, price: parseFloat(e.target.value) || 0})}
                                                    else{setNewProduct({...newProduct, price: parseFloat(e.target.value) || 0})}}}
                            />

                            <input type="number" placeholder="Stock" value={editingId ? editingProduct.stock : newProduct.stock}
                                onChange={(e) =>{if(editingId){setEditingproduct({...editingProduct, stock: parseInt(e.target.value) || 0})}
                                                    else{setNewProduct({...newProduct, stock: parseInt(e.target.value) || 0})}}}
                            />
                            <div className="form-buttons">

                                <button onClick={editingId ? handleUpdateProduct : handleAddProduct} className="save-btn">
                               {editingId ?"Update Product" : "Save Product"}
                                </button>

                                <button className="cancel-btn"
                                    onClick={() => {
                                        setShowForm(false);
                                        setNewProduct({
                                            id: "",
                                            name: "",
                                            category: "",
                                            price: "",
                                            stock: ""
                                        }); 
                                    }}>Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        
        <table className="products-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {products.filter((product) => 
                    product.name.toLowerCase().includes(search.toLowerCase()) ||
                    product.category.toLowerCase().includes(search.toLowerCase()))
                    .map((product) => (
                        <tr key={product.id}>
                            <td>{product.id}</td>
                            <td>{product.name}</td>
                            <td>{product.category}</td>
                            <td>${product.price.toFixed(2)}</td>
                            <td>{product.stock}</td>
                            <td>
                                <button className="edit-btn" onClick={() => handleEdit(product)}>
                                    Edit
                                </button>
                                <button className="delete-btn" onClick={() => handleDeleteProduct(product.id)}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    )
                )}
            </tbody>
        </table>
    </div>
</Layout>
);
}
export default Products;