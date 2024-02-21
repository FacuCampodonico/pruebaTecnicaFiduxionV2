import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";

import { getServerAuthSession } from "facuCampodonico/server/auth";
import { api } from "facuCampodonico/trpc/server";
import  List  from "facuCampodonico/app/_components/list";
import { CreatePost } from "facuCampodonico/app/_components/create-post";

export default async function Home() {
  noStore();
  const hello = await api.post.hello.query({ text: "from tRPC" });
  const session = await getServerAuthSession();



  const userId = session.user.id;
  const postss = await api.post.getAllPosts.query();
  const posts = postss.filter(post => post.createdById === userId);
  
  //const latestPost  = await api.post.getLatest.query();

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

        <div className="w-full flex justify-center">
          <div className="w-3/4 tabla">
            {posts.length > 0 ? (
              posts.map((post, index) => <List post={post} key={index} />)
            ) : (
              <p>Aun no has subido ninguna tarea...</p>
            )}
          </div>
        </div>

        <div>
          <CreatePost />
        </div>
      </div>
    </main>
  );
}



