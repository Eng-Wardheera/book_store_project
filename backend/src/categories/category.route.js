const express = require('express');
const Category = require('./category.model');
const verifyAdminToken = require('../middleware/verifyAdminToken');
const { postACategory, getAllCategory } = require('./category.controller');


const router =  express.Router();

// post a cate
router.post("/create-category/", verifyAdminToken, postACategory)

// get all cate
router.get("/", getAllCategory);


module.exports = router;