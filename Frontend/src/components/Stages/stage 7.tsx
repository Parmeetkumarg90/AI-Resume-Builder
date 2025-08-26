import { Form, Flex, Typography, Input, Button, message, Select } from "antd";
import type { stage7FormInterface } from "../../schema/stageSchema";
import { PostRequest } from "../../serivces/auth";
import env from "../../config/env";
import sessionStore from "../../store";
import type { overallData } from "../../schema/authSchema";
import { useNavigate } from "react-router";

export default function Stage7() {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();
    const allProfileData = sessionStore.getState().allProfileData;
    const { session, updateStage, updateDBStage, updateAllProfileData } = sessionStore.getState();

    async function handleStage7FormSubmission(values: stage7FormInterface) {
        if (session?.Credential.stage) {
            const result = await PostRequest(`${env.VITE_BACKEND_URL}/api/user/stage357`, { ...values, stage: session?.Credential.stage });
            if (result) {
                const allData: overallData = { ...values };
                updateStage(session?.Credential?.stage + 1);
                updateDBStage(session?.Credential.stage + 1);
                updateAllProfileData(allData);
                messageApi.success(result.status);
                navigate(`/profile/${session?.Credential?.userId}`);
            }
            else {
                form.resetFields();
                messageApi.error("Error in data Upload");
            }
        }
        else {
            messageApi.error("Invalid Stage for Data Submission");
        }
    }

    return (
        <Flex
            vertical
            className="m-4 p-6 rounded-xl bg-gray-100 shadow-lg border border-gray-300"
        >
            {contextHolder}
            <Typography.Title
                level={2}
                className="text-center border-b-2 border-gray-400 pb-2 mb-6 flex flex-col justify-between lg:flex-row items-center"
            >
                Current Life Extracted Data Form
            </Typography.Title>
            <Form
                form={form}
                name="stage1Form"
                initialValues={{ ...allProfileData }}
                onFinish={handleStage7FormSubmission}
                layout="vertical"
                className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full font-medium"
            >

                <Form.Item<stage7FormInterface>
                    label="Summary About You(Atleast 100 words)"
                    name="summary"
                    rules={[{ required: true, message: 'Summary is required!' }]}
                >
                    <Input.TextArea rows={12}
                        placeholder="Enter short summary"
                        className="w-full rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 overflow-y-hidden"
                    />
                </Form.Item>

                <Typography.Title level={5} className="rounded-lg border-2 border-gray-500 text-center p-5">Current Company/Organisation
                    <Form.Item<stage7FormInterface>
                        label="Company Name"
                        name={["currentCompany", "name"]}
                        rules={[{ required: true, message: 'School Name is required!' }]}
                    >
                        <Input
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 
                        shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 transition"
                            placeholder="Enter your School Name"
                        />
                    </Form.Item>
                    <Form.Item<stage7FormInterface>
                        label="Your Role"
                        name={["currentCompany", "role"]}
                        rules={[{ required: true, message: 'School Address is required!' }]}
                    >
                        <Input
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 
                        shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 transition"
                            placeholder="Enter your School Address"
                        />
                    </Form.Item>
                </Typography.Title>

                <Form.Item<stage7FormInterface>
                    label="Most frequently lived city"
                    name="frequentCityLived"
                    rules={[{ required: true, message: 'City is required!' }]}
                >
                    <Input
                        placeholder="Enter city name"
                        className="w-full rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                    />
                </Form.Item>

                <Form.Item<stage7FormInterface>
                    label="Tags"
                    name="currentTags"
                    rules={[{ required: true, message: 'Tags is required!' }]}
                >
                    <Select
                        mode="tags"
                        placeholder="Type and press enter to add a tag"
                        className="w-full rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                    />
                </Form.Item>

                <Form.Item<stage7FormInterface>
                    label="Skill Tags"
                    name="skillTags"
                    rules={[{ required: true, message: 'Skill Tags is required!' }]}
                >
                    <Select
                        mode="tags"
                        placeholder="Type and press enter to add a tag"
                        className="w-full rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                    />
                </Form.Item>

                <Flex className="col-span-1 md:col-span-2 flex justify-center">
                    <Button
                        type="primary"
                        htmlType="submit"
                        className="rounded-lg bg-indigo-600 px-6 py-2 text-white font-semibold 
                        shadow-md hover:bg-indigo-700 hover:scale-105 transition"
                    >
                        Submit
                    </Button>
                </Flex>
            </Form>
        </Flex>
    );
}