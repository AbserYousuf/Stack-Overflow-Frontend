
import { createContext, useContext, useState } from "react";
import axiosInstance from "./axiosinstance";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
const authContext = createContext();
export const AuthProvider = ({ children }) => {
    const router = useRouter()
    const [user, setUser] = useState(() => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('user')
            return stored ? JSON.parse(stored) : null
        }
        return null;
    })
    const [loading, setLoading] = useState(false)
    const [error, seterror] = useState(null)
    const Signup = async (name, email, password) => {
        console.log(name, email, typeof (password), password)
        setLoading(true)
        seterror(null)
        try {
            const response = await axiosInstance.post('/user/signup', {
                name,
                email,
                password
            })
            const { data, token } = response.data
            localStorage.setItem("user", JSON.stringify({ ...data, token }))
            setUser(data)
            toast.success("Signup SuccessFull")
            setLoading(false)
        } catch (error) {
            const message = error.response?.data?.message || "Signup Failed "
            seterror(message)
            toast.error(message)
        }
    }
    const Login = async (email, password) => {
        setLoading(true)
        seterror(null)
        try {
            const response = await axiosInstance.post('/user/login', { email, password })
            const { data, token } = response.data
            localStorage.setItem("user", JSON.stringify({ ...data, token }))
            setUser(data)
            toast.success("Login SuccessFull")
            setLoading(false)
        } catch (error) {
            const message = error.response?.data?.message || "Login Failed "
            seterror(message)
            toast.error(message)
        }
    }
    const Logout = () => {
        setUser(null)
        localStorage.removeItem('user')
        toast.info('Logged Out')
        router.push('/auth')

    }
    return (
        <authContext.Provider value={{ user, Signup, Login, Logout, loading, error }} >
            {children}
        </authContext.Provider>
    )
}
export const useAuth = () => useContext(authContext)