module.exports = async function (context, req) {
    context.log('Contact form submission received');

    const { name, email, message } = req.body || {};

    if (!name || !email || !message) {
        context.res = {
            status: 400,
            body: {
                message: "Please provide name, email, and message"
            }
        };
        return;
    }

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

    context.log('Contact form data:', { name, email, message });

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
