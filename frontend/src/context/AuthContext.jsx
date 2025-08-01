
import React, { createContext } from 'react'
export const authDataContext=createContext()

export default function AuthContext({children}) {
    const serverUrl="https://linkedin-backend-u7fu.onrender.com"

    let value={
        serverUrl
    }

  return (
    <div>
        <authDataContext.Provider value={value} >
      {children}
       </authDataContext.Provider>
    </div>
  )
}
