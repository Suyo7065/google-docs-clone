import {Server} from 'socket.io';
import { getDocument, updateDocument } from './controller/document-controller.js';

import Connection from './database/Db.js';


const PORT =9000;

Connection();

const io = new Server(PORT,{
    cors:{
        origin: 'http://localhost:3000',
        methods:['GET','POST']
    }
});


io.on('connection',socket =>{
    socket.on('get-document',async documentID=>{
        const document = await getDocument(documentID);
        socket.join(documentID);
        socket.emit('load-document',document.data);


        socket.on('send-changes',delta =>{
            console.log("Socket Connected");
            socket.broadcast.to(documentID).emit('receive-changes',delta);
        })

        socket.on('save-document',async data=>{
            await updateDocument(documentID,data)
        })
    })

    
})