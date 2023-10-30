const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const ApiFeatures = require("../utils/apifeatures");
const cloudinary = require("cloudinary");

// create a product
exports.createProduct = catchAsyncError(async (req, res, next) => {
    try {
      let images = [];
      if (typeof req.body.images === "string") {
        images.push(req.body.images);
      } else {
        images = req.body.images;
      }
  
      const imagesLink = [];
      for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i], {
          folder: "products",
        });
  
        imagesLink.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }
  
      req.body.image = imagesLink;
  
      //req.body.user = req.user.id;
      const product = await Product.create(req.body);
      res.status(201).json({
        success: true,
        product,
      });
    } catch (error) {
      // Handle any errors here and pass them to the error handling middleware (next)
      next(error);
    }
  });
  

// Get all products
exports.getAllProducts = catchAsyncError(async(req, res, next) => {
    //return next(new ErrorHandler("This is my new temp error", 500));
    const resultPerPage = 8;
    const productsCount = await Product.countDocuments();
    const apiFeature = new ApiFeatures(Product.find(), req.query)
        .search()
        .filter()
        .pagination(resultPerPage);
    const products = await apiFeature.query;
    res
        .status(200)
        .json({ success: true, products, productsCount, resultPerPage });
});

// Update product
exports.updateProduct = catchAsyncError(async(req, res, next) => {
    let product = await Product.findById(req.params.id);
    // if (!product) {
    //     return res.status(500).json({
    //         success: false,
    //         message: "Product Not Found",
    //     });
    // }
    if (!product) {
        return next(new ErrorHandler("Product Not Found", 404));
    }

    let images = [];
    if (typeof req.body.image === "string") {
        images.push(req.body.image);
    } else {
        images = req.body.image;
    }

    if (images !== undefined) {
        for (let i = 0; i < product.image.length; i++) {
            await cloudinary.v2.uploader.destroy(product.image[i].public_id);
        }

        const imagesLink = [];
        for (let i = 0; i < images.length; i++) {
            const result = await cloudinary.v2.uploader.upload(images[i], {
                folder: "products",
            });

            imagesLink.push({
                public_id: result.public_id,
                url: result.secure_url,
            });
        }

        req.body.image = imagesLink;
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });
    res.status(200).json({
        success: true,
        product,
    });
});

// Delete Product
exports.deleteProduct = catchAsyncError(async(req, res, next) => {
    const product = await Product.findById(req.params.id);
    // if (!product) {
    //     return res.status(500).json({
    //         success: false,
    //         message: "Product Not Found",
    //     });
    // }
    if (!product) {
        return next(new ErrorHandler("Product Not Found", 404));
    }
    for (let i = 0; i < product.image.length; i++) {
        await cloudinary.v2.uploader.destroy(product.image[i].public_id);
    }
    await product.remove();
    res.status(200).json({
        success: true,
        message: "product deleted successfully",
    });
});

// Get single product details
exports.getProductDetails = catchAsyncError(async(req, res, next) => {
    const product = await Product.findById(req.params.id);
    // if (!product) {
    //     return res.status(500).json({
    //         success: false,
    //         message: "Product Not Found",
    //     });
    // }
    if (!product) {
        return next(new ErrorHandler("Product Not Found", 404));
    }
    res.status(200).json({
        success: true,
        product,
    });
});

// Create New Review or Update the review
exports.createProductReview = catchAsyncError(async(req, res, next) => {
    const { rating, comment, productId } = req.body;

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment,
    };

    const product = await Product.findById(productId);

    const isReviewed = product.reviews.find(
        (rev) => rev.user.toString() === req.user._id.toString()
    );

    if (isReviewed) {
        product.reviews.forEach((rev) => {
            if (rev.user.toString() === req.user._id.toString())
                (rev.rating = rating), (rev.comment = comment);
        });
    } else {
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }

    let avg = 0;

    product.reviews.forEach((rev) => {
        avg += rev.rating;
    });

    product.ratings = avg / product.reviews.length;

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
    });
});

// Get All Reviews of a product
exports.getProductReviews = catchAsyncError(async(req, res, next) => {
    const product = await Product.findById(req.query.id);

    if (!product) {
        return next(new ErrorHander("Product not found", 404));
    }

    res.status(200).json({
        success: true,
        reviews: product.reviews,
    });
});

// Delete Review
exports.deleteReview = catchAsyncError(async(req, res, next) => {
    const product = await Product.findById(req.query.productId);

    if (!product) {
        return next(new ErrorHander("Product not found", 404));
    }

    const reviews = product.reviews.filter(
        (rev) => rev._id.toString() !== req.query.id.toString()
    );

    let avg = 0;

    reviews.forEach((rev) => {
        avg += rev.rating;
    });

    let ratings = 0;

    if (reviews.length === 0) {
        ratings = 0;
    } else {
        ratings = avg / reviews.length;
    }

    const numOfReviews = reviews.length;

    await Product.findByIdAndUpdate(
        req.query.productId, {
            reviews,
            ratings,
            numOfReviews,
        }, {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        }
    );

    res.status(200).json({
        success: true,
    });
});

// Get all products -- Admin
exports.getAdminProducts = catchAsyncError(async(req, res, next) => {
    const products = await Product.find();
    res.status(200).json({ success: true, products });
});