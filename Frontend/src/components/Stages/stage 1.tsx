import { Form, Flex, Typography, Input, Button, message, Image, Upload } from "antd";
import { UploadOutlined } from '@ant-design/icons';
import type { stage1FormInterface } from "../../schema/stageSchema";
import { PostRequest } from "../../serivces/auth";
import env from "../../config/env";
import sessionStore from "../../store";
import type { overallData } from "../../schema/authSchema";

export default function Stage1() {
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();
    const allProfileData = sessionStore.getState().allProfileData;

    async function handleStage1FormSubmission(values: stage1FormInterface) {
        const formData = new FormData();
        Object.entries(values)
            .forEach(([key, value]: any) => {
                if (key != "userImage" && value) {
                    formData.append(key, value);
                }
            })
        // console.log(values?.userImage?.fileList?.[0].originFileObj);
        if (values?.userImage?.fileList?.[0].originFileObj) {
            formData.append("userImage", values?.userImage?.fileList?.[0].originFileObj);
        }
        const result = await PostRequest(`${env.VITE_BACKEND_URL}/api/user/stage1`, formData);
        if (result) {
            const allData: overallData = { ...values };
            const { session, updateStage, updateDBStage, updateAllProfileData } = sessionStore.getState();
            if (session?.Credential.stage) {
                if (allData.userImage.fileList?.[0].originFileObj.name) {
                    allData.userImage = `${env.VITE_BACKEND_URL}/upload/${allData.userImage.fileList?.[0].originFileObj.name}`;
                }
                updateStage(session?.Credential?.stage + 1);
                updateDBStage(session?.Credential?.stage + 1);
                updateAllProfileData(allData);
            }
            messageApi.success(result.status);
        }
        else {
            messageApi.error("Error in form Submission");
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
                Basic Detail Fill-Up Form
                <Image src={allProfileData?.userImage} className="rounded-full w-full lg:w-50 lg:h-20" />
            </Typography.Title>
            <Form
                form={form}
                name="stage1Form"
                initialValues={{ ...allProfileData }}
                onFinish={handleStage1FormSubmission}
                layout="vertical"
                className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full font-medium"
            >
                <Form.Item<stage1FormInterface>
                    label="Upload Profile Image"
                    name="userImage"
                    rules={[{ required: true, message: 'Profile Image is required!' }]}
                >
                    <Upload beforeUpload={() => false} maxCount={1}>
                        <Button icon={<UploadOutlined />}>Click to Upload</Button>
                    </Upload>
                </Form.Item>

                <Form.Item<stage1FormInterface>
                    label="First Name"
                    name="firstName"
                    rules={[{ required: true, message: 'First Name is required!' }]}
                >
                    <Input
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 
                        shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 transition"
                        placeholder="Enter your first name"
                    />
                </Form.Item>

                <Form.Item<stage1FormInterface>
                    label="Middle Name"
                    name="middleName"
                >
                    <Input
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 
                        shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 transition"
                        placeholder="Enter your middle name"
                    />
                </Form.Item>

                <Form.Item<stage1FormInterface>
                    label="Last Name"
                    name="lastName"
                    rules={[{ required: true, message: 'Last Name is required!' }]}
                >
                    <Input
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 
                        shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 transition"
                        placeholder="Enter your last name"
                    />
                </Form.Item>

                <Form.Item<stage1FormInterface>
                    label="Current Organisation"
                    name="currentOrganisation"
                    rules={[{ required: true, message: 'Current Organisation Name is required!' }]}
                >
                    <Input
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 
                        shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 transition"
                        placeholder="Enter your organisation"
                    />
                </Form.Item>

                <Form.Item<stage1FormInterface>
                    label="Current Role/Title"
                    name="currentRole"
                    rules={[{ required: true, message: 'Current Role/Title is required!' }]}
                >
                    <Input
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 
                        shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 transition"
                        placeholder="Enter your role"
                    />
                </Form.Item>

                <Form.Item<stage1FormInterface>
                    label="Mobile Number(Whatsapp): "
                    name="phoneNumber"
                    rules={[{ required: true, message: 'Mobile number is required!' }]}
                >
                    <Input type="number"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 
                        shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 transition"
                        placeholder="Enter your role"
                    />
                </Form.Item>

                <Form.Item<stage1FormInterface>
                    label="Current City"
                    name="currentCity"
                    rules={[{ required: true, message: 'Current City is required!' }]}
                >
                    <Input
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 
                        shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 transition"
                        placeholder="Enter your current city name"
                    />
                </Form.Item>

                <Form.Item<stage1FormInterface>
                    label="Current Area with Pincode"
                    name="currentArea"
                    rules={[{ required: true, message: 'Current Area with pincode is required!' }]}
                >
                    <Input
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 
                        shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 transition"
                        placeholder="Enter your role"
                    />
                </Form.Item>

                <Form.Item<stage1FormInterface>
                    label="Twitter Profile Link"
                    name="twitterHandle"
                >
                    <Input
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 
                        shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 transition"
                        placeholder="Enter your role"
                    />
                </Form.Item>

                <Form.Item<stage1FormInterface>
                    label="Instagram Profile Link"
                    name="instagramHandle"
                >
                    <Input
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 
                        shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 transition"
                        placeholder="Enter your role"
                    />
                </Form.Item>

                <Form.Item<stage1FormInterface>
                    label="LinkedIn Profile Link"
                    name="linkedinHandle"
                >
                    <Input
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 
                        shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 transition"
                        placeholder="Enter your role"
                    />
                </Form.Item>

                <Form.Item<stage1FormInterface>
                    label="Other Profile Link"
                    name="otherHandle"
                >
                    <Input
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 
                        shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 transition"
                        placeholder="Enter your role"
                    />
                </Form.Item>

                <Form.Item<stage1FormInterface>
                    label="Introduction(100 words)"
                    name="intro"
                    rules={[{ required: true, message: 'Introduction is required!' }]}
                >
                    <Input
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 
                        shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 transition"
                        placeholder="Enter your role"
                    />
                </Form.Item>

                <Form.Item<stage1FormInterface>
                    label="Inspiring Quote"
                    name="quote"
                    rules={[{ required: true, message: 'Inspiring Quote is required!' }]}
                >
                    <Input
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 
                        shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 transition"
                        placeholder="Enter your role"
                    />
                </Form.Item>

                <Form.Item<stage1FormInterface>
                    label="Things that will excite you apart from work"
                    name="inspiring"
                    rules={[{ required: true, message: 'Field is required!' }]}
                >
                    <Input
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 
                        shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 transition"
                        placeholder="Enter your role"
                    />
                </Form.Item>

                <Form.Item<stage1FormInterface>
                    label="Links of your content like blogs,videos,podcasts etc."
                    name="linksContent"
                >
                    <Input
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 
                        shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 transition"
                        placeholder="Enter your role"
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
