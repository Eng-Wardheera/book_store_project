const Category = require("./category.model");

const postACategory = async (req, res) => {
    try {
        const newCategory = await Category({...req.body});
        await newCategory.save();
        res.status(200).send({message: "Category posted successfully", category: newCategory})
    } catch (error) {
        console.error("Error creating Category", error);
        res.status(500).send({message: "Failed to create Category"})
    }
}

// get all category
const getAllCategory =  async (req, res) => {
    try {
        const cats = await Category.find().sort({ createdAt: -1});
        res.status(200).send(cats)
        
    } catch (error) {
        console.error("Error fetching category", error);
        res.status(500).send({message: "Failed to fetch category"})
    }
}

module.exports = {
    postACategory,
    getAllCategory,
   
}