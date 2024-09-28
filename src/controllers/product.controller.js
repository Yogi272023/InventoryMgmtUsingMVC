import ProductModel from "../models/product.model.js";

export default class ProductController{
    getProducts(req, res){
        let products=ProductModel.get();
        return res.render("products",{products:products})
    }

    getAddForm(req,res){
        return res.render("new-product",{errorMessage:null});
    }

    addNewProduct(req,res){
     //access data from form
     const {name, desc, price} = req.body;
     const imageUrl='images/' + req.file.filename;
     ProductModel.add(name, desc, price, imageUrl);//passing the user data to model
     let products=ProductModel.get();// getting data from model inside controller
     return res.render("products",{products:products}); // sending user data from controller to view
        
    }

    getUpdateProductView(req, res){
     // 1. if product exists then return view
     const id= req.params.id;
     const productFound=ProductModel.getById(id);
     if(productFound){
        return res.render("update-product",{products:productFound, errorMessage:null})
     }
     // 2. else return error
     else{
        return res.status(401).send("Product not found!!")
     }
    }

    postUpdateProduct(req, res){
        ProductModel.update(req.body);
        let products=ProductModel.get();
        return res.render("products",{products:products});
    }

    deleteProduct(req, res){
        const id=req.params.id;
        const productFound=ProductModel.getById(id);
        if(!productFound){
           return res.status(401).send("Product not found!!")
         }
        ProductModel.delete(id);
        const products=ProductModel.get();
        return res.render("products",{products})
    }
}