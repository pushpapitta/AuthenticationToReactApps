import React, { useState } from 'react';

const AuthContext = React.createContext({
    token: '',
    isLoggedIn: false,
    //functions which allow us to change above state
    login: (token) => { },
    logout: () => { }
});

const calculateRemainingTime = (expirationTime) => {

    const currentTime = newDate().getTime();
    const adjExpirationTime = newDate(expirationTime).getTime();

    const remainingDuration = adjExpirationTime - currentTime;
    return remainingDuration;
};
//wrapper component,and also state management to the aboove authcontext is done here
export const AuthContextProvider = (props) => {
    //persistence of login status  using token stored in localstorage
    const initialToken = localStorage.getItem('token');
    //state for token
    const [token, setToken] = useState(initialToken);

    //no token,user is not loggen in, if token- user is logged in
    const userIsLoggedIn = !!token;//if token is string-returns true,not string-returns false(js trick)

    //below functions are to change token state

    const logoutHandler = () => {
        setToken(null);
        localStorage.removeItem('token');
    };
    const loginHandler = (token, expirationTime) => {
        setToken(token);
        //storing a string token in 'token' key in local storage
        localStorage.setItem('token', token);

        const remainingTime = calculateRemainingTime(expirationTime);
        //automatically logouts the user after timeout
        setTimeout(logoutHandler, remainingTime);
    };
    //constructing our contextValue object
    const contextValue = {
        token: token,
        isLoggedIn: userIsLoggedIn,
        login: loginHandler,
        logout: logoutHandler
    };
    return <AuthContext.Provider value={contextValue}>{props.children}</AuthContext.Provider>;
};

export default AuthContext;