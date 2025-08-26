import { Flex, Button, Typography } from "antd";
import { useNavigate } from "react-router";

export function NotFoundPage({ reason }: { reason: string }) {
    const navigate = useNavigate();
    return (
        <Flex vertical className="h-screen text-center items-center bg-slate-800" justify="center">
            <Typography className="text-white font-bold text-4xl">{reason}</Typography>
            <Button type="primary" className="bg-blue-500 p-5 w-1/3 m-5 " onClick={() => { navigate('/') }}>Back Home</Button>
        </Flex>
    );
}