require('dotenv').config();
import nodemailer, { Transporter } from "nodemailer";
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
    
    // Cấu hình transporter theo lời khuyên của DevTools AI
    const transporter: Transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: port,  
        secure: port === 465, 
        service: process.env.SMTP_SERVICE,
        auth: {
            user: process.env.SMTP_MAIL,
            pass: process.env.SMTP_PASSWORD
        },
        // 🔥 ĐÂY LÀ CHÌA KHÓA: Ép Node.js chỉ dùng IPv4 để né lỗi ENETUNREACH của Render
        // và tắt kiểm tra chứng chỉ nghiêm ngặt để luồng kết nối chạy mượt hơn
        tls: {
            rejectUnauthorized: false
        }
    });

    const { email, subject, template, data } = options;

    const templatePath = path.join(__dirname, '../mails', template);
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