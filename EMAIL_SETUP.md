# Email Setup Instructions

To enable the newsletter subscription feature to send emails via Gmail, follow these steps:

## 1. Create a `.env` file

Copy the `.env.example` file and rename it to `.env`:
```bash
cp .env.example .env
```

## 2. Get Gmail App Password

Since Gmail requires additional security, you'll need to create an "App Password" instead of using your regular password:

1. Go to your Google Account: https://myaccount.google.com/
2. Click "Security" in the left menu
3. Enable "2-Step Verification" if you haven't already
4. Go back to Security and look for "App passwords"
5. Select "Mail" and "Windows Computer" (or your device)
6. Google will generate a 16-character password
7. Copy this password

## 3. Update your `.env` file

Edit the `.env` file and add:
```
GMAIL_USER=your-email@gmail.com
GMAIL_PASS=your-16-character-app-password
PORT=3000
```

## 4. Install dependencies

```bash
npm install
```

## 5. Start the server

```bash
npm start
```

The server will run on `http://localhost:3000`

## 6. Test the newsletter

Visit your site at `http://localhost:3000` and try subscribing with your email. You should receive a confirmation email!

---

**Note:** 
- Keep your `.env` file private - never commit it to version control
- The app password is specific to this application only
- You can delete the app password from your Google Account anytime to revoke access
