import nodemailer from 'nodemailer';

let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
    },
});

async function sendMail(name, to, subject, text, html) {
    // console.log(name)
    await transporter
        .sendMail({
            from: `${name} ${process.env.EMAIL_PASS}`,
            to: `${to}`, // recipient's email address
            subject: `${subject}`,
            text: `${text}`,
            html: `${html}`
        })
        .then((info) => {
            console.log("Message sent: ", info.messageId);
            // Preview the sent message in the console
            console.log("Preview URL: ", nodemailer.getTestMessageUrl(info));
        })
        .catch(console.error);
}

export default sendMail;