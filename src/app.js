import express from 'express';
import productsRouter from './router/products.router.js';
import cartsRouter from './router/carts.router.js';
import { engine } from "express-handlebars";
import viewsRouter from "./router/views.router.js";
import { __dirname } from "./utils.js";
import { Server } from "socket.io";
import productManager from "./productmanager.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

app.engine("handlebars", engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use("/", viewsRouter);

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

const PORT = 8080;

const httpServer = app.listen(PORT, () => {
    console.log(`Escuchando al puerto ${PORT}`);
});

const socketServer = new Server(httpServer);

const realtimeProductsNamespace = socketServer.of('/realtimeproducts');

realtimeProductsNamespace.on('connection', (socket) => {
    console.log('Cliente de real conectado');   

    const products = productManager.getProducts();

    socket.emit('updateProducts', products);

    socket.on('createProduct', (newProduct) => {
        productManager.addProduct(newProduct);

        const updatedProducts = productManager.getProducts();

        realtimeProductsNamespace.emit('updateProducts', updatedProducts);
    });

    socket.on('deleteProduct', (productId) => {
        productManager.deleteProduct(productId);
        const updatedProducts = productManager.getProducts();
        realtimeProductsNamespace.emit('updateProducts', updatedProducts);
    });

    socket.on('disconnect', () => {
        console.log('Cliente de real desconectado');
    });
});
