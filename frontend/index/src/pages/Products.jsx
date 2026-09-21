import Layout from "../components/Layout";
import "../css/products.css";
import { useState, useEffect } from "react";
function Products(){
    const[search,setSearch] = useState("");
    const [products, setProducts] = useState(() => {
        const savedProducts = localStorage.getItem("products");
        return savedProducts ? JSON.parse(savedProducts) : [
                { 
                    id: 1, 
                    name: "Laptop",
                    category: "Electronics",
                    supplier: "TechStore",
                buyingPrice: 700,
                sellingPrice: 850,
                stock: 15,
                status: "In Stock"
            },
            { 
                id: 2, 
                name: "Mouse", 
                category: "Electronics", 
                supplier: "TechStore",
                buyingPrice: 10,
                sellingPrice: 25,
                stock: 50,
                status: "In Stock"
            }
        ];
    });
    const [newProduct, setNewProduct] = useState({
        id: "",
        name: "",
        category: "",
        supplier: "",
        buyingPrice: "",
        sellingPrice: "",
        stock: "",
        status: ""
    }); 
    const[showForm, setShowForm] = useState(false);
    useEffect(() => {
        localStorage.setItem(
            "products",
             JSON.stringify(products)
            );
        }, [products]);

    const handleAddProduct = () => {
        if(
            !newProduct.name||
            !newProduct.category||
            !newProduct.buyingPrice||
            !newProduct.sellingPrice||
            !newProduct.stock||
            !newProduct.supplier
        ) {
            alert("Please fill in all fields");
            return;
           }
           const product = {
            id:products.length+1,
            name:newProduct.name,
            category:newProduct.category,
            supplier:newProduct.supplier,
            buyingPrice:newProduct.buyingPrice,
            sellingPrice:newProduct.sellingPrice,
            stock:newProduct.stock,
            status:newProduct.stock>10?"In Stock"
            :newProduct.stock>0?"Low Stock"
            :"Out of Stock"
           };
        
          setProducts([...products, product]);
            setNewProduct({ 
                id: "", 
                name: "", 
                category: "", 
                supplier: "",
                buyingPrice: "",
                sellingPrice: "",
                stock: "",
                status: ""
            });
            setShowForm(false);
        
    };
    const [editingId, setEditingId] = useState(null);
    const[editingProduct, setEditingproduct] = useState({
        name:"",
        category:"",
        supplier:"",
        buyingPrice:"",
        sellingPrice:"",
        stock:"",
        status:""
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
        !editingProduct.supplier ||
        !editingProduct.buyingPrice ||
        !editingProduct.sellingPrice ||
        !editingProduct.stock ||
        !editingProduct.status
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
        supplier: "",
        buyingPrice: "",
        sellingPrice: "",
        stock: "",
        status: ""
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
                                            supplier:"",
                                            buyingPrice:"",
                                            sellingPrice:"",
                                            stock:"",
                                            status:""
                                        })
                                        setNewProduct({
                                            id: "",
                                            name: "",
                                            category: "",
                                            supplier: "",
                                            buyingPrice: "",
                                            sellingPrice: "",
                                            stock: "",
                                            status: ""
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
                            <input type="text" placeholder="Supplier" value={editingId ? editingProduct.supplier : newProduct.supplier}
                                onChange={(e) =>{if(editingId){setEditingproduct({...editingProduct, supplier: e.target.value})}
                                                else{setNewProduct({...newProduct, supplier: e.target.value})}}}
                            />
                            <input type="number" placeholder="Buying Price" value={editingId ? editingProduct.buyingPrice : newProduct.buyingPrice}
                                onChange={(e) =>{if(editingId){setEditingproduct({...editingProduct, buyingPrice: parseFloat(e.target.value) || 0})}
                                                    else{setNewProduct({...newProduct, buyingPrice: parseFloat(e.target.value) || 0})}}}
                            />
                            <input type="number" placeholder="Selling Price" value={editingId ? editingProduct.sellingPrice : newProduct.sellingPrice}
                                onChange={(e) =>{if(editingId){setEditingproduct({...editingProduct, sellingPrice: parseFloat(e.target.value) || 0})}
                                                    else{setNewProduct({...newProduct, sellingPrice: parseFloat(e.target.value) || 0})}}}
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
                                        setEditingId(null);
                                        setEditingproduct({
                                            name: "",
                                            category: "",   
                                            supplier: "",
                                            buyingPrice: "",
                                            sellingPrice: "",
                                            stock: "",
                                            status: ""
                                        });
                                        setNewProduct({
                                            id: "",
                                            name: "",
                                            category: "",
                                            supplier: "",
                                            buyingPrice: "",
                                            sellingPrice: "",
                                            stock: "",
                                            status: ""
                                        }); 
                                    }}>Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div className="products-table">
        
                <table >
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Product</th>
                            <th>Category</th>
                            <th>Supplier</th>
                            <th>Buying Price</th>
                            <th>Selling Price</th>
                            <th>Stock</th>
                            <th>Status</th>
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
                                    <td>{product.supplier}</td>
                                    <td>${product.buyingPrice.toFixed(2)}</td>
                                    <td>${product.sellingPrice.toFixed(2)}</td>
                                    <td>{product.stock}</td>
                                    <td>{product.stock >10?(<span className="in-stock">In Stock</span>
                                            ):product.stock >0?(<span className="low-stock">Low Stock</span>
                                            ):(<span className="out-of-stock">Out of Stock</span>
                                        )}
                                    </td>
                                    <td className="action-buttons">
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
    </div>
</Layout>
);
}
export default Products;