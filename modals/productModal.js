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
    imageUrl: {
        public_id: String,
        url: String
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

    size: {
        type: [String],
        enum: ['S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL'],
    },
    color: {
        type: [String],
        default: []
    },

    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ProductReview",
            required: true
        },


    ]
})

export const productModal = mongoose.model("Product", productSchema)