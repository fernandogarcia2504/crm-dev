import { Outlet } from "react-router-dom";

export default function AuthLayout() {
    return (
        <div className="bg-[#0d0e11] w-full h-screen text-[#e7e9ee]">
            <main className="w-full h-full">
                <Outlet />
            </main>
        </div>
    )
}