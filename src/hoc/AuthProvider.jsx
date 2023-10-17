import React, {createContext} from 'react'
import Store from "../store/store";

export const store = new Store();

export const AuthContext = createContext(store,);

export const AuthProvider = ({children}) => {
    return <AuthContext.Provider value={{store}}>
        {children}
    </AuthContext.Provider>
}