import { Routes, Navigate, Route } from "react-router"
// import Dashboard from "./pages/dashboard";
import Login from './pages/login';
// import SignUp from './pages/signupPage';
import { ProtectedRoute, AdminRoute, UserRoute, IsStagesCompleted, IsProfileApproved } from "./components/ProtectedRoute";
import Community from "./components/Profile/community";
import { NotFoundPage } from "./pages/Not Found";
// import { Profile } from "./pages/profile";
import { Admin } from "./pages/admin";
import ContactAdmin from "./pages/contactAdmin";
import { AdminUser } from "./pages/adminUser";
import Profile from "./pages/profile";
import User from "./pages/user";
import { AdminProfile } from "./pages/adminProfile";
import TopBar from "./components/SideBar/userSidebar";
import ForgotPassword from "./pages/forgotPassword";

export function AllRoutes() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/forgotPassword" element={<ForgotPassword />} />
            <Route path="/contactAdmin" element={<ContactAdmin />} />
            <Route path="" element={<Navigate to="/user" />} />
            <Route element={<ProtectedRoute />}>
                <Route element={<IsProfileApproved />}>
                    <Route path="/community" element={<TopBar><Community /></TopBar>} />
                </Route>
                <Route element={<IsStagesCompleted />}> {/* routes for profile approved, all stagescompleted, admin after getting request */}
                    <Route path="/profile/:userId" element={<Profile />} />
                </Route>
                <Route element={<UserRoute />}> {/* routes only for user*/}
                    <Route path="/user" element={<User />} />
                </Route>
                <Route element={<AdminRoute />}> {/* routes only for admin*/}
                    <Route path="/admin" element={<Admin />}>
                        <Route path="users" element={<AdminUser />} />
                        <Route path="profiles" element={<AdminProfile />} />
                        <Route path="community" element={<Community />} />
                    </Route>
                </Route>
            </Route>
            <Route path="*" element={<NotFoundPage reason="Page Not Found. Please confirm your url." />} />
        </Routes>
    );
}