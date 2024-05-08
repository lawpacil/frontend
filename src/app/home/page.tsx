import { auth, signOut } from "@auth";
import MainCalendar from "./calendar";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();
  if (!session) redirect("/api/auth/signin");

  return (
    <div className="pt-24 container mx-auto flex flex-col gap-6">
      <form
        action={async () => {
          "use server";
          await signOut();
        }}
      >
        <div className="text-2xl font-bold flex items-center gap-4">
          <div>Welcome, {session.user.username ?? session.user.email}!</div>
          <button className="btn btn-error btn-sm" type="submit">
            Logout
          </button>
        </div>
      </form>
      <MainCalendar />
    </div>
  );
}
