import nodemailer from 'nodemailer'

//CREATE TRANSPORTER OBJECT USING THE SMTP SETTINGS
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

const sendEMail = async({to, subject, body})=> {
    const response = await transporter.sendMail({
        from: process.env.SENDER_EMAIL,
        to,
        subject,
        html: body,
    })

    return response
}

export default sendEMail