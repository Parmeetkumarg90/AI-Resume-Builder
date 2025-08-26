import { Flex, Typography, message, Dropdown, Space } from "antd";
import { DownOutlined } from '@ant-design/icons';
import type { userCreationSchema } from "../schema/userSchema";
import CustomTable from "../components/CustomTable/customTable";
import { useEffect, useState } from "react";
import { GetRequest } from "../serivces/auth";
import env from "../config/env";
import socket from "../config/socket";
import sessionStore from "../store";

export function AdminProfile() {
    const [allProfiles, setAllProfiles] = useState<userCreationSchema[]>([]);
    const [messageApi, contextHolder] = message.useMessage();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const tableHeader = [
        { title: "Sr. No.", dataIndex: "rowIndex", key: "srNo" },
        { title: "Email", dataIndex: "email", key: "email" },
        { title: "Mobile Number", dataIndex: "mobileNumber", key: "mobileNumber" },
        { title: "Created At", dataIndex: "createdAt", key: "createdAt" },
        {
            title: "Status",
            dataIndex: "isSendForApproval",
            key: "isSendForApproval",
            render: (val: number, record: userCreationSchema) =>
                val === 2 ? (
                    <Typography className="text-green-500 font-bold">Approved</Typography>
                ) : (
                    <>
                        {
                            record.isSendForApproval === 3 ?
                                <Typography className="text-red-500 font-bold">
                                    Rejected
                                </Typography> :
                                <Typography className="text-blue-500 font-bold">
                                    Not Approved
                                </Typography>
                        }
                    </>
                ),
        },
        {
            title: "Action",
            key: "action",
            render: (_: any, record: userCreationSchema) => (
                <Dropdown menu={{
                    items: [
                        { key: "viewProfile", label: "View Profile" },
                        { key: "approve", label: "Approve" },
                        { key: "reject", label: "Reject" }
                    ].filter((item) => {
                        if (item.key === "approve" || item.key === "reject") {
                            return record.isSendForApproval !== 2 && record.isSendForApproval !== 3;
                        }
                        else {
                            return true;
                        }
                    }),
                    onClick: ({ key }: { key: string }) => {
                        if (key === "approve") {
                            handleProfileApproval(record.id);
                        }
                        else if (key === "reject") {
                            handleProfileReject(record.id);
                        }
                        else if (key === "viewProfile") {
                            window.open(`/profile/${record.id}`, "_blank");
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

    async function handleProfileReject(id: string) {
        let result = await GetRequest(`${env.VITE_BACKEND_URL}/api/admin/reject/${id}`);
        setIsLoading(true);
        if (result) {
            setIsLoading(false);
            setAllProfiles((profile) => (
                profile.map(item => {
                    if (item.id === id) {
                        return { ...item, isSendForApproval: 3 };
                    }
                    return item;
                })
            ));
            messageApi.success(result.status);
        }
        else {
            setIsLoading(false);
            messageApi.error("Request has been failed");
        }
    }

    async function handleProfileApproval(id: string) {
        let result = await GetRequest(`${env.VITE_BACKEND_URL}/api/admin/approve/${id}`);
        setIsLoading(true);
        if (result) {
            setIsLoading(false);
            setAllProfiles((profile) => (
                profile.map(item => {
                    if (item.id === id) {
                        return { ...item, isSendForApproval: 2 };
                    }
                    return item;
                })
            ));
            messageApi.success(result.status);
        }
        else {
            setIsLoading(false);
            messageApi.error("Request has been failed");
        }
    }

    async function fetchAllProfiles() {
        let users = await GetRequest(`${env.VITE_BACKEND_URL}/api/admin/getallProfiles`);
        console.log(users)
        setAllProfiles(users?.allProfiles || []);
        setIsLoading(false);
    }

    useEffect(() => {
        fetchAllProfiles();
        socket.on('sendForApproval', (socket) => {
            if (socket.id === sessionStore.getState().session?.Credential.userId) {
                fetchAllProfiles();
                messageApi.success("Someone send their profile for approval");
            }
        });
        return () => {
            socket.off('sendForApproval');
        }
    }, []);

    return (
        <>
            {contextHolder}
            <Flex vertical className="w-full p-5">
                <Flex className="flex justify-between border-b-4 p-2 border-blue-200">
                    <Typography.Title level={4}>Admin Profile Approval Panel</Typography.Title>
                </Flex>
                <CustomTable data={allProfiles} headers={tableHeader} loading={isLoading} />
            </Flex>
        </>
    );
}