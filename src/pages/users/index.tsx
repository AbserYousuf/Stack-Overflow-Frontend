import { Avatar } from "@/components/ui/avatar";

import { Input } from "@/components/ui/input";

import Main from "@/Layouts/Main"

import axiosInstance from "@/lib/axiosinstance";

import { Calendar, Search } from "lucide-react";

import Link from "next/link";

import { AvatarFallback } from "radix-ui/avatar";
import { useEffect, useState } from "react";

const users = [
    {
        id: 1,
        Name: "John Alexson",
        username: "Jhon Fire",
        joinDate: "29-05-2021"
    },
    {
        id: 2,
        Name: "Tom Thompson",
        username: "Tom Shadow",
        joinDate: "23-01-2014"
    },
    {
        id: 3,
        Name: "Juliet Makroav",
        username: "Wisdom",
        joinDate: "12-03-2019"
    },
    {
        id: 4,
        Name: "Christine Wallson",
        username: "Christ@1",
        joinDate: "10-03-2007"
    },
]

const index = () => {
    const [users,setusers]=useState([])
    const [loading,setloading]=useState(true)
    
    useEffect(() => {
        setloading(true)
      const fetchuser=async()=>{
        try {
            const res=await axiosInstance.get('/user/getalluser')
            setusers(res.data.data)
          
        } catch (error) {
            console.log(error)
        }
        finally{
            setloading(false)
        }
      }
      fetchuser()
    
    }, [])
    if(loading){
        return(
            <div className="flex justify-center items-center min-h-[200px]">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        )
    }
    if(!users || users.length===0){
        return(
            <div>No Users Found</div>
        )
    }
    return (
        <Main>
            <div className="max-w-6xl">
                <h1 className="text-xl lg:text-2xl font-semibold mb-6">
                    Users
                </h1>

                <div className="mb-6">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />

                        <Input
                            placeholder="Filter by user"
                            className="pl-10"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {users.map((user: any) => (
                        <Link href={`/users/${user._id}`} key={user._id}>
                            <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                                <div className="flex items-center">
                        <Avatar className="w-12 h-12 mr-3 flex items-center justify-center">
                                        <AvatarFallback className="text-lg text-blue-500">
                                            {user?.name.split(" ").map((n: any) => n[0]).join("")}
                                        </AvatarFallback>
                                    </Avatar>

                                    <div className="min-w-0 flex-1">
                                        <h3 className="font-semibold text-blue-600 hover:text-blue-800 truncate">
                                            {user?.name}
                                        </h3>

                                        <p className="text-sm text-gray-600 truncate">
                                            @{user?.username}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center text-sm text-gray-600 mt-3">
                                    <Calendar className="w-4 h-4 mr-1" />

                                    <span>
                                        joined {new Date(user.joinDate).getFullYear()}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </Main>
    )
}

export default index;