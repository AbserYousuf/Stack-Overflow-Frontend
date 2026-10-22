import {
    Bookmark,
    ChevronDown,
    ChevronUp,
    Clock,
    Flag,
    FlagIcon,
    History,
    Share,
    Share2,
    Trash,
  } from "lucide-react";
  import { useEffect, useState } from "react";
  import ReactMarkdown, { type Components } from "react-markdown";
  import remarkGfm from "remark-gfm";
  import { Card, CardContent } from "./ui/card";
  import { Button } from "./ui/button";
  import Link from "next/link";
  import { Badge } from "./ui/badge";
  import { Avatar, AvatarFallback } from "./ui/avatar";
import { Textarea } from "./ui/textarea";
import axiosInstance from "@/lib/axiosinstance";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import Main from "@/Layouts/Main";
import { useAuth } from "@/lib/authcontext";

  
  // Mock questionData
  const questionData = {
    id: 1,
    title: "How can i block user with middleware?",
    content: `The problem I am trying to create a complete user login form in NextJS and I want to block the user to go to other pages without a login process before. So online i found that one of the most complete solutions is to use middleware. Here is my middleware.ts:
  
  \`\`\`javascript
  import { NextResponse } from "next/server"
  
  export function middleware(request) {
    const token = request.cookies.get("authToken")
  
    if (!token) {
      return NextResponse.redirect(new URL("/", request.url))
    }
  
    return NextResponse.next()
  }
  
  export const config = {
    matcher: [
      "/dashboard",
      "/dashboard/:path*",
      "/add-todo",
      "/add-todo/:path*",
      "/edit-todo",
      "/edit-todo/:path*",
      "/settings",
    ]
  }
  \`\`\`
  
  What I'm expecting is that when the user tries to access protected routes without being authenticated, they should be redirected to the login page. However, the middleware doesn't seem to work as expected.
  
  ## What I tried:
  
  1. Placed the middleware.ts file in the root directory
  2. Configured the matcher to include all protected routes
  3. Used JWT verification to check token validity
  4. Added proper error handling and logging
  
  The middleware runs but the redirects don't work properly. Sometimes users can still access protected pages even without valid tokens.
  `,
    votes: -4,
    answers: 2,
    views: 38,
    tags: ["node.js", "forms", "authentication", "next.js", "middleware"],
    author: {
      id: 3,
      name: "Aledi5",
      avatar: "A",
    },
    askedDate: "3 days ago",
    modifiedDate: "3 days ago",
    isBookmarked: false,
    userVote: null, // null, 'up', or 'down'
  };
  
  // Mock answers data
  const answersData = [
    {
      id: 1,
      content: `The issue you're experiencing is likely due to the middleware configuration and how NextJS handles redirects. Here are a few things to check:
  
  ## 1. Middleware File Location
  Make sure your \`middleware.ts\` file is in the correct location - it should be in the root of your project (same level as \`pages\` or \`app\` directory).
  
  ## 2. Import Statements
  You're missing some important imports in your middleware:
  
  \`\`\`javascript
  import { NextRequest, NextResponse } from 'next/server'
  import { jwtVerify } from 'jose'
  \`\`\`
  
  ## 3. Updated Middleware Code
  
  \`\`\`javascript
  import { NextRequest, NextResponse } from 'next/server'
  import { jwtVerify } from 'jose'
  
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  
  export default async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
  
    // Get token from cookies
    const token = request.cookies.get("authToken")?.value;
  
    if (!token) {
      console.log("[middleware] No token found, redirecting to login");
      return NextResponse.redirect(new URL('/login', request.url));
    }
  
    try {
      // Verify the JWT token
      const { payload } = await jwtVerify(token, secret);
      console.log("[middleware] Token verified for user:", payload.sub);
      return NextResponse.next();
    } catch (error) {
      console.log("[middleware] Token verification failed:", error);
      // Clear the invalid token
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('authToken');
      return response;
    }
  }
  
  export const config = {
    matcher: [
      '/dashboard/:path*',
      '/add-todo/:path*',
      '/edit-todo/:path*',
      '/settings/:path*'
    ]
  }
  \`\`\`
  
  ## Key Changes:
  - Added proper imports
  - Redirect to \`/login\` instead of \`/\`
  - Clear invalid tokens from cookies
  - Simplified matcher patterns
  - Better error handling
  
  This should resolve your middleware issues.`,
      votes: 5,
      author: {
        id: 1,
        name: "John Doe",
        reputation: 15420,
        avatar: "JD",
      },
      answeredDate: "2 days ago",
      isAccepted: true,
      userVote: null,
    },
    {
      id: 2,
      content: `Another approach you might consider is using NextAuth.js which handles authentication middleware automatically:
  
  ## Installation
  \`\`\`bash
  npm install next-auth
  \`\`\`
  
  ## Configuration
  Create \`pages/api/auth/[...nextauth].js\`:
  
  \`\`\`javascript
  import NextAuth from 'next-auth'
  import CredentialsProvider from 'next-auth/providers/credentials'
  
  export default NextAuth({
    providers: [
      CredentialsProvider({
        name: 'credentials',
        credentials: {
          email: { label: 'Email', type: 'email' },
          password: { label: 'Password', type: 'password' }
        },
        async authorize(credentials) {
          // Add your authentication logic here
          const user = await authenticateUser(credentials)
          return user ? user : null
        }
      })
    ],
    pages: {
      signIn: '/login'
    },
    callbacks: {
      async jwt({ token, user }) {
        return { ...token, ...user }
      },
      async session({ session, token }) {
        return { ...session, user: token }
      }
    }
  })
  \`\`\`
  
  ## Middleware with NextAuth
  \`\`\`javascript
  import { withAuth } from 'next-auth/middleware'
  
  export default withAuth(
    function middleware(req) {
      // Additional middleware logic here
    },
    {
      callbacks: {
        authorized: ({ token }) => !!token
      }
    }
  )
  
  export const config = {
    matcher: ['/dashboard/:path*', '/settings/:path*']
  }
  \`\`\`
  
  This approach is more robust and handles many edge cases automatically.`,
      votes: 2,
      author: {
        id: 2,
        name: "Felix Rodriguez",
        reputation: 799,
        avatar: "FR",
      },
      answeredDate: "1 day ago",
      isAccepted: false,
      userVote: null,
    },
  ];
  
  // How each markdown element is styled (replaces the regex + dangerouslySetInnerHTML)
  const markdownComponents: Components = {
    h1: ({ children }) => (
      <h3 className="mt-6 mb-3 text-lg font-semibold text-gray-900">{children}</h3>
    ),
    h2: ({ children }) => (
      <h3 className="mt-6 mb-3 text-lg font-semibold text-gray-900">{children}</h3>
    ),
    h3: ({ children }) => (
      <h3 className="mt-6 mb-3 text-lg font-semibold text-gray-900">{children}</h3>
    ),
    p: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>,
    ol: ({ children }) => (
      <ol className="mb-4 list-decimal space-y-2 pl-6">{children}</ol>
    ),
    ul: ({ children }) => (
      <ul className="mb-4 list-disc space-y-2 pl-6">{children}</ul>
    ),
    li: ({ children }) => <li className="leading-relaxed">{children}</li>,
    pre: ({ children }) => (
      <pre className="my-4 overflow-x-auto rounded-lg bg-gray-100 p-4 text-sm leading-6 text-gray-900">
        {children}
      </pre>
    ),
    code: ({ className, children }) => {
      const isBlock =
        /language-/.test(className ?? "") || String(children).includes("\n");
      return isBlock ? (
        <code className="font-mono text-sm">{children}</code>
      ) : (
        <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-sm">
          {children}
        </code>
      );
    },
    a: ({ href, children }) => (
      <a href={href} className="text-blue-600 hover:underline">
        {children}
      </a>
    ),
  };
  
  const QuestionDetail = ({ questionId }: any) => {
    const [question, setquestion] = useState<any>(null);
    const [answer, setanswer] = useState<any>(null);
    const {user}=useAuth()
    const [loading,setloading]=useState(true)
    useEffect(() => {
      setloading(true)
    const fetchuser=async()=>{
      try {
          const res=await axiosInstance.get('/question/getallquestion')

          const MatchedQuestion=res.data.data.find((u:any)=>u._id===questionId)

          setquestion(MatchedQuestion)
          setanswer(MatchedQuestion?.answer)
         
          console.log(`Grabbed User from Login and User's Id is :: ${user._id}`)
        
      } catch (error) {
          console.log(error)
      }
      finally{
          setloading(false)
      }
    }
    fetchuser()
  
  }, [questionId])
    
    
    const [newanswer, setnewanswer] = useState("");
    const [isSubmit, setSubmit] = useState<boolean>(false);
  const router=useRouter()
    const handleVote = async(vote:String) => {
      if(!user){
        toast.info("Please Login again")
        router.push('/auth')
      }
      try {
       const res=await axiosInstance.patch(`/question/vote/${question._id}`,{value:vote,userid:user?._id}) 
       if(res.data.data){
         setquestion(res.data.data)
       
         toast.success("Vote Updated ")
       }
      } catch (error) {
        console.log(error)
        toast.error("Failed To Upload Vote")
      }
    };
  
    const handleBookMark = () => {
      if(!user){
        toast.info("Please Login again")
        router.push('/auth')
      }
      setquestion((prev: any) => ({ ...prev, isBookmarked: !prev.isBookmarked }));
    };
  
    const handleSubmit = async () => {
      if(!user){
        toast.info("Please Login again")
        router.push('/auth')
      }
      if (!newanswer.trim()) return;
      setSubmit(true)
      try {

        const res=await axiosInstance.post(`/answer/postanswer/${question?._id }`,{
          noofanswer:question.noofanswer ,
          answerbody:newanswer,
          useranswered:user.name ,
          userid:user?._id
        },
      
      )
 
   
        if(res.data.data){
const newobj=res.data.data
console.log("Answer Object is :: ",newobj )
          setquestion((prev:any)=>({
            ...prev,
            noofanswer:prev.noofanswer+1,
            answer:[...(prev.answer || []),newobj]
          }))
          toast.success('Answer Uploaded ')
          
        }
      } catch (error) {
        console.log(error)
        toast.error("Failed to answer ")
      }finally{
        setnewanswer("")
        setSubmit(false)
      }
      
    };
  const handledelete=async()=>{
    if(!user){
      toast.info("Please Login again")
      router.push('/auth')
    }

try {
  const res=await axiosInstance.delete(`/question/delete/${question?._id}`)
  if(res.data.success===true){
    toast.success("Question Deleted SuccessFull")
    setTimeout(() => {
      router.push('/')
    }, 3000);
  }

} catch (error) {
  console.error(error)
  toast.error("Failed to delete the question")
}
  }
  const handledeleteanswer=async(id:String)=>{
    if(!user){
      toast.info("Please Login again")
      router.push('/auth')
    }
    console.log("Id recieved ",id)

try {
  const res=await axiosInstance.delete(`/answer/delete/${question._id}`,{data:{
    noofanswer:question.noofanswer,
    answerid:id
  }})
  if(res.data.data){
    const updatedanswer=question.answer.filter((ans:any)=>ans?._id!==id)
    setquestion((prev:any)=>({
      ...prev ,
      noofanswer:updatedanswer.length ,
      answer:updatedanswer
    }))
    toast.success("answer deleted successfully")
  
  }

} catch (error) {
  console.error(error)
  toast.error("Failed to delete the answer")
}
  }

  if(loading){
    return(
        <div className="flex justify-center items-center min-h-[200px]">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    )
}
if(!question || question.length===0){
    return(
      
      <Main>
      <div className="text-center text-gray-500 mt-4">No Questions Found</div>
    </Main>
    )
}
    return (
      <div>
        {/* Title + meta */}
        <div>
          <h1 className="mb-4 text-xl font-semibold text-gray-900 lg:text-2xl">
            {question?.questiontitle}
          </h1>
          <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>Asked {new Date(question?.askedon).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
  
        <Card className="mb-8">
          <CardContent className="p-0">
            <div className="flex flex-col sm:flex-row">
              {/* Voting section */}
              <div className="flex items-center justify-center gap-2 border-b border-gray-200 p-4 sm:flex-col sm:justify-start sm:border-b-0 sm:border-r sm:p-6">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`p-2 ${
                    "text-orange-500"
                     
                  }`}
                  onClick={() => handleVote("upvote")}
                  aria-label="Upvote"
                >
                  <ChevronUp className="h-6 w-6" />
                </Button>
  
                <span className="text-lg font-semibold text-gray-900">
                  {question?.upvote.length -question?.downvote.length}
                </span>
  
                <Button
                  variant="ghost"
                  size="sm"
                  className={`p-2 ${
                    "text-orange-500"
                      
                  }`}
                  onClick={() => handleVote("downvote")}
                  aria-label="Downvote"
                >
                  <ChevronDown className="h-6 w-6" />
                </Button>
  
                <div className="flex gap-1 sm:mt-2 sm:flex-col">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-2 text-gray-600 hover:text-gray-900"
                    onClick={handleBookMark}
                    aria-label="Bookmark"
                  >
                    <Bookmark
                      className="h-5 w-5"
                      fill={question.isBookmarked ? "currentColor" : "none"}
                    />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-2 text-gray-600 hover:text-gray-900"
                    aria-label="History"
                  >
                    <History className="h-5 w-5" />
                  </Button>
                </div>
              </div>
  
              {/* Content section */}
              <div className="min-w-0 flex-1 p-4 sm:p-6">
                <div className="mb-6 max-w-none leading-relaxed text-gray-800">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={markdownComponents}
                  >
                    {question?.questionbody}
                  </ReactMarkdown>
                </div>
  
                {/* Tags */}
                <div className="mb-6 flex flex-wrap gap-2">
                  {question?.questiontags?.map((tag: any) => (
                    <Link href={"/tags"} key={tag}>
                      <Badge
                        variant="secondary"
                        className="cursor-pointer bg-blue-100 text-blue-800 hover:bg-blue-200"
                      >
                        {tag}
                      </Badge>
                    </Link>
                  ))}
                </div>
  
                {/* Footer: actions + author */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1.5 text-gray-600 hover:text-gray-900"
                    >
                      <Share2 className="h-4 w-4" />
                      Share
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1.5 text-gray-600 hover:text-gray-900"
                    >
                      <Flag className="h-4 w-4" />
                      Flag
                    </Button>
                  </div>
                  {question?.userid===user?._id &&(
                  <Button
                                         variant='ghost'
                                         size='sm'
                                         onClick={handledelete}
                                         className="text-red-600 hover:text-red-800"
                                         >
                                       <Trash className="w-4 h-4 mr-1">
                                        Delete
                                       </Trash>
                                         </Button>
                  )}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>asked {new Date(question.askedon).toLocaleDateString()}</span>
                    <Link
                      href={`/users/${question?.userid}`}
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                    >
                      <Avatar className="h-7 w-7">
                        <AvatarFallback className="text-xs">
                          {question?.userposted?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span>{question?.userposted}</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <div>
            <h2 className="text-black">{question?.answer?.length} Answer{question?.answer?.length !==1? "s":""}</h2>
            <div>
                {question?.answer?.map((ans:any)=>(
                    <Card 
                    key={ans?._id}
                    >
                        <CardContent>
                            <div>
                                <div>
                                    <div>
                                    <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={markdownComponents}
                  >
                    {ans?.answerbody}
                  </ReactMarkdown>
                                    </div>
                                    <div>
                                        <div>
                                            <Button
                                            variant='ghost'
                                            size='sm'
                                            className="text-gray-600 hover:text-gray-200"
                                            >
                                                <Share className="w-4 h-4 mr-1">
                                                    Share
                                                </Share>
                                            </Button>
                                            <Button
                                            variant='ghost'
                                            size='sm'
                                            className="text-gray-600 hover:text-gray-200"
                                            >
                                            <Flag
                                            
                                           className="w-4 h-4 mr-1"
                                            >
                                                 Flag
                                            </Flag>
                                            </Button>
                                           
                                            {ans?.userid===user?._id &&(
                  <Button
                                         variant='ghost'
                                         size='sm'
                                         onClick={()=>{handledeleteanswer(ans?._id)}}
                                         className="text-red-600 hover:text-red-800"
                                         >
                                       <Trash className="w-4 h-4 mr-1">
                                        Delete
                                       </Trash>
                                         </Button>
                  )}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm ">
                                            <span className="text-gray-600">
                                                answered {new Date(ans.answeredon).toLocaleDateString()}
                                            </span>
                                            <Link href={`/users/${ans.userid}`}
                                            className="flex items-center gap-2 hover:bg-blue-50 p-2 rounded"
                                            >
                                            <Avatar className="w-8 h-8">
                                                <AvatarFallback className="text-sm">
                                                    {ans.useranswered?.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="text-blue-600 hover:text-blue-800 font-medium">
                                                    {ans.useranswered}
                                                </div>
                                            </div>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
        <Card >
            <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">
                    Your Answer
                </h3>
               <Textarea 
               placeholder="Write your FeedBack here..."
               className="min-h-32 mb-4 resize-none"
               value={newanswer}
               onChange={(e)=>setnewanswer(e.target.value)}
               />
               <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <Button 
                className="bg-blue-600 hover:bg-blue-800 text-white"
                onClick={handleSubmit} disabled={!newanswer.trim() || isSubmit}>
                {isSubmit?"...Submitting Your answer ":"Submit Your Answer"}
                </Button>
                <p className="text-sm text-gray-600">
                    By Posting your answer, you are agreeing to the {' '}
                    <Link href='#' className="text-blue-600 hover:underline">
                    Privacy and Policy
                    </Link>
                    {' '} and  
                    <Link href='#'  className="text-blue-600 hover:underline">
                     Terms and Conditions</Link>
                </p>
               </div>
            </CardContent>
        </Card>
      </div>
    );
  };
  
  export default QuestionDetail;