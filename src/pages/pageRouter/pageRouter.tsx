import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import DashboardPage from "../dashboard/page";
import { useUser } from "../../context/AuthContext";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import AuthPage from "../auth/page";


const LoadingScreen = () => (
    <div className={`bg-black transtion-all duration-500 pointer-events-none fixed z-50 flex flex-col justify-center items-center w-full min-h-screen`}>
        <p className={`control-text text-[50px] mt-10`}>Control</p>
        <DotLottieReact
            src="https://lottie.host/e580eaa4-d189-480f-a6ce-f8c788dff90d/MP2FjoJFFE.lottie"
            className="w-20 p-0"
            loop
            autoplay
        />
    </div>
);

export default function PageRouter() {
    const { isAuthenticated, isLoading } = useUser();

    if (isLoading) {
        return <LoadingScreen />;
    }

    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={isAuthenticated ? <Navigate to='/dashboard' replace /> : <Navigate to='/auth' replace />}
                />

                <Route
                    path="/auth"
                    element={!isAuthenticated ? <AuthPage /> : <Navigate to='/dashboard' replace />}
                />


                <Route
                    path="/dashboard"
                    element={isAuthenticated ? <DashboardPage /> : <Navigate to='/auth' replace />}
                />
                {/* <DashboardPage /> */}
            </Routes>
        </BrowserRouter>
    );
}