const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const distPath = path.join(__dirname, 'dist');
const hasDist = fs.existsSync(distPath);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
    }
});

app.post('/subscribe', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ success: false, message: 'Invalid email format' });
    }

    if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
        return res.status(500).json({
            success: false,
            message: 'Email service is not configured.'
        });
    }

    try {
        await transporter.sendMail({
            from: `VOID <${process.env.GMAIL_USER}>`,
            to: email,
            subject: 'Welcome to VOID — Minimal Wear',
            text: `Welcome to VOID!\n\nThank you for subscribing to our newsletter. You will now receive updates on future drops and exclusive releases.\n\nNo noise. No distractions. Just clothing built to remain.\n\n— VOID`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #111;">
                    <h1 style="letter-spacing: 4px; color: #111;">Welcome to VOID</h1>
                    <p style="font-size: 1rem; line-height: 1.7; color: #444;">
                        Thanks for subscribing to our newsletter. You're now on the list for future drops, exclusive releases, and first access to new collections.
                    </p>
                    <p style="margin-top: 24px; font-size: 0.95rem; line-height: 1.7; color: #666;">
                        No noise. No distractions.<br>
                        Just clothing built to remain.
                    </p>
                    <div style="margin-top: 32px; padding: 18px; background: #f5f4f2; border-radius: 14px;">
                        <p style="margin: 0; color: #111; font-weight: 600;">Welcome aboard.</p>
                    </div>
                    <p style="margin-top: 30px; color: #999; font-size: 12px;">
                        © 2026 VOID — Minimal Wear
                    </p>
                </div>
            `
        });

        await transporter.sendMail({
            from: `VOID <${process.env.GMAIL_USER}>`,
            to: process.env.GMAIL_USER,
            subject: `New subscriber: ${email}`,
            html: `<p>A new person subscribed to the newsletter: <strong>${email}</strong></p>`
        });

        return res.status(200).json({
            success: true,
            message: 'Successfully subscribed! Check your email for confirmation.'
        });

    } catch (error) {
        console.error('Email error:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Failed to send email. Please try again later.'
        });
    }
});

if (hasDist) {
    app.use(express.static(distPath));
    app.get('*', (req, res, next) => {
        if (req.method !== 'GET') return next();
        res.sendFile(path.join(distPath, 'index.html'));
    });
} else {
    console.warn('dist/ not found — run "npm run build" before starting in production.');
    app.use(express.static('.'));
}

app.listen(PORT, () => {
    console.log(`VOID server running on http://localhost:${PORT}`);
    if (hasDist) {
        console.log('Serving production build from dist/');
    }
});
