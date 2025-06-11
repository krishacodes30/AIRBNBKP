const express = require("express");
const router = express.Router();
const listing=require("../model/listing.js")
const Review=require("../model/review.js")
const islogin=require("../middleware/loginm.js")
function wrapasync(fn){
    return function(req,res,next){
        fn(req,res,next).catch((err)=>next(err))
    }
}
// router.get("/",(req,res)=>{
//     res.render("home.ejs")
// })
//HOME PAGE
router.get("/home",(req,res)=>{
    res.render("home.ejs")
})


// MORE REVIEW PAGE
router.get("/:id",wrapasync (async (req,res)=>{
    const {id}=req.params
let el=await listing.findById(id).populate("reviews");//fieldname
// console.log(el)
res.render("more.ejs",{el})}))

//SHOW  MORE DATA OF LISTING
router.get("/",wrapasync(async (req,res)=>{
    let data=await listing.find({});
    res.render("show.ejs",{data})

// console.log(data)

}))
//SHOW LISTING
router.post("/", wrapasync (async (req,res)=>{
const {title,price,description,location,country}=req.body;
let data= await listing.create({title,price,description,location,country})
   console.log(data)
    res.redirect("/list")
}))

//DELTE LISTING
router.delete("/:id/del",islogin,async(req,res)=>{
    console.log("delete route is called");
    try{ let {id}=req.params;
    const deld=await listing.findByIdAndDelete(id);
    console.log(deld);
    res.redirect("/list"); }
   
 catch(err){
    console.log(err);
}})

//ADD REVIEW
 router.post("/:id/review",islogin,async(req,res)=>{
    let id=req.params.id;
    const flisting=await listing.findById(req.params.id);
   const rating = req.body.review.rating;
const comment = req.body.review.comment;
    let robj=new Review({rating,comment})
flisting.reviews.push(robj);
await robj.save();
await flisting.save()
  res.redirect(`/list/${id}`)
 })
//REVIEW DELETE
 router.delete("/:id1/:id2/del",islogin,async(req,res)=>{
    const{id1,id2}=req.params;
    console.log(req.body)
    await listing.findByIdAndUpdate(id1,{$pull:{reviews:id2}})
    await Review.findByIdAndDelete(id2);
    res.redirect(`/list/${id1}`)
    console.log(req.params);
 })

    

module.exports = router;