import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router';

export const AuthContext = React.createContext();
export function useAuth() {
    return useContext(AuthContext)
}
function AuthProvider({ children }) {
    const history = useHistory();
    const [user, userSet] = useState("");
    const [loading, setLoading] = useState(false);

    async function signUp(name,email,password,confirmPassword) {
        await axios.post("https://iamhungry.onrender.com/user/signup", {
            name:name,
            email: email,
            password: password,
            confirmPassword:confirmPassword
        });
        userSet(user);
    }
    async function login(email, password) {
        try {
            const data = await axios.post("https://iamhungry.onrender.com/user/login", {
                email: email,
                password: password
            });
            const users = await axios.get("https://iamhungry.onrender.com/user/getAllUser");
            let newData = users?.data.data.filter(item => item.email === email);
            userSet(newData[0]);
            localStorage.setItem("user", JSON.stringify(newData[0]));
            return newData;
        }
        catch (err) {
            console.log(err);
        }
    }
    async function logout() {
        localStorage.removeItem("user")
        const data = await axios.get("https://iamhungry.onrender.com/user/logout");
        console.log(data);
        userSet(null);
    }

    useEffect(async () => {
        let data = localStorage.getItem("user");
        console.log(data,898787);
        if (data) {
            userSet(JSON.parse(data));
            console.log(user);
            history.push("/");
        } else {
            userSet(null);
        }
    }, [])

    const value = {
        user,
        login,
        signUp,
        logout
    }

    return (
        < AuthContext.Provider value={value} >
            {!loading && children}
        </AuthContext.Provider >
    )
}

export default AuthProvider
