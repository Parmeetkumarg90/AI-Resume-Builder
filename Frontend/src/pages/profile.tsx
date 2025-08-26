import sessionStore from "../store";
import TopBar from "../components/SideBar/userSidebar";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { NotFoundPage } from "./Not Found";
import type { overallData } from "../schema/authSchema";
import { GetRequest } from "../serivces/auth";
import env from "../config/env";
import ProfilePage from "../components/Profile/profilePage";
import { message } from "antd";

export default function Profile() {
    const [messageApi, contextHolder] = message.useMessage();
    const [allProfile, setProfiles] = useState<overallData | null>(null);
    const { session } = sessionStore.getState();
    const [isCurrentLoggedInUserProfile, setIsCurrentLoggedInUserProfile] = useState<boolean>(false);
    const [isUserValid, setisUserValid] = useState<boolean>(false);
    const { userId } = useParams();

    async function getProfile() {
        if (!userId) {
            messageApi.error("Invalid Profile");
            return;
        }
        const result = await GetRequest(`${env.VITE_BACKEND_URL}/api/other/profile/${userId}`);
        if (result) {
            setProfiles(result.result);
            setisUserValid(true);
        }
        else {
            setisUserValid(false);
        }
    }

    useEffect(() => {
        if (userId === session?.Credential.userId) {
            setIsCurrentLoggedInUserProfile(true);
        }
        getProfile();
    }, [userId]);

    return (
        <TopBar>
            {contextHolder}
            {!isUserValid && <NotFoundPage reason="Invalid User Profile" />}
            {isUserValid && <ProfilePage allProfile={allProfile} isCurrentLoggedInUserProfile={isCurrentLoggedInUserProfile} />}
        </TopBar>
    );
}