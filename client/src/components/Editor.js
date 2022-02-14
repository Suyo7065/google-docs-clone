import styled from '@emotion/styled';
import {Box} from '@mui/material';
import Quill from 'quill'
import 'quill/dist/quill.snow.css'
import { useEffect,useState } from 'react';

import{io} from 'socket.io-client';
import { useParams } from 'react-router-dom';


const Component = styled.div`
 background: #F5F5F5;
`

const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    
    [{ 'header': 1 }, { 'header': 2 }],               // custom button values
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
    [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
    [{ 'direction': 'rtl' }],                         // text direction
    
    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    
    ['blockquote', 'code-block'],
    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    [{ 'font': [] }],
    [{ 'align': [] }],
  
    ['clean']                                         // remove formatting button
  ];


const Editor = () => {
    const [socket,setSocket]= useState();
    const [quill,setQuill]= useState();
    const {id} = useParams();
    console.log(id);

// For Quill server
    useEffect(() => {
      const quillServer = new Quill('#container',{theme:'snow',modules:{toolbar:toolbarOptions}})
      quillServer.disable();
      quillServer.setText('Loading Document .....')
      setQuill(quillServer)
    }, []);


    // For Intialising Socket Server
    useEffect(() => {
      const socketServer= io('http://localhost:9000');
      setSocket(socketServer)

      return() =>{
          socketServer.disconnect();

      }
    },[]);

//For Sending Changes to Backend made in Doc
    useEffect(() => {
        if(socket===null || quill ===null) return;


      const handleChange = (delta,oldData,source) =>{
          if(source!== 'user') return;

          socket && socket.emit('send-changes',delta);
      }

      quill && quill.on('text-change',handleChange);

      return()=>{
          quill && quill.off('text-change',handleChange);
      }
    
     
    }, [quill,socket]);


    //For broadcasting changes in one room
    useEffect(() => {
        if(socket===null || quill ===null) return;


      const handleChange = (delta) =>{
          
          quill.updateContents(delta);
      }

      socket && socket.on('receive-changes',handleChange);

      return()=>{
          socket && socket.off('receive-changes',handleChange);
      }
    
     
    }, [quill,socket]);
    

    //Fro chechking whether there is a previous data or not in Db
    useEffect(()=>{
        if(quill===null || socket===null) return;

        socket && socket.once('load-document',document=>{
            quill && quill.setContents(document);
            quill && quill.enable()
        })

        socket && socket.emit('get-document',id)

    },[quill,socket,id])


    //For upadting content in Db  or Save Document

    useEffect(()=>{
        if(socket===null || quill ===null){
            return
        }

       const interval= setInterval(()=>{
            socket &&socket.emit('save-document',quill.getContents())
        },2000);

        return ()=>{
            clearInterval(interval);
        }
    },[socket,quill])
    


    return( 
        <Component>
            <Box className="container" id ='container'>
                
            </Box>
        </Component>
    )
};

export default Editor;
