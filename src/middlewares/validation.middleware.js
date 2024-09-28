import { body, validationResult } from "express-validator";

export const validationMiddleware=async (req, res, next)=>{
   // Validate data with the help of 3rd-party middleware 'express-validator'
   // Steps to follow

   //1. Setup rules for validation
   const rules=[
    body('name').notEmpty().withMessage("Name is required."),
    body('price').isFloat({gt:0}).withMessage("Price should be a positive value."),
   // body('imageUrl').isURL().withMessage("Invalid url."),
    body('imageUrl').custom((value,{req})=>{
      if(!req.file){
        throw new Error ('Image is required');
      }
      return true;
    })
   ];

   //2. Run those rules, it is async operation so uses Promise to run all rules
    await Promise.all(rules.map(rule=>rule.run(req)));
    
   //3. Check if there are any errors after running the rules; validateResult returns an object
   const validationErrors=validationResult(req);
    
    //Mobile validation
    /* if (!/^\d{10}$/.test(mobile)) {
         errors.mobile = "enter valid mobile number of 10 digits";
     }*/

   //4. if errors, return the error message; convert object to an array 
    if(!validationErrors.isEmpty()){
       return res.render("new-product",{errorMessage:validationErrors.array()[0].msg});
    }
  next();
}