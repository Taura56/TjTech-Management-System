const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const Stock = require("./models/stock");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});