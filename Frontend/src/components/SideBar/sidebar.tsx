import { Layout, Flex, Button, Menu, message, Typography } from "antd";
import { useState, type ReactNode, useEffect } from "react";
import { DatabaseFilled, UserOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from "react-router";
import { logout } from "../../serivces/auth";
import type { sessionData } from "../../schema/authSchema";
import sessionStore from "../../store";

const { Sider } = Layout

type Props = {
    children: ReactNode;
};

const items = [
    { key: 'users', icon: <UserOutlined />, label: 'Users' },
    { key: 'profiles', icon: <DatabaseFilled />, label: 'Profiles' },
    { key: 'community', icon: <DatabaseFilled />, label: 'Community' },
]

const SideBar: React.FC<Props> = ({ children }) => {
    const [messageApi, contextHolder] = message.useMessage();
    const [currentUser, setCurrentUser] = useState<sessionData | null>(null);
    const navigate = useNavigate();
    const currentLocation = window.location.pathname.split("/");

    async function setUser() {
        setCurrentUser(sessionStore.getState().session);
    }

    useEffect(() => {
        setUser();
    });

    async function handleLogOut() {
        try {
            const result = await logout();
            messageApi.success(result?.status);
            setTimeout(() => {
                navigate('/login');
            }, 1000);
        }
        catch (e: any) {
            messageApi.error(e?.response?.data?.status);
            console.log(e);
        }
    }

    return (
        <>
            {contextHolder}
            <Layout className="h-screen">
                {/* SideBar for Every Page */}
                <Sider
                    className="w-1/4"
                    trigger={null}
                // collapsible
                // collapsed={collapsed}
                >
                    <Flex vertical justify="space-between" align="center" className="h-full bg-slate-900">
                        <Flex className="flex flex-col justify-between">
                            <Typography className="h-1/4 text-white font-bold text-center mt-5 text-lg">AI Resume Builder</Typography>
                            <Flex className="flex flex-col justify-between my-5">
                                <Menu
                                    theme="dark"
                                    mode="inline"
                                    defaultSelectedKeys={[currentLocation[currentLocation.length - 1]]}
                                    items={items}
                                    style={{ flexGrow: 1 }}
                                    onClick={({ key }) => {
                                        switch (key) {
                                            case 'users':
                                                navigate('/admin/users');
                                                break;
                                            case 'profiles':
                                                navigate('/admin/profiles');
                                                break;
                                            case 'community':
                                                navigate('/admin/community');
                                                break;
                                            default:
                                                break;
                                        }
                                    }}
                                />
                            </Flex>
                        </Flex>
                        <Flex className="flex flex-col justify-center m-5 text-center">
                            {/* <Typography className="text-white text-xs">{currentUser?.Credential?.userId}</Typography> */}
                            <Typography className="text-white text-xs m-2">{currentUser?.Credential?.email}</Typography>
                            <Button type="primary" onClick={() => { handleLogOut(); }}>Logout</Button>
                        </Flex>
                    </Flex>
                </Sider>

                {/* Content Area */}
                <Layout className="w-3/4 h-full max-h-[100vh] overflow-scroll">
                    {children}
                </Layout>
            </Layout>
        </>
    );
}

export default SideBar;