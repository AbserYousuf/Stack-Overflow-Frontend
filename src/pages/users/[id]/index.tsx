import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Main from "@/Layouts/Main";
import { useAuth } from "@/lib/authcontext";
import axiosInstance from "@/lib/axiosinstance";
import { Plus, X, Calendar } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

type User = {
  id: number;
  name: string;
  joinDate: string;
  about: string;
  tags: string[];
};

const users: Record<string, User> = {
  "1": {
    id: 1,
    name: "John Alexson",
    joinDate: "29-03-2020",
    about:
      "Full Stack developer with 8+ years of experience, strong in TypeScript and Next.js.",
    tags: [
      "Javascript",
      "React Js",
      "Node Js",
      "Typescript",
      "Next js",
      "Python",
      "Mongo Db",
    ],
  },
};

const getUserData = (id: string): User => users[id] || users["1"];
const UserProfile = () => {
  const router = useRouter();
  const {user}=useAuth()

  const { id } = router.query;
  const [users,setusers]=useState<any>(null)
  const [loading,setloading]=useState(true)
  useEffect(() => {
      setloading(true)
    const fetchuser=async()=>{
      try {
          const res=await axiosInstance.get('/user/getalluser')
          const matchedUser=res.data.data.find((u:any)=>u._id===id)
          setusers(matchedUser)
        
      } catch (error) {
          console.log(error)
      }
      finally{
          setloading(false)
      }
    }
    fetchuser()
  
  }, [id])
  const [open, setOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    about: "",
    tags: [] as string[],
  });
  const [newTag, setNewTag] = useState("");

  // Load the user once the router has the id
  useEffect(() => {
    if (!router.isReady) return;
    setusers(getUserData(String(id)));
  }, [router.isReady, id]);

  // Fill the form with current values every time the dialog opens
  const handleOpenChange = (next: boolean) => {
    if (next && users) {
      setEditForm({ name: users.name, about: users.about, tags: [...users.tags] });
      setNewTag("");
    }
    setOpen(next);
  };

  const handleSaveProfile = async() => {
    if (!users || !editForm.name.trim()) return;
    try {
      const res=await axiosInstance.patch(`/user/update/${user?._id}`,{name:editForm.name, about:editForm.about, tags:editForm.tags})
      console.log(res)
      if(res.data.data){
        setusers({
          ...users,
          name: editForm.name.trim(),
          about: editForm.about,
          tags: editForm.tags,
        });
        setOpen(false);
        toast.success("Profile Updated Successfully");
      }
    } catch (error) {
      console.log(error)
      toast.error( "Something Went Wrong")
    }
  };

  const handleAddTag = () => {
    const trimmed = newTag.trim();
    if (trimmed && !editForm.tags.includes(trimmed)) {
      setEditForm({ ...editForm, tags: [...editForm.tags, trimmed] });
    }
    setNewTag("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setEditForm({
      ...editForm,
      tags: editForm.tags.filter((tag) => tag !== tagToRemove),
    });
  };
  const currentUserId = user?._id;
  const ownProfile = String(id) === currentUserId;

  const initials =
    users?.name
      ?.split(" ")
      .filter(Boolean)
      .map((w:any) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "";

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
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          {/* Cover */}
          <div className="h-28 bg-linear-to-r from-blue-600 to-indigo-600 sm:h-40" />

          <div className="px-4 pb-6 sm:px-8">
            {/* Avatar + edit button */}
            <div className="-mt-12 flex items-end justify-between gap-4 sm:-mt-14">
              <Avatar className="size-24 border-4 border-white bg-white shadow-md sm:size-28">
                <AvatarFallback className="bg-blue-100 text-2xl font-semibold text-blue-700 sm:text-3xl">
                  {initials}
                </AvatarFallback>
              </Avatar>

              {ownProfile && (
                <Dialog open={open} onOpenChange={handleOpenChange}>
                  <DialogTrigger asChild>
                    <Button className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700">
                      Edit Profile
                    </Button>
                  </DialogTrigger>

                  <DialogContent className="max-h-[85vh] overflow-y-auto rounded-xl p-5 sm:max-w-lg sm:p-6">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-bold text-gray-900">
                        Edit Profile
                      </DialogTitle>
                      <DialogDescription className="sr-only">
                        Update your name, about section and skills.
                      </DialogDescription>
                    </DialogHeader>

                    {/* Basic Info */}
                    <div className="mt-2 space-y-4">
                      <h3 className="border-b border-gray-200 pb-2 text-base font-semibold text-gray-900">
                        Basic Information
                      </h3>
                      <div className="space-y-2">
                        <Label
                          htmlFor="name"
                          className="text-sm font-medium text-gray-700"
                        >
                          Name
                        </Label>
                        <Input
                          id="name"
                          value={editForm.name}
                          onChange={(e) =>
                            setEditForm({ ...editForm, name: e.target.value })
                          }
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus-visible:ring-2 focus-visible:ring-blue-500"
                        />
                      </div>
                    </div>

                    {/* About */}
                    <div className="mt-4 space-y-4">
                      <h3 className="border-b border-gray-200 pb-2 text-base font-semibold text-gray-900">
                        About Information
                      </h3>
                      <div className="space-y-2">
                        <Label
                          htmlFor="about"
                          className="text-sm font-medium text-gray-700"
                        >
                          About Me
                        </Label>
                        <Textarea
                          id="about"
                          value={editForm.about}
                          onChange={(e) =>
                            setEditForm({ ...editForm, about: e.target.value })
                          }
                          className="min-h-28 w-full rounded-lg border border-gray-300 px-3 py-2 focus-visible:ring-2 focus-visible:ring-blue-500"
                        />
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="mt-4 space-y-4">
                      <h3 className="border-b border-gray-200 pb-2 text-base font-semibold text-gray-900">
                        Skills and Technologies
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Label htmlFor="tag" className="sr-only">
                            Add skill
                          </Label>
                          <Input
                            id="tag"
                            value={newTag}
                            placeholder="Add a skill..."
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                handleAddTag();
                              }
                            }}
                            onChange={(e) => setNewTag(e.target.value)}
                            className="min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-2 focus-visible:ring-2 focus-visible:ring-blue-500"
                          />
                          <Button
                            type="button"
                            onClick={handleAddTag}
                            className="h-10 w-10 shrink-0 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {editForm.tags.map((tag) => (
                            <Badge
                              key={tag}
                              className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-100 py-1 pl-3 pr-1 text-sm font-medium text-blue-700"
                            >
                              {tag}
                              <button
                                type="button"
                                aria-label={`Remove ${tag}`}
                                onClick={() => handleRemoveTag(tag)}
                                className="flex h-5 w-5 items-center justify-center rounded-full text-blue-700 hover:bg-blue-200"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <DialogFooter className="mt-6 gap-2 sm:gap-2">
                      <Button
                        type="button"
                        variant="outline"
                         className="bg-blue-600 text-white hover:bg-blue-700"
                        onClick={() => setOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        onClick={handleSaveProfile}
                        disabled={!editForm.name.trim()}
                        className="bg-blue-600 text-white hover:bg-blue-700"
                      >
                        Save Changes
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </div>

            {/* Name + meta */}
            <div className="mt-4">
              <h1 className="wrap-break text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                {users?.name}
              </h1>

              <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>
                    Member since{" "}
                    {users?.joinDate?.split("-").reverse().join("-")}
                  </span>
                </div>
              </div>
            </div>

            {/* About */}
            {users?.about && (
              <p className="mt-5 max-w-3xl text-sm leading-relaxed text-gray-700 sm:text-base">
                {users.about}
              </p>
            )}

            {/* Tags */}
            {!!users?.tags?.length && (
              <div className="mt-4 flex flex-wrap gap-2">
                {users?.tags?.map((tag:any) => (
                  <Badge
                    key={tag}
                    className="rounded-full border border-blue-200 bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Badges */}
            <div className="mt-6 border-t border-gray-200 pt-5">
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-yellow-500" />
                  <span className="font-semibold text-gray-900">5</span>
                  <span className="text-gray-600">gold badges</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-gray-400" />
                  <span className="font-semibold text-gray-900">23</span>
                  <span className="text-gray-600">silver badges</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-amber-600" />
                  <span className="font-semibold text-gray-900">45</span>
                  <span className="text-gray-600">bronze badges</span>
                </div>
              </div>
            </div>
          </div>
          <div>
            {/*Card Section About */}
            <div>
                <Card>
                    <CardContent>
                        <CardTitle>
                            About
                        </CardTitle>
                        <div className="prose max-w-none">
                            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                {users?.about}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
                {/*Card Section Tags*/}
            <div>
                <Card>
                    <CardContent>
                        <CardTitle>
                            Top Tags
                        </CardTitle>
                        <div className="space-y-3">
                            
                                {users?.tags?.map((tag:any)=>(
                                    <div key={tag}
                                    className="flex items-center justify-between"
                                    >
                                        <div>
                                            <Badge className="bg-blue-600  text-red-200 hover:bg-red-600 cursor-pointer">
                                                {tag}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                           
                        </div>
                    </CardContent>
                </Card>
            </div>
          </div>
        </div>
      </div>
    </Main>
  );
};

export default UserProfile;