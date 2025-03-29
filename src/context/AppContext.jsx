import React, { createContext, useState } from 'react'

export const AppContext = createContext()

export const AppContextProvider = (props) => {
    const [isGhost, setisGhost] = useState(true)

    const value = {
        isGhost, setisGhost
    }

    return(
        <AppContext.Provider value = {value}>
            {props.children}
        </AppContext.Provider>
    )
}