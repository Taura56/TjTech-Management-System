const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const Stock = require("./models/stock");
const Customer = require("./models/customer");
const Sale = require("./models/sale");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.json({
    message: "TJ Tech Management System API is running",
  });
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

const getRequiredStockFields = (data) => {
  const { name, quantity, price, description } = data;

  return {
    name,
    quantity: quantity !== undefined ? Number(quantity) : undefined,
    price: price !== undefined ? Number(price) : 0,
    description,
  };
};

const handleStockError = (res, error) => {
  res.status(400).json({ message: error.message });
};

app.get("/stock", async (req, res) => {
  try {
    const stocks = await Stock.find().sort({ createdAt: -1 });
    res.status(200).json(stocks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/stock/:id", async (req, res) => {
  try {
    const stock = await Stock.findById(req.params.id);

    if (!stock) {
      return res.status(404).json({ message: "Stock item not found" });
    }

    res.status(200).json(stock);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/stock", async (req, res) => {
  try {
    const stockData = getRequiredStockFields(req.body);

    if (!stockData.name || stockData.quantity === undefined || Number.isNaN(stockData.quantity)) {
      return res.status(400).json({ message: "Name and quantity are required" });
    }

    const newStock = await Stock.create(stockData);
    res.status(201).json(newStock);
  } catch (error) {
    handleStockError(res, error);
  }
});

app.put("/stock/:id", async (req, res) => {
  try {
    const stockData = getRequiredStockFields(req.body);

    const updatedStock = await Stock.findByIdAndUpdate(req.params.id, stockData, {
      new: true,
      runValidators: true,
    });

    if (!updatedStock) {
      return res.status(404).json({ message: "Stock item not found" });
    }

    res.status(200).json(updatedStock);
  } catch (error) {
    handleStockError(res, error);
  }
});

app.delete("/stock/:id", async (req, res) => {
  try {
    const deletedStock = await Stock.findByIdAndDelete(req.params.id);

    if (!deletedStock) {
      return res.status(404).json({ message: "Stock item not found" });
    }

    res.status(200).json({ message: "Stock item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/stocks", async (req, res) => {
  try {
    const stocks = await Stock.find().sort({ createdAt: -1 });
    res.status(200).json(stocks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/stocks", async (req, res) => {
  try {
    const stockData = getRequiredStockFields(req.body);

    if (!stockData.name || stockData.quantity === undefined || Number.isNaN(stockData.quantity)) {
      return res.status(400).json({ message: "Name and quantity are required" });
    }

    const newStock = await Stock.create(stockData);
    res.status(201).json(newStock);
  } catch (error) {
    handleStockError(res, error);
  }
});

app.get("/api/stocks/:id", async (req, res) => {
  try {
    const stock = await Stock.findById(req.params.id);

    if (!stock) {
      return res.status(404).json({ message: "Stock item not found" });
    }

    res.status(200).json(stock);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put("/api/stocks/:id", async (req, res) => {
  try {
    const stockData = getRequiredStockFields(req.body);

    const updatedStock = await Stock.findByIdAndUpdate(req.params.id, stockData, {
      new: true,
      runValidators: true,
    });

    if (!updatedStock) {
      return res.status(404).json({ message: "Stock item not found" });
    }

    res.status(200).json(updatedStock);
  } catch (error) {
    handleStockError(res, error);
  }
});

app.delete("/api/stocks/:id", async (req, res) => {
  try {
    const deletedStock = await Stock.findByIdAndDelete(req.params.id);

    if (!deletedStock) {
      return res.status(404).json({ message: "Stock item not found" });
    }

    res.status(200).json({ message: "Stock item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/customers", async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/customers", async (req, res) => {
  try {
    const customer = await Customer.create(req.body);
    res.status(201).json(customer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.put("/api/customers/:id", async (req, res) => {
  try {
    const updated = await Customer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete("/api/customers/:id", async (req, res) => {
  try {
    const deleted = await Customer.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.status(200).json({ message: "Customer deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/sales", async (req, res) => {
  try {
    const sales = await Sale.find().sort({ createdAt: -1 });
    res.status(200).json(sales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/sales", async (req, res) => {
  try {
    const sale = await Sale.create(req.body);
    res.status(201).json(sale);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.put("/api/sales/:id", async (req, res) => {
  try {
    const updated = await Sale.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ message: "Sale not found" });
    }

    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete("/api/sales/:id", async (req, res) => {
  try {
    const deleted = await Sale.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Sale not found" });
    }

    res.status(200).json({ message: "Sale deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
});