import { Form, Input, Button, Typography, Flex, message } from 'antd';
import type { FormProps } from 'antd';
import type { loginFields } from '../schema/authSchema';
import { loginRequest } from '../serivces/auth';
import { useNavigate } from 'react-router';
import sessionStore from '../store';
import { useEffect } from 'react';
import { checkAuth } from '../utils/authCheck';

export default function Login() {
    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate();
    const onSubmit: FormProps<loginFields>['onFinish'] = async (values) => {
        const result = await loginRequest(values);
        if (result.status === 200) {
            messageApi.success(result?.data?.status);
            let set = setTimeout(() => {
                clearTimeout(set);
                navigate('/');
            }, 2000);
            await sessionStore.getState().init();
        }
        else {
            messageApi.error(result?.response?.data?.status);
        }
    }

    useEffect(() => {
        if (checkAuth()) { navigate('/'); }
    });

    return (
        <>
            {contextHolder}
            <Flex
                align="center"
                justify="center"
                className="w-full h-screen  bg-[#E8EFF2] px-4"
                style={{
                    width: "100%",
                    height: "200px",
                    backgroundColor: "black",
                    backgroundImage: "radial-gradient(circle at 1px 1px, black 1px, transparent 1px)",
                    backgroundSize: "10px 10px"
                }}
            >
                <Flex
                    vertical
                    align="center"
                    className="w-full sm:w-4/5 md:w-3/5 lg:w-2/5 xl:w-2/6 h-auto min-h-[70%] p-6 m:p-8 rounded-2xl shadow-2xl bg-[#404041] flex flex-col border border-white/20"
                >
                    <Typography.Title
                        level={1}
                        className="text-[#d2e3eb] border-b-4 w-full text-center pb-2 font-extrabold tracking-wide text-xl sm:text-2xl md:text-3xl lg:text-4xl"
                    >
                        AI Resume Builder
                    </Typography.Title>

                    <Form
                        layout="vertical"
                        name="loginForm"
                        initialValues={{ email: "", password: "" }}
                        onFinish={onSubmit}
                        className="w-full flex flex-col justify-evenly  rounded-lg items-center gap-2 py-6"
                    >
                        <Form.Item<loginFields>
                            label="Email"
                            name="email"
                            rules={[{ required: true, message: "Please fill your email here" }]}
                            className="w-full sm:w-4/5 [&_.ant-form-item-label>label]:text-white"
                        >
                            <Input className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-[#E8EFF2] focus:border-[#5465FF]" />
                        </Form.Item>


                        <Form.Item<loginFields>
                            label="Password"
                            name="password"
                            rules={[{ required: true, message: "Please fill your password here" }]}
                            className="w-full sm:w-4/5 [&_.ant-form-item-label>label]:text-white"
                        >
                            <Input.Password className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-[#E8EFF2] focus:border-[#5465FF]" />
                        </Form.Item>

                        <Button
                            type="default"
                            className="my-2 bg-[#E8EFF2] text-[#5465FF] py-3 font-semibold rounded-lg shadow-md hover:bg-white hover:scale-105 transition-all duration-300"
                            onClick={() => navigate("/forgotPassword")}
                        >
                            Forgot Password?
                        </Button>

                        <Form.Item label={null} className="w-full sm:w-4/5">
                            <Button
                                type="primary"
                                htmlType="submit"
                                className="w-full bg-[#E8EFF2] text-[#5465FF] py-3 font-semibold rounded-lg shadow-md hover:bg-white hover:scale-105 transition-all duration-300"
                            >
                                Login
                            </Button>
                        </Form.Item>

                        <Form.Item label={null} className="w-full sm:w-4/5">
                            <Button
                                type="default"
                                className="w-full bg-[#E8EFF2] text-[#5465FF] py-3 font-semibold rounded-lg shadow-md hover:bg-white hover:scale-105 transition-all duration-300"
                                onClick={() => navigate("/contactAdmin")}
                            >
                                Contact Admin For An Account
                            </Button>
                        </Form.Item>
                    </Form>
                </Flex>
            </Flex>
        </>
    );
}