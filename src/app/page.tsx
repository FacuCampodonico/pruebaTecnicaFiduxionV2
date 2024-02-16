import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";

import { CreatePost } from "facuCampodonico/app/_components/create-post";
import { getServerAuthSession } from "facuCampodonico/server/auth";
import { api } from "facuCampodonico/trpc/server";

export default async function Home() {
  noStore();
  const hello = await api.post.hello.query({ text: "from tRPC" });
  const session = await getServerAuthSession();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white to-[#15162c] text-black">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
      
        <div className="flex flex-col items-center gap-2">
          <p className="text-2xl text-black">
            ToDo-List
          </p>

          <div className="flex flex-col items-center justify-center gap-4">
            <p className="text-center text-2xl text-black">
              {session && <span>Logged in as {session.user?.name}</span>}
            </p>
            <Link
              href={session ? "/api/auth/signout" : "/api/auth/signin"}
              className="rounded-full bg-black/10 px-10 py-3 font-semibold no-underline transition hover:bg-black/20"
            >
              {session ? "Sign out" : "Sign in"}
            </Link>
          </div>
        </div>

        <CrudShowcase />
      </div>
    </main>
  );
}

interface Post {
  id: number;
  name: string;
}

async function CrudShowcase() {
  const session = await getServerAuthSession();
  if (!session?.user) return null;

  const allPosts = await api.post.getAllPosts.query();

  return (
    <div className="w-full mt-4 flex flex-col items-center">
      <div className="mx-8 my-4 w-3/4">
      {allPosts && allPosts.length > 0 ? (
        <table className="w-full mt-4">
          <thead>
            <tr>
              <th className="py-2 w-3/4 bg-gray-200">Tarea</th>
              <th className="py-2 bg-gray-200">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {allPosts.map((post) => (
              <tr key={post.id}>
                <td className="border-b border-gray-200 py-2 pl-2">{post.name}</td>
                <td className="flex justify-center">
                  <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded-full mr-2 my-1">Editar</button>
                  <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded-full my-1">Borrar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>You have no posts yet.</p>
      )}
      </div>

      <div>
        <CreatePost />
      </div>
    </div>
  );
}



