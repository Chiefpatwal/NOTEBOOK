import express from "express";
import Visitor from "../models/Visitor.js";

const router = express.Router();


router.get("/", async (req, res) => {
  try {
    let data = await Visitor.findOne();

    if (!data) {
      data = await Visitor.create({ count: 1 });
    } else {
      data.count += 1;
      await data.save();
    }

    res.json({ count: data.count });
  } catch (error) {
    console.error("Visitor API error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
