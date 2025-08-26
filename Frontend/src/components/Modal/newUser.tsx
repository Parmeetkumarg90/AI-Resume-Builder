import { Modal, Form, Input, Button } from "antd";
import type { FormProps } from "antd";
import type { NewUserModalInterface, newUserInterface } from "../../schema/userSchema";

export default function NewUserModal({ open, onClose, onSubmit }: NewUserModalInterface) {
    const handleFormSubmit: FormProps<newUserInterface>['onFinish'] = ({ email, mobileNumber }) => {
        onSubmit({ email, mobileNumber });
    }

    return (
        <Modal open={open} onCancel={onClose} footer={[]} title="New User Creation Form">
            <Form
                name="new user form"
                initialValues={{ email: "", mobileNumber: "" }}
                onFinish={handleFormSubmit}
                className="pt-8 border-blue-200 border-t-2"
            >
                <Form.Item<newUserInterface> label="Enter User Email: " name="email" rules={[{ required: true, message: "Please fill email" }]}>
                    <Input />
                </Form.Item>
                <Form.Item<newUserInterface> label="Enter User Mobile Number: " name="mobileNumber" rules={[{ required: true, message: "Please fill mobile number" }]}>
                    <Input type="number" />
                </Form.Item>
                <Button variant="solid" type="primary" className="bg-blue-500 hover:bg-blue-700" htmlType="submit">Submit</Button>
            </Form>
        </Modal >
    );
}