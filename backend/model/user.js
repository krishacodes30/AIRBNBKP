const mongoose=require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const uschema=new mongoose.Schema({

    email:String,
    
});
uschema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", uschema);