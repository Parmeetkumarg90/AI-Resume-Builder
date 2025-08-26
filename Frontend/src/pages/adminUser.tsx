import { Flex, Typography, Button, message, Dropdown, Space } from "antd";
import { DownOutlined } from '@ant-design/icons';
import type { newUserInterface, userCreationSchema } from "../schema/userSchema";
import CustomTable from "../components/CustomTable/customTable";
import { useEffect, useState } from "react";
import { DeleteRequest, GetRequest, PostRequest } from "../serivces/auth";
import env from "../config/env";
import NewUserModal from "../components/Modal/newUser";

export function AdminUser() {
    const tableHeader = [
        { title: "Sr. No.", dataIndex: "rowIndex", key: "srNo" },
        { title: "Email", dataIndex: "email", key: "email" },
        { title: "Mobile Number", dataIndex: "mobileNumber", key: "mobileNumber" },
        { title: "Created At", dataIndex: "createdAt", key: "createdAt" },
        {
            title: "Status",
            dataIndex: "isAccountActive",
            key: "isAccountActive",
            render: (val: boolean) =>
                val ? (
                    <Typography className="text-green-500 font-bold">Active</Typography>
                ) : (
                    <Typography className="text-red-500 font-bold">Not Active</Typography>
                ),
        },
        {
            title: "Action",
            key: "action",
            render: (_: any, record: userCreationSchema) => (
                <Dropdown menu={{
                    items: [
                        { key: "accountActivation", label: `${record.isAccountActive ? "Deactivate" : "Activate"}` },
                        { key: "delete", label: "Delete" }
                    ],
                    onClick: ({ key }: { key: string }) => {
                        if (key === "accountActivation") {
                            handleAccountActivation(record.id);
                        }
                        else if (key === "delete") {
                            handleAccountDeletion(record.id);
                        }
                        else {
                            messageApi.info("Invalid Option");
                        }
                    },
                }}>
                    <Typography.Link>
                        <Space>
                            Select
                            <DownOutlined />
                        </Space>
                    </Typography.Link>
                </Dropdown >
            ),
        },
    ];

    const [allUsers, setAllUsers] = useState<userCreationSchema[]>([]);
    const [messageApi, contextHolder] = message.useMessage();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isNewUserModalOpen, setIsNewUserModalOpen] = useState<boolean>(false);

    async function handleAccountActivation(id: string) {
        let result = await GetRequest(`${env.VITE_BACKEND_URL}/api/admin/user/${id}`);
        // console.log(result);
        if (result) {
            setAllUsers((prevData) =>
                prevData.map((eachUser) => eachUser.id === id
                    ? { ...eachUser, isAccountActive: !eachUser.isAccountActive }
                    : eachUser)
            );
            messageApi.success(result.status);
        }
        else {
            messageApi.error("Error while deactivating accounct");
        }
    }

    async function handleAccountDeletion(id: string) {
        let result = await DeleteRequest(`${env.VITE_BACKEND_URL}/api/admin/user/${id}`);
        // console.log(result);
        if (result) {
            setAllUsers((prevData) =>
                prevData.filter((eachUser) => eachUser.id !== id)
            );
            messageApi.success(result.status);
        }
        else {
            messageApi.error("Error while deactivating accounct");
        }
    }

    async function onNewUserSubmit({ email, mobileNumber }: newUserInterface) {
        let user = await PostRequest(`${env.VITE_BACKEND_URL}/api/admin/user`, { email, mobileNumber });

        if (!user) {
            messageApi.error("User Creation Problem");
        }
        else {
            messageApi.success(user.status);
            setAllUsers((prevData) => [user.data, ...prevData]);
            setIsNewUserModalOpen(false);
        }
    }

    async function fetchAllUsers() {
        let users = await GetRequest(`${env.VITE_BACKEND_URL}/api/admin/getAllUsers`);
        setAllUsers(users?.allUsers || []);
        setIsLoading(false);
    }

    useEffect(() => {
        fetchAllUsers();
    }, []);

    return (
        <>
            {contextHolder}
            <Flex vertical className="w-full p-5">
                <Flex className="flex justify-between border-b-4 p-2 border-blue-200">
                    <Typography.Title level={4}>Admin User Creation Panel</Typography.Title>
                    <Button className="bg-blue-500 text-white text-xl px-5 py-5 hover:text-blue-500 hover:bg-white transition duration-700" onClick={() => { setIsNewUserModalOpen(true) }}>New User</Button>
                </Flex>
                <CustomTable data={allUsers} headers={tableHeader} loading={isLoading} />
                {isNewUserModalOpen && <NewUserModal open={isNewUserModalOpen} onClose={() => { setIsNewUserModalOpen(false); }} onSubmit={onNewUserSubmit} />}
            </Flex>
        </>
    );
}