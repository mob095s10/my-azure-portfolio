module.exports = async function (context, req) {
    context.log('Contact form submission received');

    // Get data from request body
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

    // Log the submission (in production, you'd save to database or send email)
    context.log('Contact form data:', { name, email, message });

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