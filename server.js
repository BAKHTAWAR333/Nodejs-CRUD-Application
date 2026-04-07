import express from "express";
import { productSchema } from "./schema/index.js";

const app = express();

app.use(express.json());

// Middleware
app.use("/", (req, res, next) => {
    console.log("Request received");
    next();
});

let products = [];

// Home Route
app.get("/", (req, res) => {
    res.send({ message: "The server is working fine!" });
});

// GET All Products
app.get("/products", (req, res) => {
    res.send(products);
});

// GET Single Product
app.get("/product/:id", (req, res) => {
    const product = products.find(p => p.id === req.params.id);

    if (!product) {
        return res.status(404).send({ message: "Product not found" });
    }

    res.send(product);
});

// CREATE Product
app.post("/product", async (req, res) => {
    try {
        const product = await productSchema.validateAsync(req.body);

        const newProduct = {
            ...product,
            id: Date.now().toString(36)
        };

        products.push(newProduct);

        res.send({
            message: "Product added successfully",
            product: newProduct
        });

    } catch (error) {
        res.status(400).send({
            message: "Validation failed",
            error: error.message
        });
    }
});

// UPDATE Product (FIXED ✅)
app.put("/product/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const updatedData = await productSchema.validateAsync(req.body);

        const index = products.findIndex(p => p.id === id);

        if (index === -1) {
            return res.status(404).send({ message: "Product not found" });
        }

        products[index] = { ...products[index], ...updatedData };

        res.send({
            message: "Product updated successfully",
            product: products[index]
        });

    } catch (error) {
        res.status(400).send({
            message: "Validation failed",
            error: error.message
        });
    }
});

// DELETE Product
app.delete("/product/:id", (req, res) => {
    const { id } = req.params;

    const exists = products.some(p => p.id === id);

    if (!exists) {
        return res.status(404).send({ message: "Product not found" });
    }

    products = products.filter(p => p.id !== id);

    res.send({
        message: "Product deleted successfully",
        products
    });
});

// Server
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});