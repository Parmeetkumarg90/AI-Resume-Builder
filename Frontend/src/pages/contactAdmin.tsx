import { Typography, Flex, Card, Row, Col, Button } from 'antd';
import type { adminInterface } from '../schema/authSchema';
import { GetRequest } from '../serivces/auth';
import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import env from '../config/env';

export default function ContactAdmin() {
    // const [messageApi, contextHolder] = message.useMessage();
    let [allAdmins, setAdmins] = useState<adminInterface[] | null>(null);
    let [loading, setIsLoading] = useState<boolean>(true);
    const navigate = useNavigate();

    async function fetchAdmin() {
        const admins = await GetRequest(`${env.VITE_BACKEND_URL}/api/auth/getAllAdmin`);
        console.log(admins);
        setAdmins(admins?.allAdmins);
        setIsLoading(false);
    }

    useEffect(() => {
        fetchAdmin();
    }, []);

    if (loading) {
        return <>Loading Contact Admin</>;
    }

    return (
        <>
            {/* {contextHolder} */}
            <Flex align='center' justify='center' className='h-screen bg-[#E8EFF2]'
                style={{
                    width: "100%",
                    height: "200px",
                    backgroundColor: "black",
                    backgroundImage: "radial-gradient(circle at 1px 1px, black 1px, transparent 1px)",
                    backgroundSize: "10px 10px"
                }
                }>
                < Flex vertical align='center' className='w-8/12 h-5/6 p-5 my-5 rounded-lg bg-[#404041]'>
                    <Typography.Title level={1} className='rounded-lg text-[#E8EFF2] border-b-4 w-full text-center font-normal pb-5'>
                        All Admins
                    </Typography.Title>
                    <Button className='bg-[#5465FF] text-[#E8EFF2] p-5'
                        onClick={() => navigate('/login')}>
                        Back To Login
                    </Button>
                    <Row gutter={16} className='w-full mt-5 overflow-auto flex justify-center'>
                        {allAdmins ?
                            allAdmins?.map((admin) => (
                                <Col span={8} key={admin?.id} className='m-2'>
                                    <Card title={admin?.email}
                                        className='bg-[#A5DDF3]'
                                        variant='borderless'
                                    >
                                        {admin?.mobileNumber}
                                    </Card>
                                </Col>
                            )) :
                            <Typography.Text className='m-5'>
                                Currently There no admin present
                            </Typography.Text>
                        }</Row>
                </Flex>
            </Flex >
        </>
    );
}