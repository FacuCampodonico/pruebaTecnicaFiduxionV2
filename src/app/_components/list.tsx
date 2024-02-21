'use client'

import { useRouter } from "next/navigation";

import { api } from "facuCampodonico/trpc/react";

interface Post{
    id: number;
    name: string | null; // Hacer name opcional
    createdById: string;
    createdAt: Date;
    updatedAt?: string;
  }
  
function List({ post }: { post: Post }) {

    const router = useRouter();

    const deletePost = api.post.delete.useMutation({
        onSuccess: () =>{
          router.refresh();
        }
      })

    const borrarPost = async () =>{
        const postId:number = post.id
        deletePost.mutate(postId)  
    }

    return (
      
        <div className="w-3/4 mt-4 flex items-center">
            <div className="border-b border-gray-200 py-2 px-4 flex-grow">{post.name}</div>
            <div className="flex justify-center">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded-full mr-2 my-1">Editar</button>
                <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded-full my-1" onClick={borrarPost}>
                    Borrar
                </button>
            </div>
        </div>
    );
}

export default List