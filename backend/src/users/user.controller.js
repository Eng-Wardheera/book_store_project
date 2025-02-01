const User = require("./user.model");

const postAUser = async (req, res) => {
    try {
        const newUser = await User({...req.body});
        await newUser.save();
        res.status(200).send({message: "User posted successfully", user: newUser})
    } catch (error) {
        console.error("Error creating user", error);
        res.status(500).send({message: "Failed to create user"})
    }
}

// get all Users
const getAllUsers =  async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1});
        res.status(200).send(users)
        
    } catch (error) {
        console.error("Error fetching users", error);
        res.status(500).send({message: "Failed to fetch users"})
    }
}

const getSingleUser = async (req, res) => {
    try {
        const {id} = req.params;
        const user =  await User.findById(id);
        if(!user){
            res.status(404).send({message: "User not Found!"})
        }
        res.status(200).send(user)
        
    } catch (error) {
        console.error("Error fetching user", error);
        res.status(500).send({message: "Failed to fetch user"})
    }

}

// update user data
const UpdateUser = async (req, res) => {
    try {
        const {id} = req.params;
        const updatedUser =  await User.findByIdAndUpdate(id, req.body, {new: true});
        if(!updatedUser) {
            res.status(404).send({message: "User is not Found!"})
        }
        res.status(200).send({
            message: "User updated successfully",
            user: updatedUser
        })
    } catch (error) {
        console.error("Error updating a user", error);
        res.status(500).send({message: "Failed to update a user"})
    }
}

const deleteAUser = async (req, res) => {
    try {
        const {id} = req.params;
        const deletedUser =  await User.findByIdAndDelete(id);
        if(!deletedUser) {
            res.status(404).send({message: "User is not Found!"})
        }
        res.status(200).send({
            message: "User deleted successfully",
            user: deletedUser
        })
    } catch (error) {
        console.error("Error deleting a User", error);
        res.status(500).send({message: "Failed to delete a User"})
    }
};

module.exports = {
    postAUser,
    getAllUsers,
    getSingleUser,
    UpdateUser,
    deleteAUser
}