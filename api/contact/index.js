const sgMail = require('@sendgrid/mail');

module.exports = async function (context, req) {
    context.log('Contact form submission received');

    const { name, email, message } = req.body || {};

    // Validate input
    if (!name || !email || !message) {
        context.res = {
            status: 400,
            body: {
                message: "Please provide name, email, and message"
            }
        };
        return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        context.res = {
            status: 400,
            body: {
                message: "Please provide a valid email address"
            }
        };
        return;
    }

    // Log the submission
    context.log('Contact form data:', { name, email, message });

    // Send email notification via SendGrid
    try {
        const apiKey = process.env.SENDGRID_API_KEY;
        const notificationEmail = process.env.NOTIFICATION_EMAIL;
        const fromEmail = process.env.SENDGRID_FROM_EMAIL;

        if (!apiKey || !notificationEmail || !fromEmail) {
            context.log.error('Missing SendGrid configuration');
            throw new Error('Email service not configured');
        }

        sgMail.setApiKey(apiKey);

        const emailContent = {
            to: notificationEmail,
            from: fromEmail,
            subject: `New Portfolio Contact: ${name}`,
            text: `
You received a new message from your portfolio contact form!

Name: ${name}
Email: ${email}

Message:
${message}

---
Sent from Azure Portfolio Contact Form
            `,
            html: `
<h2>New Contact Form Submission</h2>
<p><strong>Name:</strong> ${name}</p>
<p><strong>Email:</strong> ${email}</p>
<h3>Message:</h3>
<p>${message}</p>
<hr>
<p><em>Sent from Azure Portfolio Contact Form</em></p>
            `
        };

        await sgMail.send(emailContent);
        context.log('Email sent successfully');

    } catch (error) {
        context.log.error('SendGrid error:', error);
        // Don't fail the request if email fails
        // Still return success to user
    }

    // Success response
    context.res = {
        status: 200,
        body: {
            message: "Message sent successfully! We'll get back to you soon.",
            data: {
                name,
                email,
                receivedAt: new Date().toISOString()
            }
        }
    };
};