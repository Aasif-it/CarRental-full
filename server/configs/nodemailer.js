import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
})

export const sendBookingEmail = async (userEmail, userName, bookingDetails) => {
    const { carName, pickupDate, returnDate, price } = bookingDetails;

    const mailOptions = {
        from: `"Car Rental Support" <${process.env.SMTP_USER}>`,
        to: userEmail,
        subject: 'Booking Confirmation - Car Rental',
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                <h2 style="color: #5D5FEF;">Booking Confirmed!</h2>
                <p>Hello ${userName},</p>
                <p>Your booking for <strong>${carName}</strong> has been confirmed.</p>
                <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <p><strong>Pickup Date:</strong> ${pickupDate.split('T')[0]}</p>
                    <p><strong>Return Date:</strong> ${returnDate.split('T')[0]}</p>
                    <p><strong>Total Price:</strong> ₹${price}</p>
                </div>
                <p>Thank you for choosing our service!</p>
                <br/>
                <p>Best Regards,<br/>Car Rental Team</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Confirmation email sent to:', userEmail);
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

export const sendNewsletterNotification = async (subscriberEmail) => {
    const mailOptions = {
        from: `"Car Rental System" <${process.env.SMTP_USER}>`,
        to: process.env.ADMIN_EMAIL,
        subject: 'New Newsletter Subscription!',
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #5D5FEF;">New Subscriber Alert!</h2>
                <p>Hello Admin,</p>
                <p>A new user has just subscribed to your newsletter.</p>
                <div style="background-color: #f0f0ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <p><strong>Email Address:</strong> ${subscriberEmail}</p>
                    <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
                </div>
                <p>You can now send them promotional offers and updates.</p>
                <br/>
                <p>System Automated Notification</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Admin notified about new subscriber:', subscriberEmail);
    } catch (error) {
        console.error('Error sending newsletter notification:', error);
    }
}

export const sendBookingStatusEmail = async (userEmail, userName, bookingDetails) => {
    const { carName, status, pickupDate, returnDate } = bookingDetails;
    const statusColor = status === 'confirmed' ? '#10B981' : '#EF4444';
    const statusText = status.charAt(0).toUpperCase() + status.slice(1);

    const mailOptions = {
        from: `"Car Rental Support" <${process.env.SMTP_USER}>`,
        to: userEmail,
        subject: `Booking ${statusText} - Car Rental`,
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: ${statusColor};">Your Booking is ${statusText}!</h2>
                <p>Hello ${userName},</p>
                <p>We are writing to inform you about your booking status for <strong>${carName}</strong>.</p>
                <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid ${statusColor};">
                    <p><strong>Status:</strong> <span style="color: ${statusColor}; font-weight: bold;">${statusText}</span></p>
                    <p><strong>Pickup Date:</strong> ${pickupDate.split('T')[0]}</p>
                    <p><strong>Return Date:</strong> ${returnDate.split('T')[0]}</p>
                </div>
                <p>${status === 'confirmed' ? 'Get ready for your ride! Our team will contact you soon.' : 'We apologize for any inconvenience. Please try booking another vehicle.'}</p>
                <br/>
                <p>Best Regards,<br/>Car Rental Team</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Booking status email sent to ${userEmail}: ${status}`);
    } catch (error) {
        console.error('Error sending booking status email:', error);
    }
}

export const sendContactNotification = async (contactData) => {
    const { name, email, subject, message } = contactData;

    const mailOptions = {
        from: `"Car Rental Website" <${process.env.SMTP_USER}>`,
        to: process.env.ADMIN_EMAIL,
        subject: `New Contact Form Submission: ${subject}`,
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #5D5FEF;">New Inquiry Received!</h2>
                <div style="background-color: #f0f0ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <p><strong>From:</strong> ${name} (${email})</p>
                    <p><strong>Subject:</strong> ${subject}</p>
                    <p><strong>Message:</strong></p>
                    <p style="white-space: pre-wrap;">${message}</p>
                </div>
                <p>Sent at: ${new Date().toLocaleString()}</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Admin notified about new contact inquiry');
    } catch (error) {
        console.error('Error sending contact notification:', error);
    }
}
