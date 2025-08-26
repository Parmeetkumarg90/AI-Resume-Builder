import { Form, Flex, Typography, Input, Button, message, Select, Space } from "antd";
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import type { stage5FormInterface } from "../../schema/stageSchema";
import { PostRequest } from "../../serivces/auth";
import env from "../../config/env";
import sessionStore from "../../store";
import type { overallData } from "../../schema/authSchema";

export default function Stage5() {
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();
    const allProfileData = sessionStore.getState().allProfileData;
    const { session, updateStage, updateDBStage, updateAllProfileData } = sessionStore.getState();

    async function handleStage5FormSubmission(values: stage5FormInterface) {
        if (session?.Credential.stage) {
            const result = await PostRequest(`${env.VITE_BACKEND_URL}/api/user/stage357`, { ...values, stage: session?.Credential.stage });
            if (result) {
                const allData: overallData = { ...values };
                updateStage(session?.Credential?.stage + 1);
                updateDBStage(session?.Credential.stage + 1);
                updateAllProfileData(allData);
                messageApi.success(result.status);
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
                Professional Life Extracted Data Form
            </Typography.Title>
            <Form
                form={form}
                name="stage1Form"
                initialValues={{ ...allProfileData }}
                onFinish={handleStage5FormSubmission}
                layout="vertical"
                className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full font-medium"
            >
                <Form.List name="previousCompany">
                    {(fields, { add, remove }) => (
                        <Form.Item>
                            {fields.map(({ key, name, ...restField }) => (
                                <Space
                                    key={key}
                                    className="flex flex-col md:flex-row gap-3 mb-4 items-center justify-center"
                                    align="start"
                                >
                                    <Form.Item
                                        {...restField}
                                        name={[name, "name"]}
                                        rules={[{ required: true, message: "Company Name is required" }]}
                                        className="flex-1"
                                    >
                                        <Input
                                            placeholder="Company Name"
                                            className="w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 transition"
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        {...restField}
                                        name={[name, "role"]}
                                        rules={[{ required: true, message: "Role is required" }]}
                                        className="flex-1"
                                    >
                                        <Input
                                            placeholder="Role"
                                            className="w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 transition"
                                        />
                                    </Form.Item>

                                    <MinusCircleOutlined
                                        onClick={() => remove(name)}
                                        className="text-red-500 text-xl mb-6 cursor-pointer"
                                    />
                                </Space>
                            ))}

                            <Form.Item>
                                <Button
                                    type="dashed"
                                    onClick={() => add()}
                                    block
                                    icon={<PlusOutlined />}
                                    className="rounded-lg border border-indigo-500 text-indigo-500 hover:bg-indigo-50 transition"
                                >
                                    Add Company
                                </Button>
                            </Form.Item>
                        </Form.Item>
                    )}
                </Form.List>
                <Form.Item<stage5FormInterface>
                    label="Tags"
                    name="professionalTags"
                    rules={[{ required: true, message: 'Tags is required!' }]}
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
