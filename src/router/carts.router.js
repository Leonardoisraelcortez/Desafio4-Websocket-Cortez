import {Router} from "express";
import cartManager from "../cartmanager.js";

const cartsRouter= Router();

cartManager.initialize();

cartsRouter.post('/', (req, res) => {
    const newCart = cartManager.createCart();
    res.status(201).json(newCart);
});

cartsRouter.get('/:cid', (req, res) => {
    const cartId = parseInt(req.params.cid);
    const cart = cartManager.getCartById(cartId);
    if (!cart) {
    res.status(404).json({ error: 'Carrito no encontrado' });
    return;
    }
    res.json(cart.products);
});

cartsRouter.post('/:cid/product/:pid', (req, res) => {
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);
    const quantity = parseInt(req.body.quantity || 1);

    const cart = cartManager.addProductToCart(cartId, productId, quantity);
    if (!cart) {
    res.status(404).json({ error: 'Carrito no encontrado' });
    return;
    }

    res.json(cart);
});

export default cartsRouter;