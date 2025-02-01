const express =  require('express');
const User = require('./user.model');
const jwt = require('jsonwebtoken');
const { getAllUsers, getSingleUser, UpdateUser, deleteAUser, postAUser } = require('./user.controller');
const verifyAdminToken = require('../middleware/verifyAdminToken');

const router =  express.Router();

const JWT_SECRET = process.env.JWT_SECRET_KEY

// post a User
router.post("/create-user", verifyAdminToken, postAUser)

// get all Users
router.get("/all-users", getAllUsers);

// single User endpoint
router.get("/get-user/:id", getSingleUser);

// update a User endpoint
router.put("/edit-user/:id", verifyAdminToken, UpdateUser);

router.delete("/delete-user/:id", verifyAdminToken, deleteAUser)


router.post("/admin", async (req, res) => {
    const {username, password} = req.body;
    try {
        const admin =  await User.findOne({username});
        if(!admin) {
            res.status(404).send({message: "Admin not found!"})
        }
        if(admin.password !== password) {
            res.status(401).send({message: "Invalid password!"})
        }
        
        const token =  jwt.sign(
            {id: admin._id, username: admin.username, role: admin.role, userImage: admin.userImage}, 
            JWT_SECRET,
            {expiresIn: "1h"}
        )

        return res.status(200).json({
            message: "Authentication successful",
            token: token,
            user: {
                username: admin.username,
                role: admin.role
            }
        })
        
    } catch (error) {
       console.error("Failed to login as admin", error)
       res.status(401).send({message: "Failed to login as admin"}) 
    }
})



module.exports = router