import express from "express";
import ProductController from "./src/controllers/product.controller.js";
import path from "path";
import ejsLayouts from "express-ejs-layouts";
import { validationMiddleware } from "./src/middlewares/validation.middleware.js";
import { uploadFile } from "./src/middlewares/file-upload.middleware.js";
import UserController from "./src/controllers/user.controller.js";
import session from "express-session";
import { auth } from "./src/middlewares/auth.middleware.js";
import cookieParser from "cookie-parser";
import { setLastVisit } from "./src/middlewares/lastVisit.middleware.js";

const server=express();

server.use(cookieParser());
//server.use(setLastVisit);
server.use(session({
    secret:"SecretKey",
    resave:false,
    saveUninitialized:true,
    cookie:{secure:false}
})
)

// setup view engine settings
server.set('view engine','ejs');
server.set("views",path.join(path.resolve(),'src','views'));

server.use(ejsLayouts);
server.use(express.static('public'));


// Body parser: to parse form data
server.use(express.urlencoded({extended:true}));

// Create an instance of ProductController class
const productController = new ProductController();
const userController= new UserController();


server.get("/register",userController.getRegister)
server.post("/register",userController.postRegister)
server.get("/login",userController.getLogin)
server.post("/login",userController.postLogin)

server.get("/",auth,productController.getProducts)
server.get("/new",auth,productController.getAddForm)
server.post("/delete-product/:id",auth,productController.deleteProduct)
server.post(
    "/",
    auth,
    uploadFile.single('imageUrl'),
    validationMiddleware,
    productController.addNewProduct)
server.get("/update-product/:id",auth,productController.getUpdateProductView)
server.post("/update-product",auth,productController.postUpdateProduct)
server.get("/logout",userController.logout)

server.use(express.static('src/views'));


server.listen(3000);