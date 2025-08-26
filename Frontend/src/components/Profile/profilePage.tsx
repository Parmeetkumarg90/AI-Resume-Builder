import type { overallData } from "../../schema/authSchema";
import { Flex, message, Typography, Card, Button } from "antd";
import { RightOutlined, DownOutlined } from '@ant-design/icons'
import Meta from "antd/es/card/Meta";
import env from "../../config/env";
import { useNavigate, useParams } from "react-router";
import { GetRequest } from "../../serivces/auth";
import sessionStore from "../../store";
import React, { useEffect, useState } from "react";
import socket from "../../config/socket";

export default function ProfilePage({ allProfile, isCurrentLoggedInUserProfile }: { allProfile: overallData | null, isCurrentLoggedInUserProfile: boolean }) {
    const [profile, setProfile] = useState(allProfile);
    const [messageApi, contextHolder] = message.useMessage();
    const stage = sessionStore((state) => state.session?.Credential.stage);
    const { userId } = useParams();
    const navigate = useNavigate();

    async function handleProfileApproval() {
        if (!userId) {
            messageApi.error("Invalid Profile");
            return;
        }
        const result = await GetRequest(`${env.VITE_BACKEND_URL}/api/other/profile/approve/${userId}`);
        // console.log(result);
        if (result) {
            setProfile((prev) => prev ? { ...prev, isSendForApproval: 1 } : prev);
            messageApi.success(result.status);
        }
        else {
            messageApi.error("Error occured");
        }
    }

    async function handleChange() {
        if (!userId) {
            messageApi.error("Invalid Profile");
            return;
        }
        const result = await GetRequest(`${env.VITE_BACKEND_URL}/api/other/profile/change/${userId}`);
        if (result) {
            messageApi.success(result.status);
            if (stage) {
                sessionStore.getState().init();
                navigate('/');
            }
        }
        else {
            messageApi.error("Error occured");
        }
    }

    useEffect(() => {
        socket.on("approve", (data) => {
            if (data.id === sessionStore.getState().session?.Credential.userId) {
                messageApi.success("Profile has been approved");
                sessionStore.setState((state) => {
                    return {
                        ...state,
                        session: {
                            ...state.session!,
                            Credential: {
                                ...state.session!.Credential,
                                stage: 9,
                                dbStage: 9,
                            }
                        },
                        allProfileData: {
                            ...state.allProfileData,
                            isSendForApproval: 2,
                        }
                    }
                });
                navigate("/");
            }
        });
        socket.on("reject", (data) => {
            if (data.id === sessionStore.getState().session?.Credential.userId) {
                messageApi.error("Profile has been rejected");
                sessionStore.setState((state) => {
                    return {
                        ...state,
                        allProfileData: {
                            ...state.allProfileData,
                            isSendForApproval: 3
                        }
                    }
                });
                navigate("/");
            }
        });
        return () => {
            socket.off("approve");
            socket.off("reject");
        }
    }, []);

    return (
        <Card
            title="Profile Details"
            className="text-center w-full flex flex-col mt-5 p-2 rounded-xl bg-gray-100 shadow-lg border border-gray-300"
            hoverable
        >
            {contextHolder}
            <Flex className="flex flex-col md:flex-row my-2">
                <Card
                    hoverable
                    className="bg-gray-200 md:w-1/3 w-full p-5"
                    cover={<img alt="Profile Image" src={profile?.userImage} />}
                >
                    <Meta
                        title={profile?.firstName + " " + profile?.middleName + " " + profile?.lastName}
                        description={"Joined At: " + profile?.createdAt}
                    />
                </Card>
                <Card className="bg-gray-200 md:w-2/3 w-full my-2 md:my-0 mx-0 md:ml-5" hoverable>
                    <Flex className="flex flex-row flex-wrap my-5 justify-center items-center">
                        <Card title="Summary" variant="borderless" className="min-w-1/4 m-2">
                            {profile?.summary}
                        </Card>
                        <Card title="Born City" variant="borderless" className="min-w-1/4 m-2">
                            {profile?.bornCity}
                        </Card>
                        <Card title="Hometown" variant="borderless" className="min-w-1/4 m-2">
                            {profile?.homeTown}
                        </Card>
                        <Card title="Currently Living" variant="borderless" className="min-w-1/4 m-2">
                            {profile?.currentCity + " " + profile?.currentArea}
                        </Card>
                        <Card title="Frequently Lived City" variant="borderless" className="min-w-1/4 m-2">
                            {profile?.frequentCityLived}
                        </Card>
                        <Card title="Phone Number" variant="borderless" className="min-w-1/4 m-2">
                            {profile?.phoneNumber}
                        </Card>
                        <Card title="Email Address" variant="borderless" className="min-w-1/4 m-2">
                            {profile?.email}
                        </Card>
                    </Flex>
                </Card>
            </Flex>
            <Card hoverable className="bg-gray-200 my-2 text-center" title="Education">
                <Flex className="flex-col md:flex-row flex-wrap  justify-evenly gap-2">
                    <Card title="School" variant="borderless" className="w-fit">
                        {profile?.school?.map(each => {
                            return (
                                <Meta
                                    key={each.name}
                                    title={each.name}
                                    description={"Address: " + each.address}
                                />
                            )
                        })}
                    </Card>
                    <Card title="College" variant="borderless" className="w-fit">
                        {profile?.college?.map(each => {
                            return (
                                <React.Fragment key={each.name}>
                                    <Meta
                                        title={each.name}
                                        description={"Address: " + each.address}
                                    />
                                    <Typography.Paragraph className="my-2">
                                        Courses:
                                        {each.course.map(eachCourse =>
                                            <Typography key={eachCourse}>
                                                {eachCourse}
                                            </Typography>)
                                        }
                                    </Typography.Paragraph>
                                </React.Fragment>
                            )
                        })}
                    </Card>
                    <Card title="Early Life Tags" variant="borderless" className="w-fit">
                        {profile?.earlyTags?.map((skill) => {
                            return <Typography.Paragraph key={skill} className="text-left list-disc list-item">{skill}</Typography.Paragraph>
                        })}
                    </Card>
                </Flex>
            </Card>
            <Card className="bg-gray-200 w-full text-center my-2" hoverable title="Professional Details">
                <Flex className="w-full flex flex-col md:flex-row justify-center items-center md:justify-evenly">
                    <Card title={profile?.currentCompany?.name}>
                        {profile?.currentCompany?.role}
                    </Card>
                    {profile?.previousCompany?.map((company, index) => (
                        <React.Fragment key={index}>
                            {profile?.previousCompany?.length && index < profile?.previousCompany?.length &&
                                <>
                                    <RightOutlined className="md:block hidden" key={company.name} />
                                    <DownOutlined className="block md:hidden" key={company.role} />
                                </>
                            }
                            <Card title={company?.name}>
                                {company?.role}
                            </Card>
                        </React.Fragment>
                    ))}
                </Flex>
            </Card>
            <Card className="bg-gray-200 w-full text-center my-2" hoverable title="Skills">
                <Flex className="w-full flex flex-col md:flex-row justify-evenly gap-4">

                    <Card title="Skill Tags" variant="borderless" className="">
                        <Flex vertical className="w-full h-fit md:h-56 overflow-y-auto">
                            <ul className="list-disc list-inside text-left">
                                {profile?.skillTags?.map((skill) => (
                                    <li key={skill}>{skill}</li>
                                ))}
                            </ul>
                        </Flex>
                    </Card>
                    <Card title="Professional Life Tags" variant="borderless" className="">
                        <Flex vertical className="w-full h-fit md:h-56 overflow-y-auto">
                            <ul className="list-disc list-inside text-left">
                                {profile?.professionalTags?.map((skill) => (
                                    <li key={skill}>{skill}</li>
                                ))}
                            </ul>
                        </Flex>
                    </Card>
                    <Card title="Current Life Tags" variant="borderless" className="w-fit m-2">
                        <Flex vertical className="w-full h-fit md:h-56 overflow-y-auto">
                            <ul className="list-disc list-inside text-left">
                                {profile?.currentTags?.map((skill) => (
                                    <li key={skill}>{skill}</li>
                                ))}
                            </ul>
                        </Flex>
                    </Card>

                </Flex>
            </Card>

            <Card className="bg-gray-200 w-full my-2 text-center" title="Profile Recordings" hoverable>
                <Flex className="flex-col md:flex-row flex-nowrap  justify-evenly items-center">
                    <Card title="Early Life" variant="borderless" className="md:w-1/3 m-2">
                        <video src={env.VITE_BACKEND_URL + '/upload/' + profile?.earlyLifeRecording} controls />
                    </Card>
                    <Card title="Professional Life" variant="borderless" className="md:w-1/3 m-2">
                        <video src={env.VITE_BACKEND_URL + '/upload/' + profile?.professionalLifeRecording} controls />
                    </Card>
                    <Card title="Current Life" variant="borderless" className="md:w-1/3 m-2">
                        <video src={env.VITE_BACKEND_URL + '/upload/' + profile?.currentLifeRecording} controls />
                    </Card>
                </Flex>
            </Card>
            <Card className="bg-gray-200 w-full my-2 text-center" title="Social Accounts" hoverable>
                <Flex className="flex flex-col md:flex-row">
                    <Card title="LinkedIn" variant="borderless" className="md:w-1/3 m-2">
                        {
                            profile?.linkedinHandle ?
                                <Typography.Link href={profile?.linkedinHandle}>
                                    {profile?.linkedinHandle}
                                </Typography.Link>
                                : "Not Present"
                        }
                    </Card>
                    <Card title="Instagram" variant="borderless" className="md:w-1/3 m-2">
                        {
                            profile?.instagramHandle ?
                                <Typography.Link href={profile?.instagramHandle}>
                                    {profile?.instagramHandle}
                                </Typography.Link>
                                : "Not Present"
                        }
                    </Card>
                    <Card title="Twitter" variant="borderless" className="md:w-1/3 m-2">
                        {
                            profile?.twitterHandle ?
                                <Typography.Link href={profile?.twitterHandle}>
                                    {profile?.twitterHandle}
                                </Typography.Link>
                                : "Not Present"
                        }
                    </Card>
                    <Card title="Other" variant="borderless" className="md:w-1/3 m-2">
                        {
                            profile?.otherHandle ?
                                <Typography.Link href={profile?.otherHandle}>
                                    {profile?.otherHandle}
                                </Typography.Link>
                                : "Not Present"
                        }
                    </Card>
                </Flex>
            </Card>
            <Card className="bg-gray-200 w-full my-2 text-center" title="Miscellaneous" hoverable>
                <Flex className="flex flex-col md:flex-row">
                    <Card title="Inspiration" variant="borderless" className="md:w-1/3 m-2">
                        {
                            profile?.inspiring ? profile?.inspiring : "Not Present"
                        }
                    </Card>
                    <Card title="Quote" variant="borderless" className="md:w-1/3 m-2">
                        {
                            profile?.quote ? profile?.quote : "Not Present"
                        }
                    </Card>
                    <Card title="Link Content" variant="borderless" className="md:w-1/3 m-2">
                        {
                            profile?.linksContent ? profile?.linksContent : "Not Present"
                        }
                    </Card>
                </Flex>
            </Card>
            {isCurrentLoggedInUserProfile && profile?.isSendForApproval === 1 &&
                <Card className="bg-gray-200 w-full my-5" hoverable>
                    {
                        <Flex className="w-full flex flex-col md:flex-row justify-center items-center gap-6">
                            <Button loading={true} className="text-xl hover:bg-transparent hover:text-black hover:border-0 ">Sent to admin for Processing</Button>
                        </Flex>
                    }
                </Card>
            }
            {profile?.isSendForApproval === 2 &&
                <Card className="bg-gray-200 w-full my-5" hoverable>
                    {
                        <Flex className="w-full flex flex-col md:flex-row justify-center items-center gap-6">
                            <Typography.Title level={2} className="text-green-500 font-bold">
                                &#127881; Profile Approved &#127881;
                            </Typography.Title>
                        </Flex>
                    }
                </Card>
            }
            {profile?.isSendForApproval === 3 &&
                <Card className="bg-gray-200 w-full my-5" hoverable>
                    {
                        <Flex className="w-full flex flex-col md:flex-row justify-center items-center gap-6">
                            <Typography.Title level={2} className="text-red-500 font-bold">Rejected</Typography.Title>
                        </Flex>
                    }
                </Card>
            }
            {isCurrentLoggedInUserProfile &&
                <Card className="bg-gray-200 w-full my-5" hoverable>
                    {
                        <Flex className="w-full flex flex-col md:flex-row justify-center items-center gap-6">
                            {(profile?.isSendForApproval === 0 || profile?.isSendForApproval === 3) && (stage === 8) && <Button onClick={handleProfileApproval} className="bg-blue-500 py-5 px-10 text-white hover:bg-white hover:text-blue-500 transition-all duration-700">
                                Send For Approval
                            </Button>
                            }
                            {(profile?.isSendForApproval === 0 || profile?.isSendForApproval === 3) && (stage === 8) && <Button onClick={handleChange} danger className="bg-red-500 text-white py-5 px-10 hover:bg-white hover:text-red-500 transition-all duration-700">
                                Go Back For Change
                            </Button>
                            }
                        </Flex>
                    }
                </Card>
            }
        </Card>
    );
}