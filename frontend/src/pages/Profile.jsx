
import React, { useContext, useEffect, useState } from 'react'
import Nav from '../components/Nav'
import dp from "../assets/empty.jpeg";
import { FiPlus } from "react-icons/fi";
import { MdOutlineCameraAlt } from "react-icons/md";
import { BiSolidPencil } from "react-icons/bi";
import EditProfile from "../components/EditProfile.jsx";
import { userDataContext } from '../context/UserContext'
import axios from 'axios';
import { authDataContext } from '../context/AuthContext';
import Post from '../components/Post.jsx'
import ConnectionButton from '../components/ConnectionButton.jsx';


export default function Profile() {
    
    let {userData,setuserData,edit,setEdit,postData,setPostData,profileData,setProfileData} = useContext(userDataContext)
    let {serverUrl} = useContext(authDataContext)
    let [profilePost,setProfilePost] = useState([])

  

    useEffect(()=>{
      setProfilePost(postData.filter((post)=>post.author._id==profileData._id))
    },[profileData])

  return (
    <div className='w-full min-h-[100vh] bg-[#f0efe7] flex flex-col items-center pt-[100px] rounded-lg shadow-lg pb-[40px] ' >
      <Nav/>
      {edit && <EditProfile/> }
   

      <div className='w-full max-w-[900px] min-h-[100vh] flex flex-col gap-[10px] '>
           
           <div className='relative bg-[white] pb-[40px] '>
              <div className="w-[100%] h-[100px] bg-gray-400 rounded overflow-hidden flex items-center justify-center relative cursor-pointer">
                       <img src={profileData.coverImage || " "} alt="" className="w-full" />
                       <MdOutlineCameraAlt className="absolute  right-[20px]  top-[20px] w-[25px]  h-[25px]  text-gray-800 cursor-pointer " />
                     </div>
                     <div className="w-[70px] h-[70px] rounded-full overflow-hidden items-center justify-center absolute top-[65px] left-[35px] cursor-pointer ">
                       <img src={profileData.profileImage || dp } alt="" className="h-full" />
                     </div>
             
                     <div className="w-[20px] h-[20px] bg-[#17c1ff] absolute top-[105px] left-[90px] rounded-full flex justify-center items-center cursor-pointer">
                       <FiPlus />
                     </div>
             
                     {/* user profile dp or basic data */}
             
                     <div className="mt-[30px] pl-[20px] text-[19px] font-semibold text-red-700 ">
                       <div> {`${profileData.firstName} ${profileData.lastName}`} </div>
                       <div className="text-[19px] font-semibold text-gray-700 ">
                         {" "}
                         {profileData.headline || ""}{" "}
                       </div>
                       <div className="text-[16px] text-gray-500 ">
                         {" "}
                         {profileData.location}{" "}
                       </div>
                       <div className='text-[16px] text-gray-500 ' >{`${profileData.connection.length}`} connections </div>
                     </div>

                     {/* edit profile  */}
                       {profileData._id==userData._id &&    <button
                       className="-min-w-[190px] p-2 ml-4 h-[40px] my-[20px] text-[16px] rounded-full border-2 border-[#F68537]  hover:bg-[#393E46]/85 bg-[#393E46] text-[white] flex items-center justify-center gap-[10px]  "
                       onClick={() => setEdit(true)}
                     >
                       Edit Profile <BiSolidPencil />
                     </button>}

                     {profileData._id!=userData._id &&  
                      
                      <div className='ml-[20px] mt-[20px] ' >
                        <ConnectionButton userId={profileData._id} /> 
                      </div>
                   }
                  

                   </div> 

                  
                   <div className='w-full min-h-[100px] flex items-center p-[20px] text-[22px] text-gray-600 font-semibold bg-white shadow-xl  ' >
                     {`Post (${profilePost.length})`}
                     </div>

                     {profilePost.map((post,index)=>(
                      <Post key={index} id={post._id} description={post.description}
                      author={post.author} image={post.image}
                      like={post.like} comment={post.comment} createdAt={post.createdAt} />
                     ))}

                     {profileData.skills.length>0 && 
                      
                      <div className='w-full min-h-[100px] flex  p-[20px] 
                       bg-white shadow-lg rounded-lg flex-col justify-center ' >
                         <div className='text-[22px] text-blue-700 font-semibold ' > Skills </div>
                          <div className='flex flex-wrap justify-start items-center gap-[20px] text-black text-[15px] p-[20px] '> 
                       {profileData.skills.map((skill)=>(
                        <div className='text-[20px] ' > {skill} </div>
                       ))}
                       {profileData._id==userData._id &&
                         <button className='min-w-[150px] h-[40px] rounded-full border-2 ml-[20px] border-[#2dc0ff] text-[#2dc0ff] flex items-center justify-center gap-[10px] '  onClick={()=>setEdit(true)} >Add Skills</button> }
                      
                     </div>
                      </div>  }
                     
                        {/* Education */}

                         {profileData.education.length>0 && 
                      
                      <div className='w-full min-h-[100px] flex  p-[20px] 
                       bg-white shadow-lg rounded-lg flex-col justify-center ' >
                         <div className='text-[22px] text-blue-700 font-semibold ' > Education </div>
                          <div className='flex flex-col justify-start items-start gap-[20px] text-black text-[15px] p-[20px] '> 
                       {profileData.education.map((edu)=>(
                          <>
                              <div className='text-[20px] '>College : {edu.college}</div>
                              <div className='text-[20px]'>Degree : {edu.degree}</div>
                              <div className='text-[20px]'>Field Of Study : {edu.fieldOfStudy}</div>
                              </>
                               ))}

                               {profileData._id==userData._id && 
                                <button className='min-w-[150px] h-[40px] rounded-full border-2 ml-[20px] border-[#2dc0ff] text-[#2dc0ff] flex items-center justify-center gap-[10px] '  onClick={()=>setEdit(true)} >Add Education</button> }
                      
                     </div>
                      </div>  }

                      {/* Experience */}

                            {profileData.experience.length>0 && 
                      
                      <div className='w-full min-h-[100px] flex  p-[20px] 
                       bg-white shadow-lg rounded-lg flex-col justify-center ' >
                         <div className='text-[22px] text-blue-700 font-semibold ' > Experience </div>
                          <div className='flex flex-col justify-start items-start gap-[20px] text-black text-[15px] p-[20px] '> 
                     {profileData.experience.map((ex)=>(
                                  <>
                                  <div className='text-[20px]'>title : {ex.title}</div>
                                  <div className='text-[20px]'>Company : {ex.company}</div>
                                  <div className='text-[20px]'>description : {ex.description}</div>
                                  </>
                              ))}

                              {profileData._id==userData._id && 
                              <button className='min-w-[150px] h-[40px] rounded-full border-2 ml-[20px] border-[#2dc0ff] text-[#2dc0ff] flex items-center justify-center gap-[10px] '  onClick={()=>setEdit(true)} >Add Experience</button> }
                       
                     </div>
                      </div>  }

           </div>

           



      </div>
   
  )
}
