const mongoose=require("mongoose");

const rschema=new mongoose.Schema({

    comment:{
        type:String
    },
    rating: {
        type: Number,
       },
    created:{
        type:Date,
        default:Date.now()
    }
});
module.exports=mongoose.model("Review",rschema);