import express from "express";
const router=express.Router();
import { getNotes,getNotesById, createNote, updateNote, deleteNote } from "../controllers/notesControllers.js";

router.get("/",getNotes);

router.get("/:id",getNotesById);

router.post("/",createNote);

router.put("/:id",updateNote);

router.delete("/:id",deleteNote);



export default router;