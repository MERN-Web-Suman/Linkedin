
import React, { useEffect } from 'react'
import dp from "../assets/empty.jpeg";
import moment from "moment"
import { useState } from 'react';
import { BiLike } from "react-icons/bi";
import { FaRegCommentDots } from "react-icons/fa";
import { useContext } from 'react';
import { authDataContext } from "../context/AuthContext.jsx";
import axios from 'axios';
import { userDataContext } from '../context/UserContext.jsx';
import { AiFillLike } from "react-icons/ai";
import { BsSendFill } from "react-icons/bs";
import {io} from "socket.io-client"
import ConnectionButton from './ConnectionButton.jsx';

let socket = io("http://localhost:800")


export default function Post({id,author,like,comment,description,image,createdAt}) {

    let [more,setMore]=useState(false)
    let {serverUrl} = useContext(authDataContext)
     let {userData,setUserData,getPost,handleGetProfile}=useContext(userDataContext)

    let [likes,setLikes] = useState(like || [])

    let [commentContent,setCommentContent] = useState("")
    let [comments,setComments] = useState(comment || [])

    let [showComment,setShowComment] = useState(false)
     
   
      //  LIKES HANDLING
    const handlelike = async ()=> {
      try {
        let result = axios.get(serverUrl+`/api/post/like/${id}`,
          {withCredentials:true})
           setLikes(result.data.like)
      } catch (error) {
        console.log(error)
      }
    }

      // COMMENT HANDLING
      const handleComment = async (e)=>{
        e.preventDefault()
        try {
          let result = await axios.post(serverUrl+`/api/post/comment/${id}`,{
            content:commentContent
          },{withCredentials:true})
          setComments(result.data.comment)
          setCommentContent("")
          
        } catch (error) {
          console.log(error)
        }
      };
        

      useEffect(()=>{
        socket.on("likeUpdated",({postId,likes})=>{
          if(postId==id){
            setLikes(likes)
          }
        })

        socket.on("commentAdded",({postId,comm})=>{
          if(postId==id){
            setComments(comm)
          }
        })

        return ()=>{
          socket.off("likeUpdated")
          socket.off("commentAdded")
        }
      },[id])

 
     useEffect(()=>{
      getPost()
     },[likes,comments])
    

    
  return (
    <div className='w-full min-h-[200px] flex flex-col gap-[10px] bg-white rounded-lg shadow-lg P-[20PX] '>

          <div className='flex justify-between items-center '>

      {/* profile  */}
      <div className='flex justify-center items-start gap-[10px] ' onClick={()=>handleGetProfile(author.userName)} >
          <div className='w-[70px] h-[70px] rounded-full overflow-hidden flex items-center justify-center cursor-pointer mx-[20px] my-[20px] '>
               <img src={author.profileImage || dp} alt="" className='h-full  ' />
          </div>
          <div className='text-[22px] font-semibold  my-[20px] ' >
              {`${author.firstName} ${author.lastName}`}
              <div className='text-[16px] '>{author.headline} </div>
              <div className='text-[16px]  '>{moment(createdAt).fromNow()} </div>
          </div>
      </div>
     
      {/* button */}
        
        {userData._id!=author._id && <ConnectionButton userId={author._id} /> }
        
      

      <div>
         
      </div>
      </div>
       
       {/* description */}

       <div className={`w-full ${!more?"max-h-[100px] overflow-hidden":""} pl-[50px] `}>{description} </div>
       <div className='pl-[50px] text-[19px] font-semibold  ' onClick={()=>setMore(prev=>!prev)} >{more?"read less...":"read more..."}</div>

       {image && 
         
         <div className='w-full h-[300px] overflow-hidden flex justify-center rounded-lg '>
            <img src={image} alt="" className='h-full rounded-lg' />
         </div>
         }
          
          {/* likes and comments */}

         <div>
          {/* likes part */}
          <div className='w-full flex justify-between items-center p-[20px] border-b-2 border-gray-500 ' >
             <div className='flex items-center justify-center gap-[5px] text-[18px] ' >
              <BiLike className='text-[#1ebbff] w-[20px] h-[20px]  ' /> <span> {likes.length} </span>
             </div>
             {/* comments */}
             <div className='flex items-center justify-center gap-[5px] text-[18px]  ' onClick={()=>setShowComment(prev=>!prev)} >
              <span>{comment.length} </span> <span>comments</span>
             </div>
          </div>


               <div className='flex items-center justify-center w-full p-[20px] gap-[20px] '>
                   {!likes.includes(userData._id) && <div className='flex justify-center items-center gap-[10px] cursor-pointer ' onClick={handlelike} >
                <BiLike className='w-[24px] h-[24px] ' />
                <span>Like</span>
               </div> }

                
                 {likes.includes(userData._id) && <div className='flex justify-center items-center gap-[10px] cursor-pointer ' onClick={handlelike} >
                <AiFillLike  className='w-[24px] h-[24px] text-[#07a4ff]  ' />
                <span className='text-[#07a4ff]'>Liked</span>
               </div> }



               {/* comment */}
               <div className='flex justify-center items-center gap-[10px] cursor-pointer' onClick={()=>setShowComment(prev=>!prev)} >
                 <FaRegCommentDots className='w-[24px] h-[24px] ' />
                 <span>comment</span>
               </div>
          </div>
 


          {showComment && 

             <div className='mb-[20px] px-[20px] ' >
            <form className='w-full flex justify-between items-center border-b-2 border-b-gray-300  p-[10px] ' onSubmit={handleComment} >
              <input type="text" name="" id="" placeholder={"leave a comment"} className='outline-none border-none ' value={commentContent} onChange={(e)=>setCommentContent(e.target.value)} />
              <button><BsSendFill className='text-[#70a4ff] w-[22px] h-[22px]  ' /></button>
            </form>
                   
                   <div className='flex flex-col gap-[10px]'>
       {comments.map((com)=>(
        <div key={com._id} className='flex flex-col gap-[10px] border-b-2 p-[20px] border-b-gray-300' >
            <div className="w-full flex justify-start items-center gap-[10px]">
            <div className='w-[40px] h-[40px] rounded-full overflow-hidden flex items-center justify-center  cursor-pointer' >
                    <img src={com.user.profileImage || dp} alt="" className='h-full' />
                </div> 
                
                <div className='text-[16px] font-semibold'>{`${com.user.firstName} ${com.user.lastName}` }</div>
              
                
            </div>
            <div className='pl-[50px]'>{com.content}</div>
        </div>
       ))} 
    </div>
          </div> 
           }

        
         </div>

        </div>   
    
  )
}
