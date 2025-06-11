const mongoose = require("mongoose");
const Review = require("./review.js");

const lsschema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  price: String,
  location: String,
  country: String,
  image: {
    type: String,
    default:
      "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y2FtcGluZ3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    set: (v) => {
      if (typeof v === "object" && v?.url) return v.url;
      if (typeof v === "string" && v.trim() !== "") return v;
      return "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y2FtcGluZ3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60";
    },
  },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});
lsschema.pre("findOneAndDelete",async()=>{console.log("pre is called")})
lsschema.post("findOneAndDelete",async(listingdata)=>{
  console.log("lssschema nu data che....")
  console.log(listingdata);
  if(listingdata){
  await Review.deleteMany({_id:{$in:listingdata.reviews}})

  }
})
const listing = mongoose.model("airbnb", lsschema);
module.exports = listing;
