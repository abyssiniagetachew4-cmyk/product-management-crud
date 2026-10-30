import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import connectDB from "./config/db.js";
import Product from "./models/Product.js";

const seedProducts = [
  {
    productName: "HP Laptop",
    category: "Electronics",
    price: 45000,
    quantity: 10,
    description: "Laptop for office and educational use"
  },
  {
    productName: "Wireless Mouse",
    category: "Accessories",
    price: 1200,
    quantity: 25,
    description: "Wireless mouse for computers"
  },
  {
    productName: "Office Chair",
    category: "Furniture",
    price: 8500,
    quantity: 8,
    description: "Comfortable chair for office use"
  },
  {
    productName: "USB Flash Drive",
    category: "Storage",
    price: 900,
    quantity: 30,
    description: "64GB USB storage device"
  },
  {
    productName: "Bluetooth Speaker",
    category: "Electronics",
    price: 3200,
    quantity: 15,
    description: "Portable Bluetooth speaker"
  }
];

const seedDatabase = async () => {
  try {
    await connectDB();

    const existingProducts = await Product.countDocuments();

    if (existingProducts > 0) {
      console.log(
        `Database already contains ${existingProducts} products. No seed data inserted.`
      );
      return;
    }

    const products = await Product.insertMany(seedProducts);

    console.log("Five products seeded successfully!");

    console.log(products);
  } catch (error) {
    console.error("Seeding failed:", error.message);
  } finally {
    await mongoose.disconnect();
  }
};

seedDatabase();
