import document from "../schema/documentSchema.js"


export const getDocument= async (id) =>{
    if(id===null) return;

     const Document= await document.findById(id);

     if(Document) return Document;

     return await document.create({_id:id,data:""})
}

export const updateDocument= async (id,data) =>{
    

     return await document.findByIdAndUpdate(id,{data})
}