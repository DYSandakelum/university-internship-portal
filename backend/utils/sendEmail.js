const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    const host = process.env.EMAIL_HOST;
    const port = Number(process.env.EMAIL_PORT || 587);
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;

    // Development mode: log email to console if credentials are not set
    if (!user || !pass) {
        if (process.env.NODE_ENV === 'development') {
            console.log('\n📧 EMAIL SERVICE DISABLED (Development Mode)');
            console.log('To:', options.email);
            console.log('Subject:', options.subject);
            console.log('Body:', options.html);
            console.log('---\n');
            return; // Silent success in dev mode
        }
        throw new Error('Email service is not configured. Set EMAIL_USER and EMAIL_PASS in .env file');
    }

    // Production mode: require valid SMTP configuration
    if (!host || !port) {
        throw new Error('Email host/port is not configured. Set EMAIL_HOST and EMAIL_PORT in .env file');
    }

    // Create transporter with SMTP credentials
    const transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: {
            user,
            pass
        }
    });

    // Email options
    const mailOptions = {
        from: `University Internship Portal <${user}>`,
        to: options.email,
        subject: options.subject,
        html: options.html
    };

    // Send email
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;