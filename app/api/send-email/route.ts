import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Validate environment variables
const emailConfig = {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
};

export async function POST(request: NextRequest) {
    try {
        const { name, email, subject, message } = await request.json();

        // Validate input
        if (!name || !email || !subject || !message) {
            return NextResponse.json(
                { error: 'All fields are required' },
                { status: 400 }
            );
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: 'Invalid email address' },
                { status: 400 }
            );
        }

        // Check if email is configured
        if (!emailConfig.auth.user || !emailConfig.auth.pass) {
            console.error('Email configuration missing');
            return NextResponse.json(
                { error: 'Email service is not configured. Please contact support directly.' },
                { status: 500 }
            );
        }

        // Create transporter
        const transporter = nodemailer.createTransport({
            host: emailConfig.host,
            port: emailConfig.port,
            secure: emailConfig.secure,
            auth: emailConfig.auth,
        });

        // Email content
        const mailOptions = {
            from: `"${name}" <${emailConfig.auth.user}>`,
            replyTo: email,
            to: process.env.CONTACT_EMAIL || emailConfig.auth.user,
            subject: `Contact Form: ${subject}`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #f97316;">New Contact Form Submission</h2>
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
          </div>
          <div style="margin: 20px 0;">
            <h3 style="color: #374151;">Message:</h3>
            <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
          </div>
        </div>
      `,
            text: `
        New Contact Form Submission
        
        Name: ${name}
        Email: ${email}
        Subject: ${subject}
        
        Message:
        ${message}
      `,
        };

        // Send email
        await transporter.sendMail(mailOptions);

        // Also save to Firestore for backup
        try {
            const { db } = await import('@/lib/firebase');
            const { collection, addDoc, Timestamp } = await import('firebase/firestore');
            await addDoc(collection(db, 'contact-submissions'), {
                name,
                email,
                subject,
                message,
                createdAt: Timestamp.fromDate(new Date()),
                status: 'new',
            });
        } catch (firestoreError) {
            console.error('Error saving to Firestore:', firestoreError);
            // Don't fail the request if Firestore save fails
        }

        return NextResponse.json({
            success: true,
            message: 'Your message has been sent successfully!',
        });
    } catch (error) {
        console.error('Error sending email:', error);
        return NextResponse.json(
            { error: 'Failed to send message. Please try again later.' },
            { status: 500 }
        );
    }
}

