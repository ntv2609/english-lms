require('dotenv').config();
import nodemailer, {Transporter} from "nodemailer";
import ejs from "ejs";
import path from "path";

interface EmailOptions {
    email: string;
    subject: string;
    template: string;
    data: { [key: string]: any;}
}

const sendMail = async (options: EmailOptions): Promise<void> => {
    const port = parseInt(process.env.SMTP_PORT || '587');
    
    const transporter: Transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: port,  
        // FIX LỖI PENDING: Tự động bật bảo mật SSL/TLS nếu dùng port 465
        secure: port === 465, 
        service: process.env.SMTP_SERVICE,
        auth: {
            user: process.env.SMTP_MAIL,
            pass: process.env.SMTP_PASSWORD
        }
    });

    const { email, subject, template, data } = options;

    // Lấy đường dẫn tới file giao diện email
    const templatePath = path.join(__dirname, '../mails', template);

    // Render email template với EJS
    const html:string = await ejs.renderFile(templatePath, data);

    const mailOptions = {
        from: process.env.SMTP_MAIL,
        to: email,
        subject,
        html
    };

    await transporter.sendMail(mailOptions);
};

export default sendMail;