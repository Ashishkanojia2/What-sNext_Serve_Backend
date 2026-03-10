import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    productName : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    price : {
        type : Number,
        required : true
    },
    imageUrl : {
        // type : String,
        // required : true
        public_id : String,
        url : String
    },
    createdAt : {
        type : Date,
        default : Date.now
    },
    categories:{
        type : String,
        required : true
    }, rating:{
        type : Number,
        default : 0
    },
    numberOfReviews:{
        type : Number,
        default : 0
    },
    reviews:[
        {
            userId:{
                type : mongoose.Schema.Types.ObjectId,
                ref : "User",
                required : true
            },
            name:{
                type : String,
                required : true
            },
            rating:{
                type : Number,
                required : true
            },
            comment:{
                type : String,
                required : true
            }
        }
    ]
})

export const productModal = mongoose.model("Product", productSchema)