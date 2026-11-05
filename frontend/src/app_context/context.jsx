import { useEffect, useState } from "react";
import { createContext } from "react";
import { getHeroPageInstitutes, getUserState } from "../apicalls/public_apicalls";
const AppContext = createContext(null);

export const ContextProvider = ({ children }) => {
    // `userState` is null while nobody is signed in and holds the user object
    // (role, name, email, dashboardUrl) once the session is active.
    let [userState, setUserState] = useState(null);
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