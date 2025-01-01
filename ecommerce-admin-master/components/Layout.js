import { useSession } from "next-auth/react";
import Nav from "@/components/Nav";
import { useState } from "react";
import Logo from "@/components/Logo";

export default function Layout({ children }) {
  const [showNav, setShowNav] = useState(false);
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="bg-bgGray w-screen h-screen flex items-center justify-center">
        <p className="text-white">Đang tải...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="bg-bgGray w-screen h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-black text-3xl font-bold mb-4">Xin chào</h1>
          <p className="text-black-300 mb-8">Hãy đăng nhập để tiếp tục.</p>
          <button
            onClick={() => (window.location.href = "/auth/signin")}
            className="bg-white text-blue-500 font-medium py-2 px-4 rounded-lg shadow-md hover:bg-gray-100"
          >
            Đăng nhập
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-bgGray min-h-screen">
      {/* <div className="flex justify-between items-center bg-white shadow-md p-4">
        <div className="flex items-center gap-4">
          <span className="text-gray-700 font-medium">
            Xin chào, {session?.user?.name || "User"}
          </span>
        </div>
      </div> */}
      <div className="flex">
        <Nav show={showNav} />
        <div className="flex-grow p-4">{children}</div>
      </div>
    </div>
  );
}
