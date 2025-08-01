import React, { useContext, useState } from "react";
import Nav from "../components/Nav.jsx";
import dp from "../assets/empty.jpeg";
import { FiPlus } from "react-icons/fi";
import { MdOutlineCameraAlt } from "react-icons/md";
import { userDataContext } from "../context/UserContext";
import { BiSolidPencil } from "react-icons/bi";
import EditProfile from "../components/EditProfile.jsx";
import { RxCross1 } from "react-icons/rx";
import { FaImages } from "react-icons/fa";
import { useRef } from "react";
import { authDataContext } from "../context/AuthContext";
import axios from "axios";
import Post from "../components/Post.jsx";
import { useEffect } from "react";




export default function Home() {
  let { userData, setUserData, edit, setEdit,postData,setPostData,handleGetProfile } = useContext(userDataContext);
  let {serverUrl} = useContext(authDataContext)

  let [frontendImage,setFrontendImage]=useState("")
  let [backendImage,setBackendImage]=useState("")
  let [description,setDescription]=useState("")
  let [uploadPost,setUploadPost] = useState(false)
  let [posting,setPosting] = useState(false)
  let [suggestedUser,setSuggestedUser] = useState([])

  let image = useRef()

      // function handleImage

      function handleImage(e){
        let file = e.target.files[0]
        setBackendImage(file)
        setFrontendImage(URL.createObjectURL(file))
      }

        //  post handling
        
        async function handleUploadPost() {
          setPosting(true)
           try {
            let formData = new FormData()
            formData.append("description",description)
            if(backendImage){
              formData.append("image",backendImage)
            }
            let result = await axios.post(serverUrl+"/api/post/create",formData,{withCredentials:true})
            console.log(result)
            setPosting(false)
            setUploadPost(false)
           } catch (error) {
            setPosting(false)
             console.log(error);
           }
        }

       
        const handleSuggestedUsers = async ()=>{
          try {
            let result = await axios.get(serverUrl+"/api/user/suggestedUser",{withCredentials:true})
            console.log(result.data)
            setSuggestedUser(result.data)
          } catch (error) {
            console.log(error)
          }
        }


        useEffect(()=>{
          handleSuggestedUsers()
        },[])



  return (
    <div
      className="w-full min-h-[100vh] bg-[#F6F6F6] pt-[100px] flex items-start justify-center gap-[20px] 
      px-[20px] flex-col lg:flex-row relative pb-[50px] "
    >
      {edit && <EditProfile></EditProfile>}

      <Nav></Nav>
            
            {/* USER INFORMATION OF BASIC */}

      <div className=" w-full lg:w-[25%] min-h-[200px] bg-[#FAF6E9] shadow-lg  rounded-lg p-[10px] relative cursor-pointer">
        <div className="w-[100%] h-[100px] bg-gray-400 rounded overflow-hidden flex items-center justify-center relative cursor-pointer">
          <img src={userData.coverImage || " "} alt="" className="w-full" />
          <MdOutlineCameraAlt className="absolute  right-[20px]  top-[20px] w-[25px]  h-[25px]  text-gray-800 cursor-pointer " />
        </div>
        <div className="w-[70px] h-[70px] rounded-full overflow-hidden items-center justify-center absolute top-[65px] left-[35px] cursor-pointer ">
          <img src={userData.profileImage || dp } alt="" className="h-full" />
        </div>

        <div className="w-[20px] h-[20px] bg-[#17c1ff] absolute top-[105px] left-[90px] rounded-full flex justify-center items-center cursor-pointer">
          <FiPlus />
        </div>

        {/* user profile dp or basic data */}

        <div className="mt-[30px] pl-[20px] text-[19px] font-semibold text-red-700 ">
          <div> {`${userData.firstName} ${userData.lastName}`} </div>
          <div className="text-[19px] font-semibold text-gray-700 ">
            {" "}
            {userData.headline || ""}{" "}
          </div>
          <div className="text-[16px] text-gray-500 ">
            {" "}
            {userData.location}{" "}
          </div>
        </div>
        {/* edit profile  */}
        <button
          className="w-[100%] h-[40px] my-[20px] text-[16px] rounded-full border-2 border-[#F68537]  hover:bg-[#393E46]/85 bg-[#393E46] text-[white] flex items-center justify-center gap-[10px]  "
          onClick={() => setEdit(true)}
        >
          Edit Profile <BiSolidPencil />
        </button>
      </div>  

               {/* posts popup */}
                  
                  {uploadPost && 
                    <div className="w-full h-full bg-black absolute top-0 z-[100] left-0 opacity-[0.6] "></div>
                   }

                  {uploadPost &&

                    <div className="w-[90%] max-w-[500px] h-[550px] bg-[white] shadow-lg rounded-lg absolute z-[200] p-[20px]  flex items-start justify-start flex-col gap-[20px] ">
                    <div className="absolute top-[20px] right-[20px] cursor-pointer  ">
                           <RxCross1 className="w-[25px] cursor-pointer h-[25px] text-gray-800 font-bold " onClick={()=>setUploadPost(false)} />
                    </div>
                    <div className="flex justify-start items-center gap-[10px] "> 
                     <div className="w-[70px] h-[70px] rounded-full overflow-hidden flex items-center justify-center cursor-pointer ">
                          <img src={userData.profileImage || dp} alt="" className="h-full  " />
                     </div>
                       
                       {/* name of user */}
     
                         <div className="text-[22px] "> {`${userData.firstName} ${userData.lastName} ` } </div>                     

                    </div>

                    {/* textarea post */}
                     
                       <textarea name="" id="" className={`w-full ${frontendImage?"h-[200px]" :"h-[300px]"}   outline-none border-none p-[10px] 
                           resize-none text-[19px]`}   placeholder="what do you want to talk about....?" value={description} onChange={(e)=>setDescription(e.target.value)} >

                           </textarea>

                              <input type="file" name="" id="" ref={image} hidden onChange={handleImage} />

                               {/* see image after post */}

                               <div className="w-full h-[300px] overflow-hidden   ">
                                <img src={frontendImage || ""} alt="" className="h-full  " />
                               </div>
                           
                         {/* image post */}
                           
                          <div className="w-full h-[200px] flex flex-col ">
                             <div className="p-[20px] flex items-center justify-start border-b-2 border-gray-500  " >
                                <FaImages className="w-[24px] h-[24px] text-gray-500 " onClick={()=>image.current.click()} />
                             </div>

                            

                              <div className="flex justify-end items-center">
                                 <button className="w-[100px] h-[50px] rounded-full bg-[#24b2ff] mt-[40px] text-white " 
                                 disabled={posting}     onClick={handleUploadPost}   > {posting?"Posting...":"Post"} </button>
                              </div>
                          </div>

                  </div> 
 
                    }  

               
            {/* CREATE A POSTS */}

      <div className=" w-full lg:w-[50%] min-h-[200px] bg-[#f0efe7] shadow-lg cursor-pointer flex flex-col gap-[20px] ">
        <div className="w-full h-[120px] bg-white shadow-lg rounded-lg flex items-center justify-center gap-[10px] p-[20px] ">
          <div className="w-[70px] h-[70px] rounded-full overflow-hidden flex items-center justify-center cursor-pointer ">
            <img src={userData.profileImage || dp} alt="" className="h-full " />
          </div>
            <button className="w-[80%] h-[60px] border-2 rounded-full border-gray-500 flex items-center
              justify-center px-[20px] hover:bg-gray-200   " onClick={()=>setUploadPost(true)} >Start a post..</button>
        </div>

               {postData.map((post,index)=>(
          <Post key={index} id={post._id} description={post.description} author={post.author} image={post.image} like={post.like}
           comment={post.comment} createdAt={post.createdAt}/>
        ))}

  
        
        
      </div>

        {/* SHOW SUGGESTED USERS */}

        <div className='w-full lg:w-[25%] min-h-[200px] bg-[white] shadow-lg hidden lg:flex flex-col p-[20px]'>
        <h1 className='text-[20px] text-gray-600 font-semibold'>Suggested Users</h1>
         {suggestedUser.length>0 && <div className='flex flex-col gap-[10px]'>
{suggestedUser.map((su)=>(
  <div className='flex items-center gap-[10px] mt-[10px] cursor-pointer hover:bg-gray-200 rounded-lg p-[5px]' onClick={()=>handleGetProfile(su.userName)}>
  <div className='w-[40px] h-[40px] rounded-full overflow-hidden'>
            <img src={su.profileImage || dp} alt="" className='w-full h-full'/>
        </div>
        <div>
        <div className='text-[19px] font-semibold text-gray-700'>{`${su.firstName} ${su.lastName}`}</div>
        <div className='text-[12px] font-semibold text-gray-700'>{su.headline}</div>
        </div>
  </div>
))}
          </div>}
          {suggestedUser.length==0 && <div>
          No Suggested Users
          </div>}
      </div>
    </div>
  );
}
