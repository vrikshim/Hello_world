const express = require("express");
const {
    newOrder,
    getSingleOrder,
    myOrders,
    getAllOrders,
    UpdateOrder,
    deleteOrder,
} = require("../controllers/orderController");
const router = express.Router();
const { isAuthenticated, authorizeRoles } = require("../middleware/auth");

router.route("/order/new").post(isAuthenticated, newOrder);
router.route("/order/:id").get(isAuthenticated, getSingleOrder);
router.route("/orders/me").get(isAuthenticated, myOrders);
router
    .route("/admin/orders")
    .get(isAuthenticated, authorizeRoles("admin"), getAllOrders);
router
    .route("/admin/order/:id")
    .put(isAuthenticated, authorizeRoles("admin"), UpdateOrder);
router
    .route("/admin/order/:id")
    .delete(isAuthenticated, authorizeRoles("admin"), deleteOrder);

module.exports = router;