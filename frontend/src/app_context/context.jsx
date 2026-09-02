import { useEffect, useState } from "react";
import { createContext } from "react";
import { getHeroPageInstitutes, getUserState } from "../apicalls/public_apicalls";
const AppContext = createContext(null);

export const ContextProvider = ({ children }) => {
    let [userState, setUserState] = useState({ userState: null, setUserState: null });
    let [heroPageInstitutes, setHeroPageInstitutes] = useState([]);
    useEffect(() => {
        getUserState(setUserState);
        getHeroPageInstitutes(setHeroPageInstitutes);
    }, [])
    const data = {
        userState,
        setUserState,
        heroPageInstitutes
    }

    return (
        <AppContext.Provider value={data}>
            {children}
        </AppContext.Provider>
    )

}

export default AppContext