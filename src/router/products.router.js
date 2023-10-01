import {Router} from "express";
import productManager from "../productmanager.js";

const productsRouter = Router();

productManager.initialize();

productsRouter.get('/', (req, res) => {
    const { limit } = req.query;
    const products = productManager.getProducts(limit);
    res.json(products);
});

productsRouter.get('/:pid', (req, res) => {
    const { pid } = req.params;
    const product = productManager.getProductBypid(+pid);
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ error: 'Producto no encontrado' });
    }
});

productsRouter.post('/', (req, res) => {
    const newProduct = req.body;
    try {
    productManager.addProduct(newProduct);
    res.status(201).json({ message: 'Producto agregado con éxito' });
    } catch (error) {
    console.error("Error al agregar el producto:", error);
    res.status(500).json({ error: 'Error al agregar el producto' });
    }
});

productsRouter.put('/:pid', (req, res) => {
    const productpid = parseInt(req.params.pid);
    const updatedProduct = req.body;
    try {
    productManager.updateProduct(productpid, updatedProduct);
    res.status(200).json({ message: 'Producto actualizado con éxito' });
    } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el producto' });
    }
});

productsRouter.delete('/:pid', (req, res) => {
    const productpid = parseInt(req.params.pid);
    try {
        productManager.deleteProduct(productpid);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
});

export default productsRouter;