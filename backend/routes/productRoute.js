const express = require("express");
const {
    getAllProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductDetails,
    createProductReview,
    getProductReviews,
    deleteReview,
    getAdminProducts,
} = require("../controllers/productController");
const { isAuthenticated, authorizeRoles } = require("../middleware/auth");
const router = express.Router();

router.route("/products").get(getAllProducts);

router
    .route("/admin/products")
    .get(isAuthenticated, authorizeRoles("admin"), getAdminProducts);

router
    .route("/admin/product/new")
    .post(isAuthenticated, authorizeRoles("admin"),createProduct);
router
    .route("/admin/product/:id")
    .put(isAuthenticated, authorizeRoles("admin"), updateProduct);
router
    .route("/admin/product/:id")
    .delete(isAuthenticated, authorizeRoles("admin"), deleteProduct);
router.route("/product/:id").get(getProductDetails);
router.route("/review").put(isAuthenticated, createProductReview);
router.route("/reviews").get(getProductReviews);
router.route("/reviews").delete(isAuthenticated, deleteReview);

module.exports = router;