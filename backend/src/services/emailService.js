const sgMail = require('@sendgrid/mail');
const nodemailer = require('nodemailer');
const config = require('../config/config');

// Initialize SendGrid if API key is available
if (config.sendgridApiKey && config.sendgridApiKey !== 'your-sendgrid-api-key') {
  sgMail.setApiKey(config.sendgridApiKey);
}

// Create Nodemailer transporter as fallback
const createTransporter = () => {
  if (config.emailUser && config.emailPassword) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: config.emailUser,
        pass: config.emailPassword
      }
    });
  }
  return null;
};

class EmailService {
  /**
   * Send email using available service (SendGrid or Nodemailer)
   */
  async sendEmail(options) {
    const { to, subject, html, text } = options;

    // Try SendGrid first
    if (config.sendgridApiKey && config.sendgridApiKey !== 'your-sendgrid-api-key') {
      try {
        const msg = {
          to,
          from: {
            email: config.fromEmail,
            name: config.fromName
          },
          subject,
          text: text || '',
          html: html || text
        };

        await sgMail.send(msg);
        console.log(`✅ Email sent via SendGrid to ${to}`);
        return { success: true, provider: 'SendGrid' };
      } catch (error) {
        console.error('❌ SendGrid failed:', error.message);
        // Fall through to Nodemailer
      }
    }

    // Try Nodemailer as fallback
    const transporter = createTransporter();
    if (transporter) {
      try {
        await transporter.sendMail({
          from: `"${config.fromName}" <${config.fromEmail}>`,
          to,
          subject,
          text: text || '',
          html: html || text
        });
        console.log(`✅ Email sent via Nodemailer to ${to}`);
        return { success: true, provider: 'Nodemailer' };
      } catch (error) {
        console.error('❌ Nodemailer failed:', error.message);
        return { success: false, error: error.message };
      }
    }

    // No email service configured
    console.warn('⚠️ No email service configured. Email not sent.');
    return { success: false, error: 'No email service configured' };
  }

  /**
   * Send welcome email to new users
   */
  async sendWelcomeEmail(user) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f7f7f7;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2ecc71; margin: 0;">🍽️ SharePlate</h1>
            <p style="color: #7f8c8d; margin: 10px 0 0 0;">Minimizing Food Waste Together</p>
          </div>
          
          <h2 style="color: #2c3e50; margin-bottom: 20px;">Welcome to SharePlate!</h2>
          
          <p style="color: #34495e; line-height: 1.6;">Hi <strong>${user.name}</strong>,</p>
          
          <p style="color: #34495e; line-height: 1.6;">
            Thank you for joining SharePlate as a <strong style="color: #2ecc71;">${user.role}</strong>.
          </p>
          
          ${user.organizationName ? `
            <div style="background-color: #ecf0f1; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 0; color: #2c3e50;">
                <strong>Organization:</strong> ${user.organizationName}
              </p>
            </div>
          ` : ''}
          
          <p style="color: #34495e; line-height: 1.6;">
            Your account has been successfully created. You can now:
          </p>
          
          <ul style="color: #34495e; line-height: 1.8;">
            ${user.role === 'restaurant' ? `
              <li>Create food donation listings</li>
              <li>Manage your donations</li>
              <li>Track pickup schedules</li>
            ` : user.role === 'shelter' ? `
              <li>Browse available food donations</li>
              <li>Request food items</li>
              <li>Coordinate pickups</li>
            ` : `
              <li>Manage all users</li>
              <li>Monitor platform activities</li>
              <li>Generate reports</li>
            `}
          </ul>
          
          <p style="color: #34495e; line-height: 1.6;">
            Together, we can minimize food waste and help those in need.
          </p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #ecf0f1;">
            <p style="color: #7f8c8d; margin: 0;">Best regards,</p>
            <p style="color: #2ecc71; margin: 5px 0 0 0;"><strong>The SharePlate Team</strong></p>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #95a5a6; font-size: 12px;">
          <p>This is an automated message. Please do not reply to this email.</p>
        </div>
      </div>
    `;

    const text = `
      Welcome to SharePlate!
      
      Hi ${user.name},
      
      Thank you for joining SharePlate as a ${user.role}.
      ${user.organizationName ? `Organization: ${user.organizationName}` : ''}
      
      Together, we can minimize food waste and help those in need.
      
      Best regards,
      The SharePlate Team
    `;

    return await this.sendEmail({
      to: user.email,
      subject: 'Welcome to SharePlate! 🍽️',
      html,
      text
    });
  }

  /**
   * Send email verification link
   */
  async sendVerificationEmail(user, verificationToken) {
    const verificationUrl = `${config.frontendUrl}/verify-email/${verificationToken}`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f7f7f7;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h2 style="color: #3498db; margin-bottom: 20px;">Verify Your Email Address</h2>
          
          <p style="color: #34495e; line-height: 1.6;">Hi <strong>${user.name}</strong>,</p>
          
          <p style="color: #34495e; line-height: 1.6;">
            Please click the button below to verify your email address and activate your SharePlate account:
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" 
               style="background-color: #2ecc71; 
                      color: white; 
                      padding: 14px 40px; 
                      text-decoration: none; 
                      border-radius: 5px;
                      display: inline-block;
                      font-weight: bold;">
              Verify Email Address
            </a>
          </div>
          
          <p style="color: #7f8c8d; font-size: 14px; line-height: 1.6;">
            Or copy and paste this link into your browser:<br>
            <a href="${verificationUrl}" style="color: #3498db;">${verificationUrl}</a>
          </p>
          
          <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; margin-top: 20px; border-left: 4px solid #ffc107;">
            <p style="margin: 0; color: #856404; font-size: 14px;">
              ⏰ This verification link will expire in <strong>24 hours</strong>.
            </p>
          </div>
          
          <p style="color: #7f8c8d; font-size: 14px; margin-top: 20px;">
            If you didn't create this account, please ignore this email.
          </p>
        </div>
      </div>
    `;

    const text = `
      Verify Your Email Address
      
      Hi ${user.name},
      
      Please verify your email by clicking this link:
      ${verificationUrl}
      
      This link will expire in 24 hours.
      
      If you didn't create this account, please ignore this email.
    `;

    return await this.sendEmail({
      to: user.email,
      subject: 'Verify Your Email - SharePlate',
      html,
      text
    });
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(user, resetToken) {
    const resetUrl = `${config.frontendUrl}/reset-password/${resetToken}`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f7f7f7;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h2 style="color: #e74c3c; margin-bottom: 20px;">Password Reset Request</h2>
          
          <p style="color: #34495e; line-height: 1.6;">Hi <strong>${user.name}</strong>,</p>
          
          <p style="color: #34495e; line-height: 1.6;">
            You requested to reset your password for your SharePlate account. Click the button below to proceed:
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background-color: #e74c3c; 
                      color: white; 
                      padding: 14px 40px; 
                      text-decoration: none; 
                      border-radius: 5px;
                      display: inline-block;
                      font-weight: bold;">
              Reset Password
            </a>
          </div>
          
          <p style="color: #7f8c8d; font-size: 14px; line-height: 1.6;">
            Or copy and paste this link into your browser:<br>
            <a href="${resetUrl}" style="color: #e74c3c;">${resetUrl}</a>
          </p>
          
          <div style="background-color: #f8d7da; padding: 15px; border-radius: 5px; margin-top: 20px; border-left: 4px solid #e74c3c;">
            <p style="margin: 0; color: #721c24; font-size: 14px;">
              ⚠️ This reset link will expire in <strong>10 minutes</strong>.
            </p>
          </div>
          
          <p style="color: #7f8c8d; font-size: 14px; margin-top: 20px;">
            If you didn't request this password reset, please ignore this email and your password will remain unchanged.
          </p>
        </div>
      </div>
    `;

    const text = `
      Password Reset Request
      
      Hi ${user.name},
      
      You requested to reset your password. Click this link to reset:
      ${resetUrl}
      
      This link will expire in 10 minutes.
      
      If you didn't request this, please ignore this email.
    `;

    return await this.sendEmail({
      to: user.email,
      subject: 'Password Reset Request - SharePlate',
      html,
      text
    });
  }

  /**
   * Send account notification email
   */
  async sendNotificationEmail(user, subject, message) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f7f7f7;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h2 style="color: #3498db; margin-bottom: 20px;">Notification from SharePlate</h2>
          
          <p style="color: #34495e; line-height: 1.6;">Hi <strong>${user.name}</strong>,</p>
          
          <div style="color: #34495e; line-height: 1.6; margin: 20px 0;">
            ${message}
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #ecf0f1;">
            <p style="color: #7f8c8d; margin: 0;">Best regards,</p>
            <p style="color: #2ecc71; margin: 5px 0 0 0;"><strong>The SharePlate Team</strong></p>
          </div>
        </div>
      </div>
    `;

    const text = `
      Notification from SharePlate
      
      Hi ${user.name},
      
      ${message.replace(/<[^>]*>/g, '')}
      
      Best regards,
      The SharePlate Team
    `;

    return await this.sendEmail({
      to: user.email,
      subject,
      html,
      text
    });
  }

  /**
   * Send password change confirmation
   */
  async sendPasswordChangeConfirmation(user) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f7f7f7;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h2 style="color: #2ecc71; margin-bottom: 20px;">✅ Password Changed Successfully</h2>
          
          <p style="color: #34495e; line-height: 1.6;">Hi <strong>${user.name}</strong>,</p>
          
          <p style="color: #34495e; line-height: 1.6;">
            Your password has been successfully changed.
          </p>
          
          <div style="background-color: #d4edda; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #2ecc71;">
            <p style="margin: 0; color: #155724; font-size: 14px;">
              ✓ Password updated on ${new Date().toLocaleString()}
            </p>
          </div>
          
          <p style="color: #7f8c8d; font-size: 14px;">
            If you didn't make this change, please contact support immediately.
          </p>
        </div>
      </div>
    `;

    const text = `
      Password Changed Successfully
      
      Hi ${user.name},
      
      Your password has been successfully changed on ${new Date().toLocaleString()}.
      
      If you didn't make this change, please contact support immediately.
    `;

    return await this.sendEmail({
      to: user.email,
      subject: 'Password Changed - SharePlate',
      html,
      text
    });
  }
}

module.exports = new EmailService();
