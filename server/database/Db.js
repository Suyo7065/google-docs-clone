import  mongoose from "mongoose";



const Connection =async(username='suyogya',password='suyogya123')=>{
    const URL =`mongodb://${username}:${password}@docs-clone-shard-00-00.i4oye.mongodb.net:27017,docs-clone-shard-00-01.i4oye.mongodb.net:27017,docs-clone-shard-00-02.i4oye.mongodb.net:27017/DOCS?ssl=true&replicaSet=atlas-355ayh-shard-0&authSource=admin&retryWrites=true&w=majority`

    try{
       await mongoose.connect(URL,{useUnifiedTopology:true,useNewUrlPArser: true})
       console.log("DB Connected Successfully")
    }catch(err){
        console.log("Error While Connecting To database",err.message)
    }
}

export default Connection;