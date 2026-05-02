import mongoose from "mongoose";

const ProductReview = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        require: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true,
    },
    name: {
        type: String,
        require: true
    },
    comment: {
        type: String,
        require: true
    },
    rating: {
        type: Number,
        require: true,
        require: true
    }
})
export const ProductReviewModal = mongoose.model("ProductReview", ProductReview)