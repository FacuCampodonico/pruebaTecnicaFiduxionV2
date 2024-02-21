'use client'

import { useRouter } from "next/navigation";
import { useState } from "react"; 
import { api } from "facuCampodonico/trpc/react";

interface Post {
  id: number;
  name: string | null;
  createdById: string;
  createdAt: Date;
  updatedAt?: string;
}

function List({ post }: { post: Post }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false); 
  const [editedName, setEditedName] = useState(post.name || ""); 

  const deletePost = api.post.delete.useMutation({
    onSuccess: () => {
      router.refresh();
    }
  });

  const editPost = api.post.edit.useMutation({ 
    onSuccess: () => {
      router.refresh();
      setEditing(false); 
    }
  });

  const borrarPost = async () => {
    const postId: number = post.id;
    deletePost.mutate(postId);
  };

  const handleEdit = () => {
    setEditing(true); 
  };

  const handleSaveEdit = () => {
    const editedPost = { ...post, name: editedName }; 
    editPost.mutate({ id: editedPost.id, name: editedPost.name }); 
  };

  return (
    <div className="w-full mt-4 flex items-center">
      {editing ? (
        <>
          <input
            type="text"
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
          />
          <button
            onClick={handleSaveEdit}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded-full mr-2 my-1"
          >
            Guardar
          </button>
        </>
      ) : (
        <>
          <div className="border-b border-gray-200 py-2 px-4 flex-grow">
            {post.name}
          </div>
          <div className="flex justify-center">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded-full mr-2 my-1"
              onClick={handleEdit}
            >
              Editar
            </button>
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded-full my-1"
              onClick={borrarPost}
            >
              Borrar
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default List;
