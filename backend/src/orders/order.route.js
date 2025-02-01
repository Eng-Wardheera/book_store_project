const express = require('express');
const { createAOrder, getOrderByEmail, getAllOrders } = require('./order.controller');

const router =  express.Router();

// create order endpoint
router.post("/", createAOrder);

// get all Users
router.get("/all-orders", getAllOrders);

// get orders by user email 
router.get("/email/:email", getOrderByEmail);

module.exports = router;