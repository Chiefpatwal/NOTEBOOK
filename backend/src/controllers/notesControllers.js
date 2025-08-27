import Note from "../models/Note.js" 

export async function getNotes(req,res){
    try{
        const notes=await Note.find().sort({createdAt:-1}); // Fetch all notes sorted by creation date in descending order
        res.status(200).json(notes);
    }catch (error){
        console.error("Error in getting notes from controller",error);
        res.status(500).json({message:"Error in fetching notes"})

    }
}
export async function getNotesById(req,res){
    try{
        const note=await Note.findById(req.params.id);
        if(!note){
             res.status(404).json({message:"Note not found"});
        }
        res.json(note);
    }catch(error){
        console.error("Error in getting note by ID from controller",error);
        res.status(500).json({message:"Error in fetching note by ID"})
    }
}
        


export async function createNote(req,res){
   
    try{
         const {title,content}=req.body;
         const newNote=new Note({
            title,
            content  })
        const savedNote= await newNote.save();
         res.status(201).json(savedNote);


    }catch(error){
        console.error("Error in creating note from controller",error);
        res.status(500).json({message:"Error in creating note"})    
    }
 }

export async function updateNote(req,res){
    try{
        const {title, content}=req.body;
        const updatedNote=await Note.findByIdAndUpdate(req.params.id,{title,content},{new:true});
        if(!updatedNote){
            return res.status(404).json({message:"Note not found"});
        }
        res.status(200).json(updatedNote);
    }catch(error){
        console.error("Error in updating note from controller",error);
        res.status(500).json({message:"Error in updating note"})
    }       
}
    
export  async function deleteNote(req,res){
    try{
        const deletedNote=await Note.findByIdAndDelete(req.params.id);
        if(!deletedNote){
            return res.status(404).json({message:"Note not found"});
        }
        res.status(200).json({message:"Note deleted successfully"});
    }catch(error){
        console.error("Error in deleting note from controller",error);
        res.status(500).json({message:"Error in deleting note"})
    }
    
} 
