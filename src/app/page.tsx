import { auth, signIn, signOut } from "@auth";

export default async function Home() {
  const session = await auth();

  return (
    <main className="container mx-auto h-screen flex flex-col gap-4 justify-center items-center">
      {session ? (
        <>
          <div> Hello, {session.user.email || session.user.username}</div>
          <form
            action={async () => {
              "use server";
              await signOut();
            }}
          >
            <button className="btn btn-error" type="submit">
              Logout
            </button>
          </form>
        </>
      ) : (
        <form
          action={async () => {
            "use server";
            await signIn();
          }}
        >
          <button className="btn btn-primary" type="submit">
            Login
          </button>
        </form>
      )}
    </main>
  );
}
