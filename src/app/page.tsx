import Link from "next/link";

export default async function Home() {
  return (
    <main>
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">Schedule App</h1>
            <p className="py-6">
              A simple scheduling app for groups and individuals.
            </p>
            <Link className="btn btn-primary" href="/home">
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
