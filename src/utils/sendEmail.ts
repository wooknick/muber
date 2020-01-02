import Mailgun from "mailgun-js";

const mailGunClient = new Mailgun({
    apiKey: process.env.MAILGUN_API_KEY || "",
    domain: "sandbox60356a5f0cef48f4bd40f23e0cc9f53c.mailgun.org"
});

const sendEmail = (subject: string, html: string) => {
    const emailData = {
        from: "wooknick.public@gmail.com",
        to: "wooknick.public@gmail.com",
        subject,
        html
    };
    return mailGunClient.messages().send(emailData);
};

export const sendVerificationEmail = (fullName: string, key: string) => {
    const emailSubject = `Hello! ${fullName}, please verify your email`;
    const emailBody = `Verify your email by clicking <a href="http://muber.com/verification/${key}">here</a>`;
    return sendEmail(emailSubject, emailBody);
};
