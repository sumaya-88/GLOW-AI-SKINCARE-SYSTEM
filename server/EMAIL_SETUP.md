# Gmail App Password Setup Instructions

## Step 1: Enable 2-Factor Authentication
1. Go to https://myaccount.google.com/security
2. Under "Signing in to Google", click "2-Step Verification"
3. Follow the steps to enable it (if not already enabled)

## Step 2: Generate App Password
1. Go to https://myaccount.google.com/apppasswords
2. In "Select app" dropdown, choose "Mail"
3. In "Select device" dropdown, choose "Other (Custom name)"
4. Type "GlowAI" as the name
5. Click "Generate"
6. You'll see a 16-character password like: "abcd efgh ijkl mnop"
7. Copy this password (without spaces)

## Step 3: Update .env File
1. Open `server/.env` file
2. Replace `your_app_password_here` with the 16-character password
3. Remove all spaces from the password
4. Save the file

Example:
```
EMAIL_USER=nehasumaya554@gmail.com
EMAIL_PASS=abcdefghijklmnop
```

## Step 4: Restart Server
After updating the .env file, restart the Node.js server for changes to take effect.
