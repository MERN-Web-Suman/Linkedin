
import React, { createContext } from 'react'
export const authDataContext=createContext()

export default function AuthContext({children}) {
    const serverUrl="https://linkedin-eacd.onrender.com"

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
