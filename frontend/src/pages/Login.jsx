
import React, { useContext, useState } from 'react'
import { authDataContext } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { userDataContext } from '../context/UserContext'
import logo2 from "../assets/pngwing.com.png"

export default function Login() {
  let [show,setShow] = useState(false)
  let {serverUrl}=useContext(authDataContext)
  let navigate = useNavigate()
  let[email,setEmail]=useState("")
  let[password,setPassword]=useState("")
  let [loading,setLoading]=useState(false)
  let [err,setErr] = useState("")
  let {userData,setUserData}=useContext(userDataContext)
 
  
    const handleSignIn = async (e)=>{
      e.preventDefault()
      setLoading(true)
      try {
          let result = await axios.post(serverUrl+"/api/auth/login", {
            email,
            password
          },{withCredentials:true})
          console.log(result);
          setUserData(result.data)
          navigate("/")
          setErr("")
          setLoading(false)
          setEmail("")
          setPassword("")
          

      } catch (error) {
        
        setErr(error.response.data.message)
         setLoading(false)
      }
    }
   

  return (
    
    <div className='w-full h-screen bg-[#EAEFEF] flex flex-col items-center justify-start gap-[10px]  ' >
          <div className='p-[30px] lg:p-[35px] w-full flex items-center '>
            {/* <h1 className='text-2xl bg-[#FFB22C] h-[50px] w-[10%] rounded-full px-[5px] text-[white] '> JOB Hunt2.X</h1> */}
             <img src={logo2} alt="" className='w-[90px] shadow-xl ' />
          </div>
          <form className='w-[90%] max-w-[400px] h-[550px] md:shadow-xl flex flex-col justify-center gap-[10px]
           p-[15px] bg-[#E5E0D8] rounded-lg ' onSubmit={handleSignIn}  >
              <h1 className='text-gray-800 text-[30px] font-semibold mb-[30px] ' >Sign In</h1>
         
              <input type="email" placeholder='email' required className='w-[100%] h-[50px] border-2 border-gray-600
              text-gray-800 text-[18px] px-[20px] py-[10px] rounded-md ' value={email} onChange={(e)=>setEmail(e.target.value)}/>
              <div className='w-[100%] h-[50px] relative border-2 border-gray-600 text-gray-800 text-[18px] rounded-md ' >
                  <input type={show?"text" : "password"} placeholder='password' required className='w-full h-full border-none border-gray-600
              text-gray-800 text-[18px] px-[20px] py-[10px] rounded-md 'value={password} onChange={(e)=>setPassword(e.target.value)} />
              <span className='absolute right-[20px] top-[10px] text-[#C5172E] font-semibold cursor-pointer' onClick={()=>setShow(prev=>!prev)} >{show?"hidden":"show"} </span>
              </div>
           
              {err && <p className='text-center text-red-500' > *{err} </p> }
              <button className='w-[100%] h-[50px] rounded-full bg-[#FE7743] mt-[20px] text-white hover:bg-[#FE7743]/85  ' disabled={loading} > {loading?"Loading...":"Sign Up "} </button>
              <p className='text-center cursor-pointer' >want to create a new account ? <span className='text-[#C5172E]  ' onClick={()=>navigate("/signup")} > Sign Up</span></p>
          </form>
    </div>
  )
}
