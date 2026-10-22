
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Main from "@/Layouts/Main";
import axiosInstance from "@/lib/axiosinstance";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const questions = [
  {
    id: "q1",
    votes: 24,
    answers: 3,
    title: "How to update a React state array without mutating it?",
    content:
      "I'm trying to add a new item to an array stored in React state. I know directly modifying the array is not recommended, but I'm confused about the correct approach. What is the best way to update the state while keeping it immutable?",
    tags: ["react", "javascript", "state"],
    author: "Alex Morgan",
    authorId: "user101",
    authorRep: 1250,
    timeAgo: "2 hours ago",
  },
  {
    id: "q2",
    votes: 18,
    answers: 2,
    title: "Why does my Express middleware not execute?",
    content:
      "I'm building a REST API using Node.js and Express. I created custom middleware to log incoming requests, but it doesn't seem to execute for some routes. I've checked my route definitions, but I still can't figure out what is wrong. What should I check?",
    tags: ["node.js", "express", "middleware"],
    author: "Sarah Wilson",
    authorId: "user102",
    authorRep: 840,
    timeAgo: "4 hours ago",
  },
  {
    id: "q3",
    votes: 42,
    answers: 5,
    title: "How to find a document by ID using Mongoose?",
    content:
      "I'm working on a MERN stack application and need to retrieve a user document from MongoDB using its ID. I've seen methods like findById() and findOne(), but I'm not sure which one is better for this use case. Can someone explain the difference?",
    tags: ["mongodb", "mongoose", "node.js"],
    author: "Daniel Carter",
    authorId: "user103",
    authorRep: 2340,
    timeAgo: "6 hours ago",
  },
  {
    id: "q4",
    votes: 12,
    answers: 1,
    title: "How to center a div horizontally and vertically using CSS?",
    content:
      "I'm designing a responsive login page and want to place a form exactly in the center of the screen. I've tried using margin auto, but it only centers the element horizontally. What is the simplest modern CSS approach to center it in both directions?",
    tags: ["css", "flexbox", "html"],
    author: "Emma Johnson",
    authorId: "user104",
    authorRep: 560,
    timeAgo: "8 hours ago",
  },
  {
    id: "q5",
    votes: 31,
    answers: 4,
    title: "What is the difference between interface and type in TypeScript?",
    content:
      "I'm learning TypeScript for a Next.js project and noticed that both interface and type can describe the structure of an object. When should I use an interface instead of a type alias? Are there any important differences I should know about?",
    tags: ["typescript", "javascript", "next.js"],
    author: "Ryan Mitchell",
    authorId: "user105",
    authorRep: 1780,
    timeAgo: "12 hours ago",
  },
  {
    id: "q6",
    votes: 27,
    answers: 3,
    title: "How to handle expired JWT access tokens in a React application?",
    content:
      "I'm implementing authentication in a React application using JWT access tokens stored in secure cookies. When the access token expires, API requests start failing. What is the recommended way to refresh the token and retry failed requests without forcing the user to log in again?",
    tags: ["react", "jwt", "authentication"],
    author: "Michael Scott",
    authorId: "user106",
    authorRep: 3100,
    timeAgo: "1 day ago",
  },
];
export default function Home() {
  const [question,setquestion]=useState<any>(null)
  const [loading,setloading]=useState(true)
  const Router=useRouter()
    useEffect(() => {
        setloading(true)
      const fetchQuestion=async()=>{
        try {
            const res=await axiosInstance.get('/question/getallquestion')
            setquestion(res.data.data)
          
        } catch (error) {
            console.log(error)
        }
        finally{
            setloading(false)
        }
      }
      fetchQuestion()
    
    }, [])
    if(loading){
        return(
            <div className="flex justify-center items-center min-h-[200px]">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        )
    }
    if(!question ||  question.length===0){
        return(
          <Main>
            <div className="text-center text-gray-500 mt-4">No Questions Found</div>
          </Main>
        )
    }
  
  
  return (
    <>
<Main >
<main className="min-w-0 p-4 lg:p-6">
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
    <h1 className="text-xl lg:text-2xl font-semibold text-black" >Top Questions</h1>

    <button
      onClick={() => Router.push("/ask")}
      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium whitespace-nowrap"
    >
      Ask Question
    </button>
  </div>

  <div className="w-full">
    <div className="flex flex-col sm:flex-row items-start sm:items-center mb-4 text-sm gap-2 sm:gap-4">
      <span className="text-gray-600">24,216,732 questions</span>

      <div className="flex flex-wrap gap-1 sm:gap-2">
        <button className="px-2 sm:px-3 py-1 bg-gray-200 text-gray-700 rounded text-xs sm:text-sm">
          Newest
        </button>

        <button className="px-2 sm:px-3 py-1 text-gray-600 hover:bg-gray-100 rounded text-xs sm:text-sm">
          Active
        </button>

        <button className="px-2 sm:px-3 py-1 text-gray-600 hover:bg-gray-100 rounded flex items-center text-xs sm:text-sm">
          Bountied
          <Badge variant="secondary" className="ml-1 text-xs">
            25
          </Badge>
        </button>

        <button className="px-2 sm:px-3 py-1 text-gray-600 hover:bg-gray-100 rounded text-xs sm:text-sm">
          Unanswered
        </button>

        <button className="px-2 sm:px-3 py-1 text-gray-600 hover:bg-gray-100 rounded text-xs sm:text-sm">
          More ▼
        </button>

        <button className="px-2 sm:px-3 py-1 border border-gray-300 text-gray-600 hover:bg-gray-50 rounded ml-auto text-xs sm:text-sm">
          🔍 Filter
        </button>
      </div>
    </div>
    <div className="divide-y divide-gray-200 border-t border-gray-200">
  {question.map((question:any) => (
    <article key={question?._id} className="flex gap-4 py-5 text-gray-900">
      {/* Left: stats */}
      <div className="flex w-24 shrink-0 flex-col items-end gap-2 text-sm text-gray-600">
        <div className="text-right">
          <div className="font-medium text-gray-900">{question?.upvote?.length}</div>
          <div className="text-xs">votes</div>
        </div>

        <div
          className={`rounded px-2 py-0.5 text-right ${
            question?.noofanswer > 0
              ? "bg-green-100 text-green-800"
              : "text-gray-600"
          }`}
        >
          <div className="font-medium">{question?.noofanswer?.length}</div>
          <div className="text-xs">
            {question?.noofanswer?.length === 1 ? "answer" : "answers"}
          </div>
        </div>
      </div>

      {/* Right: content */}
      <div className="min-w-0 flex-1">
        <Link
          href={`/questions/${question?._id}`}
          className="text-lg font-medium text-blue-600 hover:text-blue-800"
        >
          {question?.questiontitle}
        </Link>

        <p className="mt-1 line-clamp-2 text-sm text-gray-700">
          {question?.questionbody}
        </p>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {question?.questiontags?.map((tag:any) => (
              <Badge
                key={tag}
                className="rounded bg-blue-100 px-2 py-0.5 text-xs font-normal text-blue-800 hover:bg-blue-200"
              >
                {tag}
              </Badge>
            ))}
          </div>

          {/* Author */}
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Link
              href={`/users/${question?.userid}`}
              className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800"
            >
              <Avatar className="size-5">
                <AvatarFallback className="text-[10px]">
                  {question?.userposted?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <span>{question?.userposted}</span>
            </Link>
            <span>asked {new Date(question?.askedon).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </article>
  ))}
</div>
  </div>
</main>
  </Main>  
    </>
  );
}
