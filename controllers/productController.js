import { productModal } from "../modals/productModal.js";
import {
  errorRes,
  successRes,
  successReSend,
} from "../utils/globalResponseHandler.js";
import { productIdRegex } from "../utils/regex.js";

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
      image,
      categories,
      rating,
      numberOfReviews,
      reviews,
    } = req.body || {};
    if (!productName) return errorRes(res, 400, "Please enter product name");
    if (!description)
      return errorRes(res, 400, "Please enter product description");
    if (!price) return errorRes(res, 400, "Please enter product price");
    // if (!image) return errorRes(res, 400, "Please enter product image");

    const newProduct = new productModal({
      productName,
      description,
      price,
      image: {
        public_id: "sample_public_id",
        url: "https://drive.google.com/file/d/1YVM6sObwDR3Vt02IwRSilQA9rV7DrbUH/view",
      },
      categories,
      rating,
      numberOfReviews,
      reviews: [],
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
