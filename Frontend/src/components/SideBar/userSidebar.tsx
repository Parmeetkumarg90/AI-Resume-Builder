import React, { useEffect, useState } from "react";
import { Layout, Typography, Dropdown, message, Flex, Avatar, Spin } from 'antd';
import { DownCircleFilled, UserOutlined, ArrowDownOutlined, CheckOutlined } from '@ant-design/icons'
import { useNavigate } from "react-router";
import sessionStore from "../../store";
import { logout } from "../../serivces/auth";

const { Header, Content } = Layout;

export default function TopBar({ children }: { children: React.ReactNode }) {
    const stage = sessionStore((state) => state.session?.Credential.stage);
    const userId = sessionStore.getState().session?.Credential.userId;
    const dbStage = sessionStore.getState().session?.Credential?.dbStage;
    const email = sessionStore.getState().session?.Credential.email;
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    // const stage = sessionStore.getState().session?.Credential.stage;

    useEffect(() => {
        // if (dbStage && dbStage > 7) {
        //     navigate("/profile");
        // }
        setIsLoading(true);
        const timer = setTimeout(() => {
            clearTimeout(timer);
            setIsLoading(false);
        }, 500);
    }, [stage]);

    const menuItems = [
        { key: "profile", label: "Profile" },
        { key: "community", label: "Community" },
    ];

    const profileMenuItems = [
        { key: "email", label: `${email}` },
        { key: "logout", label: "Logout" },
    ];

    function handleMenuClick({ key }: { key: string }) {
        if (key === 'profile') {
            navigate(`/profile/${userId}`);
        }
        else if (key === 'community') {
            navigate('/community');
        }
        else {
            messageApi.info("Invalid Menu Option Selection");
        }
    }

    function handleProfileMenuClick({ key }: { key: string }) {
        if (key === 'logout') {
            try {
                logout();
                messageApi.success("Logout Success");
                let logoutTime = setTimeout(() => {
                    clearTimeout(logoutTime);
                    navigate('/');
                }, 1000);
            }
            catch (e: any) {
                messageApi.error("Logout Failed");
            }
        }
        else if (key === 'email') {
            messageApi.info("Currently LoggedIn Account");
        }
        else {
            messageApi.info("Invalid Menu Option Selection");
        }
    }

    function handleStageNavigation(newStage: number) {
        if (dbStage && dbStage >= newStage) {
            sessionStore.getState().updateStage(newStage);
        }
    }

    return (
        <Layout className="min-h-screen bg-gray-50">
            {contextHolder}
            <Header className="w-full flex justify-between items-center px-6 py-3 bg-gradient-to-r from-blue-800 to-indigo-500 shadow-xl backdrop-blur-md">
                <Typography.Title
                    level={2}
                    className="text-white m-0 cursor-pointer rounded-b-full rounded-r-full transition-all duration-500 transform hover:scale-105"
                    onClick={() => navigate('/')}
                >
                    Resume Builder
                </Typography.Title>

                <Flex className={`w-1/12 flex flex-row ${dbStage && dbStage > 7 ? "justify-between" : "justify-end"} gap-3`}>
                    <Dropdown
                        placement="bottomRight"
                        menu={{ items: profileMenuItems, onClick: handleProfileMenuClick }}
                        arrow
                    >
                        <Avatar
                            icon={<UserOutlined />}
                            className="text-3xl text-white hover:text-blue-300 transition-all duration-300 transform hover:scale-110"
                        />
                    </Dropdown>
                    {dbStage && dbStage > 7 &&
                        <Dropdown
                            placement="bottomRight"
                            menu={{ items: menuItems, onClick: handleMenuClick }}
                            arrow
                        >
                            <DownCircleFilled className="text-3xl text-white hover:text-yellow-300 transition-all duration-300 transform hover:scale-110" />
                        </Dropdown>}
                </Flex>
            </Header>

            <Content className="w-full m-auto flex flex-row justify-between">
                {dbStage && dbStage > 1 && dbStage <= 7 &&
                    <Flex className="w-2/6 md:w-fit flex flex-col justify-evenly text-white rounded-br-xl py-4 mb-6 px-0 h-fit text-center items-center font-normal bg-gradient-to-b from-blue-800 to-indigo-500 shadow-xl backdrop-blur-md sm:font-bold">
                        Complete All Stages
                        {[1, 2, 3, 4, 5, 6, 7].map((eachStage) => (
                            <React.Fragment key={eachStage}>
                                <Flex className="w-full flex flex-row justify-center items-center">
                                    <Typography.Paragraph className="font-normal sm:font-bold text-white p-1 m-0 w-1/2">
                                        {eachStage === 1 && "Basic Details"}
                                        {eachStage === 2 && "Early Life Recording"}
                                        {eachStage === 3 && "Early Life Details"}
                                        {eachStage === 4 && "Professional Life Recording"}
                                        {eachStage === 5 && "Professional Life Details"}
                                        {eachStage === 6 && "Current Life Recording"}
                                        {eachStage === 7 && "Current Life Details"}
                                    </Typography.Paragraph>
                                    <Typography.Paragraph
                                        onClick={() => handleStageNavigation(eachStage)}
                                        className={`m-5 p-0 
                                        w-8 h-8 flex justify-center items-center rounded-full font-bold transition-all duration-500 ${stage === eachStage ? 'bg-gradient-to-r from-red-500 to-pink-500 shadow-lg scale-125' : 'bg-blue-500'} ${dbStage && dbStage >= eachStage ? 'cursor-pointer hover:bg-blue-600 hover:scale-110' : 'opacity-50 cursor-not-allowed'} text-white`}
                                    >
                                        {dbStage && dbStage > eachStage ? <CheckOutlined /> : eachStage}
                                    </Typography.Paragraph>

                                </Flex>
                                {eachStage < 7 &&
                                    <Flex className="m-0 p-0 text-gray-400 font-bold text-xl animate-pulse flex items-center justify-center">
                                        <ArrowDownOutlined className="m-0 p-0" />
                                    </Flex>
                                }
                            </React.Fragment>
                        ))}
                    </Flex>
                }
                <Layout className={`${dbStage && dbStage > 1 && dbStage <= 7 ? "w-11/12 ml-5" : "w-full"} rounded-xl p-6 bg-white shadow-lg hover:shadow-2xl transition-shadow duration-500`}>
                    <Spin tip="Loading" spinning={isLoading} size="large">
                        {children}
                    </Spin>
                </Layout>

            </Content >
        </Layout >
    );
}