import { useEffect, useState } from "react";
import env from "../../config/env";
import { GetRequest } from "../../serivces/auth";
import Meta from "antd/es/card/Meta";
import { message, Card, Flex } from "antd";
import type { overallData } from "../../schema/authSchema";
import { useNavigate } from "react-router";

export default function Community() {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [messageApi, contextHolder] = message.useMessage();
    const [profiles, setAllProfiles] = useState<overallData[] | null>(null);
    const navigate = useNavigate();

    async function handleGetProfiles() {
        const result = await GetRequest(`${env.VITE_BACKEND_URL}/api/other/community`);
        try {
            if (result) {
                setAllProfiles(result.result);
                messageApi.success(result.status);
                console.log(result)
                setIsLoading(false);
            }
            else {
                messageApi.error("Error occured");
                setIsLoading(false);
            }
        } catch (err) { console.log(err); }
    }

    useEffect(() => {
        handleGetProfiles();
    }, []);

    return (
        <>
            {contextHolder}
            {isLoading ? (
                <Flex className="flex flex-row justify-center items-center">
                    <Card title="Loading...">Please wait</Card>
                </Flex>
            ) : profiles && profiles.length > 0 ? (
                <Flex className="flex flex-wrap justify-center gap-5 items-center">
                    {profiles.map((profile: overallData) => (
                        <Card
                            hoverable
                            onClick={() => { navigate(`/profile/${profile.accounctId}`) }}
                            key={profile.email}
                            title={`${profile.firstName} ${profile.middleName} ${profile.lastName}`}
                            className="w-60 flex-shrink-0"
                            cover={
                                <img
                                    alt="profile image"
                                    className="w-24 h-24 p-2 rounded-full mx-auto"
                                    src={`${env.VITE_BACKEND_URL}/upload/${profile.userImage}`}
                                />
                            }
                        >
                            <Meta title={profile.email} description={profile.phoneNumber} />
                        </Card>
                    ))}
                </Flex>
            ) : (
                <Flex className="flex flex-row justify-center items-center">
                    <Card title="No User">No Profiles Till Now</Card>
                </Flex>
            )}
        </>
    );
}