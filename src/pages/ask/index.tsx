import { Button } from "@/components/ui/button";
import Main from "@/Layouts/Main";
import { useAuth } from "@/lib/authcontext";
import axiosInstance from "@/lib/axiosinstance";
import { Eye, MessageSquare, Pencil, FileText, Plus, X } from "lucide-react";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-toastify";

const MAX_TAGS = 5;
const MIN_BODY = 20;

const index = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [formdata, setformdata] = useState({
    title: "",
    body: "",
    tags: [] as string[],
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setformdata((prev) => ({ ...prev, [id]: value }));
  };

  // Adds one or many tags (supports "react, nextjs typescript")
  const handleAddTag = () => {
  
    const incoming = newTag
      .split(/[\s,]+/)
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    if (incoming.length === 0) return;

    const merged = [...formdata.tags];
    for (const tag of incoming) {
      if (merged.includes(tag)) continue; // skip duplicates
      if (merged.length >= MAX_TAGS) {
        toast.error(`You can add up to ${MAX_TAGS} tags`);
        break;
      }
      merged.push(tag);
    }

    setformdata((prev) => ({ ...prev, tags: merged }));
    setNewTag("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setformdata((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault(); // stops Enter from submitting the whole form
      handleAddTag();
    } else if (e.key === "Backspace" && newTag === "" && formdata.tags.length) {
      handleRemoveTag(formdata.tags[formdata.tags.length - 1]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please Login to ask question");
      router.push("/auth");
      return;
    }
    if (formdata.body.trim().length < MIN_BODY) {
      toast.error(`Details must be at least ${MIN_BODY} characters`);
      return;
    }
    if (formdata.tags.length === 0) {
      toast.error("Add at least one tag");
      return;
    }
    try {
      setSubmitting(true);
      const res = await axiosInstance.post("/question/ask", {
        postquestiondata: {
          questiontitle: formdata.title,
          questionbody: formdata.body,
          questiontags: formdata.tags,
          userposted:user.name,
          userid: user?._id,
        },
      
      });
      if (res.data.data) {
        toast.success("Question Posted SuccessFully");
        router.push("/");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something Went Wrong...");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100";

  return (
    <Main>
      <div className="flex w-full flex-col gap-6 p-6 lg:flex-row">
        {/* ---------- Left: form ---------- */}
        <div className="min-w-0 flex-1">
          <h1 className="mb-6 text-2xl font-semibold text-gray-800">
            Ask a public question
          </h1>

          <form
            onSubmit={handleSubmit}
            className="rounded-md border border-gray-200 bg-white p-6 shadow-sm"
          >
            <h2 className="mb-6 text-xl font-semibold text-gray-900">
              Writing a good question
            </h2>

            {/* Title */}
            <div className="mb-6">
              <label htmlFor="title" className="block text-base font-semibold text-gray-900">
                Title
              </label>
              <p className="mb-2 text-sm text-gray-500">
                Be specific and imagine you're asking a question to another person.
              </p>
              <input
                id="title"
                type="text"
                required
                value={formdata.title}
                onChange={handleChange}
                placeholder="e.g. How do I center a div in React?"
                className={inputClass}
              />
            </div>

            {/* Body */}
            <div className="mb-6">
              <label htmlFor="body" className="block text-base font-semibold text-gray-900">
                What are the details of your problem?
              </label>
              <p className="mb-2 text-sm text-gray-500">
                Introduce the problem and expand on what you put in the title. Minimum {MIN_BODY} characters.
              </p>
              <textarea
                id="body"
                required
                rows={9}
                value={formdata.body}
                onChange={handleChange}
                className={`${inputClass} resize-y`}
              />
              <p
                className={`mt-1 text-xs ${
                  formdata.body.trim().length >= MIN_BODY ? "text-green-600" : "text-gray-400"
                }`}
              >
                {formdata.body.trim().length}/{MIN_BODY} characters
              </p>
            </div>

            {/* Tags */}
            <div className="mb-6">
              <label htmlFor="tags" className="block text-base font-semibold text-gray-900">
                Tags
              </label>
              <p className="mb-2 text-sm text-gray-500">
                Add up to {MAX_TAGS} tags to describe what your question is about.
              </p>

              {/* input + add button on one row */}
              <div className="flex items-center gap-2">
                <input
                  id="tags"
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  disabled={formdata.tags.length >= MAX_TAGS}
                  placeholder={
                    formdata.tags.length >= MAX_TAGS
                      ? "Tag limit reached"
                      : "e.g. react, nextjs, typescript"
                  }
                  className={`${inputClass} flex-1`}
                />
                <Button
                  type="button"
                  onClick={handleAddTag}
                  disabled={formdata.tags.length >= MAX_TAGS}
                  aria-label="Add tag"
                  className="h-10 w-10 shrink-0 rounded-md bg-blue-600 p-0 text-white hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* tag chips */}
              {formdata.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {formdata.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 py-1 pl-3 pr-1.5 text-sm font-medium text-blue-700"
                    >
                      {tag}
                      <button
                        type="button"
                        aria-label={`Remove ${tag}`}
                        onClick={() => handleRemoveTag(tag)}
                        className="flex h-5 w-5 items-center justify-center rounded-full text-blue-700 transition hover:bg-blue-200"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <p className="mt-1 text-xs text-gray-400">
                {formdata.tags.length}/{MAX_TAGS} tags · press Enter or comma to add
              </p>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Posting..." : "Review your question"}
            </button>
          </form>
        </div>

        {/* ---------- Right: sidebar ---------- */}
        <aside className="w-full shrink-0 space-y-6 lg:w-72">
          {/* Overflow Blog */}
          <div className="rounded-md border border-yellow-200 bg-yellow-50 p-4">
            <h3 className="mb-3 font-semibold text-gray-900">The Overflow Blog</h3>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex gap-2">
                <Pencil className="mt-0.5 h-4 w-4 shrink-0" />
                A new era of Stack Overflow
              </li>
              <li className="flex gap-2">
                <Pencil className="mt-0.5 h-4 w-4 shrink-0" />
                How your favorite movie is changing language learning technology
              </li>
            </ul>
          </div>

          {/* Featured on Meta */}
          <div className="rounded-md border border-gray-200 bg-white p-4">
            <h3 className="mb-3 font-semibold text-gray-900">Featured on Meta</h3>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex gap-2">
                <MessageSquare className="mt-0.5 h-4 w-4 shrink-0" />
                Results of the June 2025 Community Asks Sprint
              </li>
              <li className="flex gap-2">
                <MessageSquare className="mt-0.5 h-4 w-4 shrink-0" />
                Will you help build our new visual identity?
              </li>
              <li className="flex gap-2">
                <FileText className="mt-0.5 h-4 w-4 shrink-0" />
                Policy: Generative AI (e.g., ChatGPT) is banned
              </li>
            </ul>
          </div>

          {/* Custom Filters */}
          <div>
            <h3 className="mb-3 text-lg font-semibold text-gray-900">Custom Filters</h3>
            <button
              type="button"
              className="rounded-md border border-blue-500 px-3 py-1.5 text-sm text-blue-600 transition hover:bg-blue-50"
            >
              Create a custom filter
            </button>
          </div>

          {/* Watched Tags */}
          <div>
            <h3 className="mb-6 text-lg font-semibold text-gray-900">Watched Tags</h3>
            <div className="flex flex-col items-center text-center text-sm text-gray-500">
              <Eye className="mb-3 h-10 w-10 text-gray-400" />
              <p className="mb-4">Watch tags to curate your list of questions.</p>
              <button
                type="button"
                className="flex items-center gap-2 rounded-md border border-blue-500 px-3 py-1.5 text-blue-600 transition hover:bg-blue-50"
              >
                <Eye className="h-4 w-4" />
                Watch a tag
              </button>
            </div>
          </div>
        </aside>
      </div>
    </Main>
  );
};

export default index;