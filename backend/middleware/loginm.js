//==================================
const login=(req,res,next)=>{
    if(!req.isAuthenticated()){
        
       return res.redirect("/login")
    }
    next();
}
module.exports=login;
//=====================
//login hai bhai from gitbuh
