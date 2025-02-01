const express = require('express')
const cors = require("cors");
const app = express()
const port = process.env.PORT || 5000;

// getting-started.js 
const mongoose = require('mongoose');
// TLDRVF9EJkxn44Ak -> My Password  // https://book-app-frontend-tau.vercel.app
require('dotenv').config()


// middleware
app.use(express.json());
app.use(cors({
    origin: ['http://localhost:5173'],
    credentials: true
}))


const bookRoutes = require("../backend/src/books/book.route")
const orderRoutes = require("./src/orders/order.route")
const categoryRoutes = require("./src/categories/category.route")
const userRoutes =  require("./src/users/user.route")
const adminRoutes = require("./src/stats/admin.stats")

app.use("/api/books", bookRoutes);
app.use("/api/orders", orderRoutes)
app.use("/api/category", categoryRoutes)
app.use("/api/auth", userRoutes)
app.use("/api/admin", adminRoutes)


async function main() {
    await mongoose.connect(process.env.DB_URL);
    app.use("/", (req, res) => {
      res.send("Book Store Server is running!");
    });
}

main().then(() => console.log("Mongodb connect successfully!")).catch(err => console.log(err));


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})