# ProGen AI - Professional Product Image Generator

## Part 1: Client Manual

Welcome to ProGen AI, your go-to tool for generating professional product images using advanced AI technology. This manual provides step-by-step instructions for clients (regular users) to get started, register, log in, and use the core features of the platform.

### 1.1 Getting Started
- **Access the Platform**: Visit the ProGen AI website at [https://ivycmy4704.github.io/langtech_testing/](https://ivycmy4704.github.io/langtech_testing/).
- **Browser Requirements**: Use a modern web browser like Chrome, Firefox, or Safari (version 100+). Ensure JavaScript is enabled for interactive features.
- **Account Requirement**: You need a registered account to access the image generation tools.

### 1.2 Registration
If you don't have an account:
1. On the login page, click the **"Don't have an account? Create Account"** link.
2. You will be redirected to the registration page.
3. Fill in the required details:
   - **Email Address**: Provide a valid email (e.g., yourname@example.com).
   - **Password**: Create a strong password (at least 8 characters, including letters, numbers, and symbols).
   - **Full Name**: Enter your full name for account identification.
4. Click **"Create Account & Send Verification Code"**.
5. Check your email for a verification code.
6. Return to the registration page (or a prompted verification step) and enter the code to complete setup.
7. Once verified, you can log in.

**Tips**:
- Use a secure password manager.
- If you don't receive the email, check your spam folder or use the forgot password feature.

### 1.3 Logging In
1. On the main page, enter your **Email** and **Password** in the login form.
2. Click the **"Log In"** button.
3. If successful, you will be directed to the dashboard.
4. **Troubleshooting**:
   - Invalid credentials? Double-check your email and password (case-sensitive).
   - Forgot password? Click **"Forgot Password?"** and follow the recovery steps (see Section 1.4).

### 1.4 Password Recovery
1. Click **"Forgot Password?"** on the login page.
2. Enter your registered **Email Address**.
3. Click **"Send Verification Code"**.
4. Check your email for the code and follow the on-screen instructions to reset your password.
5. Create a new password and confirm it.

### 1.5 Using the Image Generation Tool
Once logged in (on the dashboard):
1. **Navigate to Generator**: Select the "Generate Image" or main tool section.
2. **Input Details**:
   - Describe your product (e.g., "A sleek black wireless earbuds on a white background").
   - Optionally upload a reference image or specify style (e.g., realistic, studio lighting).
   - Choose parameters like resolution (e.g., 1024x1024) or aspect ratio.
3. Click **"Generate"** to create the image.
4. **Review and Download**:
   - Preview the generated image(s).
   - Edit prompts if needed and regenerate.
   - Download the final image in PNG/JPG format.
5. **History**: Access past generations from the "My Images" section.

**Best Practices**:
- Use clear, descriptive prompts for better results (e.g., include lighting, angles, and colors).
- Generation may take 10-60 seconds; be patient.
- Free tier limits: 5 generations/day; upgrade for more.

### 1.6 Account Management
- **Profile**: Update email, password, or preferences in the settings menu.
- **Logout**: Click your profile icon and select "Log Out".
- **Support**: Contact support@progenai.example.com for issues.

### 1.7 Troubleshooting
| Issue | Solution |
|-------|----------|
| Login fails | Verify credentials; clear browser cache. |
| No verification email | Check spam; resend code. |
| Generation errors | Check internet; try shorter prompts. |
| Slow loading | Use incognito mode or different browser. |

For more help, refer to the in-app help or FAQ (if available on dashboard).

---

## Part 2: Admin Manual

This section is for platform administrators responsible for managing users, monitoring activity, and maintaining the ProGen AI system. Admin access requires special credentials provided by the system owner. All actions are logged for security.

### 2.1 Admin Access
- **Login**: Use the standard login page but enter admin-specific credentials (e.g., admin@progenai.example.com and provided password).
- **Role Assignment**: Admins are pre-assigned during setup. Contact the developer if you need role elevation.
- **Security Note**: Use two-factor authentication (2FA) if enabled. Never share credentials.

### 2.2 Admin Dashboard
After logging in as admin:
1. You will be redirected to the Admin Dashboard (separate from client view).
2. Key sections:
   - **User Management**: View, edit, or delete user accounts.
   - **Activity Logs**: Monitor generations, logins, and errors.
   - **System Settings**: Configure API keys, generation limits, or themes.
   - **Reports**: Generate usage analytics.

### 2.3 Managing Users
1. Go to **"Users"** tab.
2. **Search/Filter**: Find users by email, registration date, or usage.
3. **Actions**:
   - **View Profile**: See details like generations count and last login.
   - **Edit**: Update roles (e.g., promote to moderator), reset password, or suspend account.
   - **Delete**: Permanently remove (with confirmation).
4. **Bulk Actions**: Select multiple users for suspension or notifications.

**Guidelines**:
- Only suspend for violations (e.g., abuse).
- Notify users via email before major actions.

### 2.4 Monitoring and Reports
1. **Activity Logs**: Filter by date/user; export to CSV.
2. **Usage Reports**:
   - Track total generations, peak hours.
   - Identify high-usage clients for upselling.
3. **Error Logs**: Review failed generations; debug API issues.

### 2.5 System Configuration
1. **API Management**: Update AI model keys (e.g., for image gen backend).
2. **Rate Limits**: Adjust client quotas (e.g., 10 gens/hour).
3. **Email Settings**: Configure SMTP for verifications.
4. **Backup**: Schedule data exports via the "Maintenance" section.

**Caution**: Changes here affect all users; test in staging if possible.

### 2.6 Security and Maintenance
- **Audit Logs**: Review your own actions.
- **Updates**: Check for platform updates via the GitHub repo.
- **Logout**: Always log out from shared devices.
- **Incident Response**: For breaches, isolate users and contact support.

### 2.7 Troubleshooting
| Issue | Solution |
|-------|----------|
| Access denied | Verify admin role; contact developer. |
| Logs not loading | Clear cache; check server status. |
| User edit fails | Ensure no active sessions; retry. |
| Report export error | Use smaller date ranges. |

For advanced issues, review the source code on GitHub or consult the developer.

---

**Version**: 1.0 (November 28, 2025)  
**Feedback**: Suggest improvements via the GitHub repo issues.  
**Disclaimer**: This manual assumes standard features; actual UI may vary based on updates.
