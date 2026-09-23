const API_BASE = (() => {
    if (typeof window !== "undefined" && window.location && window.location.hostname) {
        return `${window.location.protocol}//${window.location.hostname}:5000`;
    }

    return "http://localhost:5000";
})();

const STOCK_URL = `${API_BASE}/api/stocks`;
const CUSTOMER_URL = `${API_BASE}/api/customers`;
const SALE_URL = `${API_BASE}/api/sales`;

const normalizeProduct = (item) => {
    const descriptionText = item.description || "";
    const descriptionParts = descriptionText.split("|").map((part) => part.trim());
    const category = descriptionParts[0] || "General";
    const supplier = descriptionParts[1] || "Supplier";
    const stockValue = Number(item.quantity ?? item.stock ?? 0);

    return {
        id: item._id || item.id,
        name: item.name,
        category,
        supplier,
        buyingPrice: Number(item.buyingPrice ?? 0),
        sellingPrice: Number(item.price ?? item.sellingPrice ?? 0),
        stock: stockValue,
        status: stockValue > 10 ? "In Stock" : stockValue > 0 ? "Low Stock" : "Out of Stock",
        description: item.description || ""
    };
};

const normalizeCustomer = (item) => ({
    id: item._id || item.id,
    name: item.name,
    email: item.email,
    phone: item.phone,
    location: item.location,
    _id: item._id || item.id,
});

const normalizeSale = (item) => ({
    id: item._id || item.id,
    customer: item.customer,
    product: item.product,
    quantity: Number(item.quantity ?? 0),
    price: Number(item.price ?? 0),
    total: Number(item.total ?? 0),
    date: item.date || new Date().toLocaleDateString(),
    _id: item._id || item.id,
});

export const mapProductToStock = (product) => ({
    name: product.name,
    quantity: Number(product.stock ?? product.quantity ?? 0),
    price: Number(product.sellingPrice ?? product.price ?? 0),
    description: [product.category || "General", product.supplier || "Supplier"].join(" | ")
});

export const fetchStocks = async () => {
    const response = await fetch(STOCK_URL);

    if (!response.ok) {
        throw new Error("Unable to fetch stock data");
    }

    const stockData = await response.json();
    return stockData.map(normalizeProduct);
};

export const addStock = async (product) => {
    const response = await fetch(STOCK_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(mapProductToStock(product))
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Unable to add stock item");
    }

    const result = await response.json();
    return normalizeProduct(result);
};

export const updateStock = async (id, product) => {
    const response = await fetch(`${STOCK_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(mapProductToStock(product))
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Unable to update stock item");
    }

    const result = await response.json();
    return normalizeProduct(result);
};

export const deleteStock = async (id) => {
    const response = await fetch(`${STOCK_URL}/${id}`, {
        method: "DELETE"
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Unable to delete stock item");
    }

    return true;
};

export const fetchCustomers = async () => {
    const response = await fetch(CUSTOMER_URL);

    if (!response.ok) {
        throw new Error("Unable to fetch customer data");
    }

    const customerData = await response.json();
    return customerData.map(normalizeCustomer);
};

export const addCustomer = async (customer) => {
    const response = await fetch(CUSTOMER_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(customer)
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Unable to add customer");
    }

    const result = await response.json();
    return normalizeCustomer(result);
};

export const updateCustomer = async (id, customer) => {
    const response = await fetch(`${CUSTOMER_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(customer)
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Unable to update customer");
    }

    const result = await response.json();
    return normalizeCustomer(result);
};

export const deleteCustomer = async (id) => {
    const response = await fetch(`${CUSTOMER_URL}/${id}`, {
        method: "DELETE"
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Unable to delete customer");
    }

    return true;
};

export const fetchSales = async () => {
    const response = await fetch(SALE_URL);

    if (!response.ok) {
        throw new Error("Unable to fetch sales data");
    }

    const salesData = await response.json();
    return salesData.map(normalizeSale);
};

export const addSale = async (sale) => {
    const response = await fetch(SALE_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            customer: sale.customer,
            product: sale.product,
            quantity: Number(sale.quantity ?? 0),
            price: Number(sale.price ?? 0),
            total: Number(sale.total ?? (Number(sale.price ?? 0) * Number(sale.quantity ?? 0))),
            date: sale.date || new Date().toLocaleDateString()
        })
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Unable to add sale");
    }

    const result = await response.json();
    return normalizeSale(result);
};

export const updateSale = async (id, sale) => {
    const response = await fetch(`${SALE_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            customer: sale.customer,
            product: sale.product,
            quantity: Number(sale.quantity ?? 0),
            price: Number(sale.price ?? 0),
            total: Number(sale.total ?? (Number(sale.price ?? 0) * Number(sale.quantity ?? 0))),
            date: sale.date || new Date().toLocaleDateString()
        })
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Unable to update sale");
    }

    const result = await response.json();
    return normalizeSale(result);
};

export const deleteSale = async (id) => {
    const response = await fetch(`${SALE_URL}/${id}`, {
        method: "DELETE"
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Unable to delete sale");
    }

    return true;
};
