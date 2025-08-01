import React, { useContext, useRef, useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { userDataContext } from "../context/UserContext";
import { MdOutlineCameraAlt } from "react-icons/md";
import dp from "../assets/empty.jpeg";
import { FiPlus } from "react-icons/fi";
import { authDataContext } from '../context/AuthContext';
import axios from "axios";

export default function EditProfile() {
  let { edit, setEdit, userData, setUserData } = useContext(userDataContext);
  let {serverUrl}=useContext(authDataContext)
  let [firstName,setFirstName] = useState(userData.firstName || "")
  let [lastName,setLastName] = useState(userData.lastName || "")
  let [userName,setUserName] = useState(userData.userName || "")
  let [headline,setHeadline] = useState(userData.headline || "")
  let [location,setLocation] = useState(userData.location || "")
  let [gender,setGender] = useState(userData.gender || "")

   let [skills,setSkills] = useState(userData.skills || [])    // already database store skills
   let [newSkills,setNewSkills] = useState("")  // create a add skill 
 
   let [education,setEducation] = useState(userData.education || [])
   let [newEducation,setNewEducation] = useState({
       college:"",
       degree:"",
       fieldOfStudy:""
   })
      
   let [experience,setExperience] = useState(userData.experience || [])
   let [newExperience,setNewExperience] = useState({
    title:"",
    company:"",
    description:""
   })

    let [frontendProfileImage,setFrontendProfileImage]=useState(userData.profileImage || dp)
let [backendProfileImage,setBackendProfileImage]=useState(null)
let [frontendCoverImage,setFrontendCoverImage]=useState(userData.coverImage || null)
let [backendCoverImage,setBackendCoverImage]=useState(null)
 
        //  saving profile data

        let [saving,setSaving] = useState(false)


        //  image handling

        const profileImage=useRef()
        const coverImage=useRef()




        // create a add skills functions

          function addSkill(e){
            e.preventDefault()
            if(newSkills && !skills.includes(newSkills)) {
              setSkills([...skills,newSkills])
            }
            setNewSkills("")
          }

        // create  skill remove functions

             function removeSkill(skill){

              if(skill.includes(skill)){
                setSkills(skills.filter((s)=>s!==skill))
              }
             }

            //  create a addEducation functions

              function addEducation(e){
            e.preventDefault()
            if(newEducation.college && newEducation.degree && newEducation.fieldOfStudy) {
              setEducation([...education,newEducation])
            }
            setNewEducation({
                            
                    college:"",
                    degree:"",
                    fieldOfStudy:""
            })
          }

          // remove education function

          function removeEducation(edu){
            if(education.includes(edu)){
              setEducation(education.filter((e)=>e!==edu))
            }
          }

            //  add Experience functions

              function addExperience(e){
            e.preventDefault()
            if(newExperience.title && newExperience.company && newExperience.description) {
              setExperience([...experience,newExperience])
            }
            setNewExperience({
                            
                    title:"",
                    company:"",
                    description:""
            })
          }
           
          // remove Experience

            function removeExperience(exp){
            if(experience.includes(exp)){
              setExperience(experience.filter((e)=>e!==exp))
            }
          }

          // handilng profile image

             function handleProfileImage(e){
              let file=e.target.files[0]
              setBackendProfileImage(file)
              setFrontendProfileImage(URL.createObjectURL(file))
              }
          
              //  cover image

               function handleCoverImage(e){
              let file=e.target.files[0]
              setBackendCoverImage(file)
              setFrontendCoverImage(URL.createObjectURL(file))
            }

            // handling save profile and update

  const handleSaveProfile=async ()=>{
     setSaving(true)
  try {
    let formdata=new FormData()
    formdata.append("firstName",firstName)
    formdata.append("lastName",lastName)
    formdata.append("userName",userName)
    formdata.append("headline",headline)
    formdata.append("location",location)
    formdata.append("skills",JSON.stringify(skills))
    formdata.append("education",JSON.stringify(education))
    formdata.append("experience",JSON.stringify(experience))

    if(backendProfileImage){
      formdata.append("profileImage",backendProfileImage)
    }
    if(backendCoverImage){
      formdata.append("coverImage",backendCoverImage)
    }

    let result = await axios.put(serverUrl+"/api/user/updateprofile",formdata,{withCredentials:true})
      setUserData(result.data)   
      setSaving(false)
      setEdit(false)

  } catch (error) {
    console.log(error);
   setSaving(false)
}

}

  return (
    <div className="w-full h-[100vh] fixed top-0 z-[100] flex justify-center items-center left-0  ">
        
        {/* image setup  */}

        <input type="file" name="" id="" accept="image/*" hidden ref={profileImage} onChange={handleProfileImage} />
        <input type="file" name="" id="" accept="image/*" hidden ref={coverImage} onChange={handleCoverImage} />

      <div className="w-full h-full bg-black opacity-[0.5] absolute top-0 left-0 "></div>

      <div className="w-[90%] max-w-[500px] h-[600px] bg-[#EFEEEA] relative z-[200] overflow-auto shadow-lg rounded-lg p-[10px] ">
        <div
          className="absolute top-[20px] right-[20px] cursor-pointer  "
          onClick={() => setEdit(false)}
        >
          <RxCross1 className="w-[25px] h-[25px] text-gray-800 font-bold cursor-pointer " />
        </div>

        {/* cover image upload */}

        <div className="w-full h-[150px] bg-gray-500 rounded-lg mt-[40px] overflow-hidden " onClick={()=>coverImage.current.click()} >
          <img src={frontendCoverImage } alt="" className="w-full" />
          <MdOutlineCameraAlt className="absolute right-[20px] top-[60px] w-[25px]  h-[25px] text-white cursor-pointer " />
        </div>
        <div className="w-[80px] h-[80px] rounded-full overflow-hidden absolute top-[150px] ml-[20px] ">
          <img src={frontendProfileImage} alt="" className="w-full h-full"  onClick={()=>profileImage.current.click()}/>
        </div>
        <div
          className="w-[20px] h-[20px] bg-[#17c1ff] absolute top-[200px] left-[90px] rounded-full flex justify-center 
               items-center cursor-pointer "
        >
          <FiPlus className="text-white" />
        </div>

        {/* input users edit data from */}
           
           <div className="w-full flex flex-col items-center justify-center gap-[20px] mt-[50px] ">
            <input type="text" name="" id="" placeholder="firstName" className="w-full h-[50px] outline-offset-1 border-gray-600
             px-[10px] py-[5px] text-[18px] border-2 rounded-lg " value={firstName} onChange={(e)=>setFirstName(e.target.value)} />
             <input type="text" name="" id="" placeholder="lastName" className="w-full h-[50px] outline-offset-1 border-gray-600
             px-[10px] py-[5px] text-[18px] border-2 rounded-lg " value={lastName} onChange={(e)=>setLastName(e.target.value)}/>
             <input type="text" name="" id="" placeholder="userName" className="w-full h-[50px] outline-offset-1 border-gray-600
             px-[10px] py-[5px] text-[18px] border-2 rounded-lg " value={userName} onChange={(e)=>setUserName(e.target.value)}/>
             <input type="text" name="" id="" placeholder="headline" className="w-full h-[50px] outline-offset-1 border-gray-600
             px-[10px] py-[5px] text-[18px] border-2 rounded-lg " value={headline} onChange={(e)=>setHeadline(e.target.value)}/>
             <input type="text" name="" id="" placeholder="location" className="w-full h-[50px] outline-offset-1 border-gray-600
             px-[10px] py-[5px] text-[18px] border-2 rounded-lg " value={location} onChange={(e)=>setLocation(e.target.value)}/>
             <input type="text" name="" id="" placeholder="gender (male/female/other)" className="w-full h-[50px] outline-offset-1 border-gray-600
             px-[10px] py-[5px] text-[18px] border-2 rounded-lg " value={gender} onChange={(e)=>setGender(e.target.value)}/>
            
               {/* add skills from user */}

                 <div className="w-full p-[10px] border-2 border-gray-600 flex flex-col gap-[10px]  rounded-lg">
                  <h1 className="text-[19px] font-semibold ">Skills</h1>
                  {skills && <div className="flex flex-col gap-[10px]  ">
                    {skills.map((skill,index)=>( 
                    <div key={index} className="w-full h-[40px] border-[1px] border-gray-600 bg-yellow-300 rounded-lg p-[10px] text-black 
                       font-semibold flex justify-between items-center "> <span>{skill} </span> <RxCross1 className="w-[20px] h-[20px] text-gray-800 font-bold cursor-pointer "
                          onClick={()=>removeSkill(skill)} /> </div>))}
                  </div> }

                  <div className="flex flex-col gap-[10px] items-start "  >
                    <input type="text" name="" id="" placeholder="add new skill" value={newSkills} onChange={(e)=>
                      setNewSkills(e.target.value)} className="w-full h-[50px] outline-offset-1 border-gray-600 px-[10px] 
                       py-[5px] text-[16px] border-2  rounded-lg"/>

                       <button className="w-[100%] h-[40px] rounded-full border-2 border-[#2dc0ff]  bg-[#2A4759] hover:bg-[#2A4759]/85 text-white " onClick={addSkill}  >Add Skills</button>
                    
                  </div>
                 </div>
                       
                       {/* add a Education */}

                  <div className="w-full p-[10px] border-2 border-gray-600 flex flex-col gap-[10px]  rounded-lg">
                  <h1 className="text-[19px] font-semibold ">Education</h1>
                  {education && <div className="flex flex-col gap-[10px]  ">
                    {education.map((edu,index)=>( 
                    <div key={index} className="w-full  border-[1px] border-gray-600 bg-yellow-300 rounded-lg p-[10px] text-black 
                       font-semibold flex justify-between items-center ">

                         <div>
                           <div>College: {edu.college} </div>
                           <div>Degree: {edu.degree} </div>
                           <div>Field Of Study: {edu.fieldOfStudy} </div>
                       </div>
                       
                        <RxCross1 className="w-[20px] h-[20px] text-gray-800 font-bold cursor-pointer "
                          onClick={()=>removeEducation(edu)} /> </div>))}
                  </div> }

                  <div className="flex flex-col gap-[10px] items-start "  >
                    <input type="text" name="" id="" placeholder="college" required value={newEducation.college} onChange={(e)=>
                      setNewEducation({...newEducation,college:e.target.value})} className="w-full h-[50px] outline-offset-1 border-gray-600 px-[10px] 
                       py-[5px] text-[16px] border-2  rounded-lg"/>

                       <input type="text" name="" id="" placeholder="degreee" required value={newEducation.degree} onChange={(e)=>
                      setNewEducation({...newEducation,degree:e.target.value})} className="w-full h-[50px] outline-offset-1 border-gray-600 px-[10px] 
                       py-[5px] text-[16px] border-2  rounded-lg"/>

                       <input type="text" name="" id="" placeholder="field of study" required value={newEducation.fieldOfStudy} onChange={(e)=>
                      setNewEducation({...newEducation,fieldOfStudy:e.target.value})} className="w-full h-[50px] outline-offset-1 border-gray-600 px-[10px] 
                       py-[5px] text-[16px] border-2  rounded-lg"/>

                       <button className="w-[100%] h-[40px] rounded-full border-2 border-[#2dc0ff] text-white  bg-[#2A4759] hover:bg-[#2A4759]/85 " onClick={addEducation}  >Add Educations</button>
                    
                  </div>
                  
                 </div>

                   {/* add a experience */}

                 <div className="w-full p-[10px] border-2 border-gray-600 flex flex-col gap-[10px]  rounded-lg">
                  <h1 className="text-[19px] font-semibold ">Experience</h1>
                  {experience && <div className="flex flex-col gap-[10px]  ">
                    {experience.map((exp,index)=>( 
                    <div key={index} className="w-full  border-[1px] border-gray-600 bg-yellow-300 rounded-lg p-[10px] text-black 
                       font-semibold flex justify-between items-center ">

                         <div>
                           <div>Title: {exp.title} </div>
                           <div> Company: {exp.company} </div>
                           <div>Description: {exp.description} </div>
                       </div>
                       
                        <RxCross1 className="w-[20px] h-[20px] text-gray-800 font-bold cursor-pointer "
                         onClick={()=>removeExperience(exp)}  /> </div>))}
                  </div> }

                  <div className="flex flex-col gap-[10px] items-start "  >
                    <input type="text" name="" id="" placeholder="Title" value={newExperience.title} onChange={(e)=>
                      setNewExperience({...newExperience,title:e.target.value})} className="w-full h-[50px] outline-offset-1 border-gray-600 px-[10px] 
                       py-[5px] text-[16px] border-2  rounded-lg"/>

                       <input type="text" name="" id="" placeholder="Company" value={newExperience.company} onChange={(e)=>
                      setNewExperience({...newExperience,company:e.target.value})} className="w-full h-[50px] outline-offset-1 border-gray-600 px-[10px] 
                       py-[5px] text-[16px] border-2  rounded-lg"/>

                       <input type="text" name="" id="" placeholder="Description" value={newExperience.description} onChange={(e)=>
                      setNewExperience({...newExperience,description:e.target.value})} className="w-full h-[50px] outline-offset-1 border-gray-600 px-[10px] 
                       py-[5px] text-[16px] border-2  rounded-lg"/>

                       <button className="w-[100%] h-[40px] rounded-full border-2 border-[#2dc0ff] text-white bg-[#2A4759] hover:bg-[#2A4759]/85" onClick={addExperience}  >Add Experiences</button>
                    
                  </div>
                  
                 </div>

                 {/* save  update profile */}
                 
                 <button className="w-[100%] h-[50px] rounded-full bg-[#24b2ff] mt-[40px] text-white my-[10px]" 
                  disable={saving} onClick={()=>handleSaveProfile()} > {saving?"saving...":"Save Profile"} </button>

           </div>
           

      </div>
    </div>
  );
}
