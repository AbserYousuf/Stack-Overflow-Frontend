import QuestionDetail from "@/components/QuestionDetail"
import Main from "@/Layouts/Main"
import { useRouter } from "next/router"

const index = () => {
    const router=useRouter()
    const {id}=router.query
  return (
<Main >
    <QuestionDetail questionId={Array.isArray(id)?id[0]:id}/>
</Main>
  )
}

export default index