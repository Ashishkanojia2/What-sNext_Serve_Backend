import { productModal } from "../modals/productModal.js";
import { ProductReviewModal } from "../modals/ProductReviewModal.js";
import {
  errorRes,
  successRes,
  successReSend,
} from "../utils/globalResponseHandler.js";
import { productIdRegex } from "../utils/regex.js";
import cloudinary from "cloudinary";

export const getAllProducts = async (req, res) => {
  try {
    const { category } = req.query || {};
    const filter = category ? { categories: category } : "all";
    const products = await productModal.find(filter === "all" ? {} : filter);
    if (products.length === 0) return errorRes(res, 404, "No products found");
    successReSend(
      res,
      200,
      `${category} products fetched successfully`,
      products,
    );
  } catch (error) {
    errorRes(res, 500, error.message);
  }
};

export const addProduct = async (req, res) => {
  try {
    const {
      productName,
      description,
      price,
      categories,
      rating,
      numberOfReviews,
      reviews,
      size,
      color,
      companyName,
    } = req.body || {};
    const imageUrl = req.files.imageUrl;

    console.log("imageUrl", imageUrl);
    if (!productName) return errorRes(res, 400, "Please enter product name");
    if (!description)
      return errorRes(res, 400, "Please enter product description");
    if (!price) return errorRes(res, 400, "Please enter product price");
    if (!imageUrl) return errorRes(res, 400, "Please select image");
    if (!companyName) return errorRes(res, 400, "Please provide company name");

    const ProductImage = await cloudinary.v2.uploader.upload(
      imageUrl?.tempFilePath,
    );

    const newProduct = new productModal({
      productName: productName.trim(),
      description: description.trim(),
      price: price.trim(),
      imageUrl: {
        public_id: ProductImage.public_id,
        url: ProductImage.secure_url,
      },
      reviews,
      categories,
      rating,
      numberOfReviews,
      size: JSON.parse(size),
      color: JSON.parse(color),
      companyName
    });

    await newProduct.save();
    successRes(res, 201, "Product added successfully");
  } catch (error) {
    errorRes(res, 500, error.message);
  }
};

export const getSingleProductInfo = async (req, res) => {
  try {
    const { productId } = req.query;
    console.log("productId", productId);

    if (!productId) {
      return errorRes(res, 400, "Product id is missing");
    }
    if (productIdRegex({ productId })) {
      return errorRes(res, 400, "Invalid product id");
    }

    const product = await productModal.findOne({ _id: productId });
    if (!product) {
      return errorRes(res, 404, "Product not found");
    }
    return successReSend(res, 200, "Product successfully fetched", product);
  } catch (error) {
    return errorRes(res, 500, error.message);
  }
};

export const postReview = async (req, res) => {
  try {
    const { name, comment, rating, productId } = req.body;
    const user = req.user;
    if (!user?._id) {
      return errorRes(res, 401, "User not authenticated");
    }
    if (!productId) {
      return errorRes(res, 400, "ProductId is required");
    }

    if (!name || !comment || !rating) {
      return errorRes(res, 400, "All fields are required");
    }

    if (rating < 1 || rating > 5) {
      return errorRes(res, 400, "Rating must be between 1 and 5");
    }
    const product = await productModal.findById(productId);
    if (!product._id) return errorRes(res, 404, "Product not found");

    const reviewData = new ProductReviewModal({
      userId: user._id,
      name,
      comment,
      rating,
      productId,
    });
    user.reviews.push(reviewData._id);
    product.reviews.push(reviewData._id);
    Promise.all([reviewData.save(), user.save(), product.save()]);
    return successRes(res, 201, "Thank you for your support!");
  } catch (error) {
    console.log("getting error while post user reiview on the post");
  }
};

///SIMPLE REVIEW RESPONDER. WITHOOUT PAGINATION

// export const getReview = async (req, res) => {
//   try {
//     const { reviewId } = req.query;
//     if (!reviewId) return errorRes(res, 404, "Review Not found!");
//     const result = await ProductReviewModal.findById(reviewId);
//     console.log("Review Result", result);

//     successReSend(res, 200, "CustomerReview found Successfullly", result);
//   } catch (error) {
//     // return errorRes(res, 500, "Internal server error");
//     return errorRes(res, 500, error?.message);
//   }
// };

// WITH PAGINATION
export const getProductReview = async (req, res) => {
  try {
    const { productId, page = 1, limit = 3 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    // first get total review ids
    const productData = await productModal
      .findById(productId)
      .select("reviews");

    if (!productData) {
      return errorRes(res, 404, "Product not found");
    }

    // total reviews count
    const totalRecords = productData.reviews.length;

    // paginated reviews
    const product = await productModal
      .findById(productId)
      .populate({
        path: "reviews",
        options: {
          skip: skip,
          limit: Number(limit),
        },
      });

    return successReSend(res, 200, "Reviews fetched", {
      reviews: product.reviews,
      totalRecords: totalRecords,
      currentPage: Number(page),
      totalPages: Math.ceil(totalRecords / Number(limit)),
      hasMore:
        skip + product.reviews.length < totalRecords,
    });

  } catch (error) {
    return errorRes(res, 500, error.message);
  }
};
