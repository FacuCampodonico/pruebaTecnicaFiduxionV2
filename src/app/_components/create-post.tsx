"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { api } from "facuCampodonico/trpc/react";

export function CreatePost() {
  const router = useRouter();
  const [name, setName] = useState("");

  const createPost = api.post.create.useMutation({
    onSuccess: () => {
      router.refresh();
      setName("");
    },
  });

  return (
    <div className="w-full">
      <form
      onSubmit={(e) => {
        e.preventDefault();
        createPost.mutate({ name });
      }}
      className="flex flex-col gap-2"
    >
      <input
      type="text"
      placeholder="Title"
      value={name}
      onChange={(e) => setName(e.target.value)}
      className="rounded-full px-4 py-2 text-black border border-black/10 transition-colors duration-300 focus:border-black/20 hover:border-black/20"
      />
      <button
        type="submit"
        className="rounded-full bg-black/10 px-10 py-3 font-semibold transition hover:bg-black/20"
        disabled={createPost.isLoading}
      >
        {createPost.isLoading ? "Submitting..." : "Submit"}
      </button>
    </form>
    </div>
    
  );
}
