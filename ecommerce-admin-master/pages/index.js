import Layout from "@/components/Layout";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }
  return (
    <Layout>
      <div className="text-blue-900 flex flex-col items-center mt-10">
        <h2 className="text-3xl font-bold">
          Xin chào, <b>{session?.user?.name || "Guest"}</b>
        </h2>
        <p className="mt-4 text-lg">
          Email: <span className="text-gray-600">{session?.user?.email}</span>
        </p>
        <p className="mt-2">
          Chức vụ: <span className="font-semibold text-green-600">{session?.user?.role === "admin" ? "Quản trị viên" : "Không"}</span>
        </p>
      </div>
    </Layout>
  );
}
