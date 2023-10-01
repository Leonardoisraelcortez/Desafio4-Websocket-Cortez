import { Router } from "express";
import productManager from "../productmanager.js";

const router = Router();

router.get("/", (req, res) => {
    const products = productManager.getProducts();
    res.render("index", { products });
});

router.get("/realtimeproducts", (req, res) => {
    res.render("realTimeProducts");
});

export default router;