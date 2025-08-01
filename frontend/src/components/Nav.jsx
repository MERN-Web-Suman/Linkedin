import React, { useContext, useEffect, useState } from "react";
import logo2 from "../assets/pngwing.com.png";
import { IoSearch } from "react-icons/io5";
import { IoMdHome } from "react-icons/io";
import { FaUserFriends } from "react-icons/fa";
import { MdOutlineNotificationsActive } from "react-icons/md";
import dp from "../assets/empty.jpeg";
import { userDataContext } from "../context/UserContext.jsx";
import { authDataContext } from "../context/AuthContext.jsx";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Nav() {
  let [activeSearch, setActiveSearch] = useState(false);
  let { userData, setUserData,handleGetProfile } = useContext(userDataContext);
  let [showPopup, setShowPopup] = useState(false);
  let navigate = useNavigate();
  let { serverUrl } = useContext(authDataContext);
  let [searchInput,setSearchInput] = useState("")
  let [searchData,setSearchData] = useState([])

  const handleSignOut = async () => {
    try {
      let result = await axios.get(serverUrl + "/api/auth/logout", {
        withCredentials: true,
      });
      setUserData(null);
      navigate("/login");
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

   const handleSearch = async ()=>{
        try {
           let result = await axios.get(`${serverUrl}/api/user/search?query=${searchInput}`,
            {withCredentials:true}
            )
          
           setSearchData(result.data)
        } catch (error) {
          setSearchData([])
           console.log(error)
   }
  }

   useEffect(()=>{
   
      handleSearch()
    
   },[searchInput])


  return (
    //  left part logo and search

    <div className="w-full h-[80px] bg-gradient-to-r from-indigo-500 via-gray-500 to-blue-500 fixed top-0 shadow-lg flex justify-between  md:justify-around items-center px-[10px] left-0  z-[80] ">
      <div className="flex justify-center items-center gap-[10px] relative ">
        <div
          onClick={() => {
            setActiveSearch(false);
            navigate("/")
          }}
        >
          <img
            src={logo2}
            alt=""
            className="w-[90px] bg-white rounded-xl shadow-xl "
          />
        </div>

        {!activeSearch && (
          <div>
            <IoSearch
              className="w-[23px] h-[23px] text-gray-600 lg:hidden "
              onClick={() => setActiveSearch(true)}
            />
          </div>
        )}

         {/* Search result show */}
           {searchData.length>0 &&  

         <div className="absolute top-[90px] left-[0px] lg:left-[20px] shadow-lg w-[100%] md:left-[100px] flex flex-col gap-[20px] lg:w-[700px] min-h-[100px]  bg-[white] p-[20px] " >
              {searchData.map((sea)=>(
                <div className="flex gap-[20px] items-center  border-b-2 border-b-gray-300 p-[10px] hover:bg-gray-200 hover:rounded-lg cursor-pointer   " onClick={()=>handleGetProfile(sea.userName)} >
                  <div className="w-[70px] h-[70px] rounded-full overflow-hidden " >
                    <img src={sea.profileImage || dp } alt=""  className="w-full h-full " />
                  </div>
                  <div className="text-[19px] font-semibold text-gray-700 " >
                    {`${sea.firstName} ${sea.lastName}`}
                     <div className="text-[12px] font-semibold text-gray-700  " > {sea.headline} </div>
                  </div>
                 
                </div>
              ))}
         </div>
          }



        <form
          className={` w-[190px] lg:w-[350px] h-[40px] bg-[#f0efe7] lg:flex items-center gap-[10px] px-[10px] py-[5px] rounded-md ${
            !activeSearch ? "hidden" : "flex"
          } `}
        >
          <div>
            <IoSearch className="w-[23px] h-[23px] text-gray-600  " />
          </div>
          <input
            type="text"
            name=""
            id=""
            className="w-[80%] h-full bg-transparent outline-none border-0  "
            placeholder="search users..."
           onChange={(e)=>setSearchInput(e.target.value)} value={searchInput} />
        </form>
      </div>

      {/* right part have a notification , network and user */}

      <div className="flex justify-center items-center gap-[20px] relative  ">
        {/* profile of user */}

        {showPopup && (
          <div
            className="w-[300px] min-h-[300px] bg-[#F9F3EF] shadow-lg absolute top-[75px] rounded-lg flex 
               flex-col items-center p-[20px] gap-[20px] "
          >
            <div className="w-[70px] h-[70px] rounded-full overflow-hidden ">
              <img src={userData.profileImage || dp } alt="" className="w-full h-full" />
            </div>
            <div className="text-[19px] font-semibold text-red-600 ">
              {`${userData.firstName} ${userData.lastName}`}
            </div>
            <button className="w-[100%] h-[40px] rounded-full border-2 border-[#2dc0ff] text-blue-600  " onClick={()=>handleGetProfile(userData.userName)} >
              View Profile
            </button>
            <div className="w-full h-[1px] bg-gray-800 "></div>

            <div className="flex w-full items-center justify-start text-gray-600 gap-[10px] cursor-pointer "  onClick={()=>navigate("/network")} >
              <FaUserFriends className="w-[23px] h-[23px] text-gray-600 " />
              <div>My Networks</div>
            </div>
            <button
              className="w-[100%] h-[40px] rounded-full border-2 border-[#ec4545] text-red-600 "
              onClick={handleSignOut}
            >
              Sign Out
            </button>
          </div>
        )}

        <div className="lg:flex flex-col items-center justify-center text-gray-600  hidden cursor-pointer "  onClick={()=>navigate("/")}  >
          <IoMdHome className="w-[23px] h-[23px] text-white " />
          <div className="text-white cursor-pointer ">Home</div>
        </div>
        <div className="md:flex flex-col items-center justify-center text-gray-600 hidden cursor-pointer " onClick={()=>navigate("/network")} >
          <FaUserFriends className="w-[23px] h-[23px] text-white " />
          <div className="text-white">My Networks</div>
        </div>
        <div className="flex flex-col items-center justify-center text-gray-600  cursor-pointer " onClick={()=>navigate("/notification")} >
          <MdOutlineNotificationsActive className="w-[23px] h-[23px] text-red-600 " />
          <div className="hidden md:block text-white "  >Notifications</div>
        </div>
        <div
          className="w-[50px] h-[50px] rounded-full overflow-hidden cursor-pointer "
          onClick={() => setShowPopup((prev) => !prev)}
        >
          <img src={ userData.profileImage ||dp} alt="" />
        </div>
      </div>
    </div>
  );
   }

