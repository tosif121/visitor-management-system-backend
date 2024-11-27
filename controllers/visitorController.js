const path = require('path');
const fs = require('fs');
const os = require('os');
const QRCode = require('qrcode');
const Visitor = require('../models/visitorModel');
const transporter = require('../config/emailConfig');

const formatDateTime = (dateString) => {
  if (!dateString) return 'Not specified';
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Kolkata',
    timeZoneName: 'short',
  });
};

const formatTime = (dateString) => {
  if (!dateString) return 'Not specified';
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Kolkata',
  });
};

const registerVisitor = async (req, res) => {
  try {
    const { fullName, email, mobileNumber, company, purpose, pickupLocation, instructions, pickupTime, visitDate } =
      req.body;

    if (!fullName || !email) {
      return res.status(400).json({ status: false, message: 'Missing required fields' });
    }

    const visitor = await Visitor.create(req.body);

    const baseUrl = process.env.BASE_URL || 'http://localhost:3000/visitor-details';
    const qrData = `${baseUrl}?id=${visitor._id}`;
    const qrCodeBase64 = await QRCode.toDataURL(qrData);

    const tempDir = os.tmpdir();
    const qrCodePath = path.join(tempDir, `${Date.now()}-qrcode.png`);
    const base64Data = qrCodeBase64.replace(/^data:image\/png;base64,/, '');

    try {
      fs.writeFileSync(qrCodePath, base64Data, 'base64');
    } catch (writeError) {
      console.error('Error writing QR code file:', writeError);
    }

    const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #000;">
      <h2 style="margin-bottom: 16px; font-size: 20px; color: #333;">Visitor Registration Confirmation</h2>
      <p>Hello ${fullName},</p>
      <p>Your visitor registration is confirmed with the following details:</p>
      <ul style="padding-left: 20px; margin: 16px 0;">
        ${(fullName && `<li style="margin: 8px 0;"><strong>Name:</strong> ${fullName}</li>`) || ''}
        ${mobileNumber && `<li style="margin: 8px 0;"><strong>Mobile Number:</strong> ${mobileNumber}</li>`}
        ${email && `<li style="margin: 8px 0;"><strong>Email:</strong> ${email}</li>`}
        ${company && `<li style="margin: 8px 0;"><strong>Company:</strong> ${company}</li>`}
        ${purpose && `<li style="margin: 8px 0;"><strong>Purpose:</strong> ${purpose}</li>`}
        ${
          (pickupLocation && `<li style="margin: 8px 0;"><strong>Pickup Location:</strong> ${pickupLocation}</li>`) ||
          ''
        }
        ${(instructions && `<li style="margin: 8px 0;"><strong>Instructions:</strong> ${instructions}</li>`) || ''}
        ${
          (pickupTime && `<li style="margin: 8px 0;"><strong>Pickup Time:</strong> ${formatTime(pickupTime)}</li>`) ||
          ''
        }
        ${
          (visitDate && `<li style="margin: 8px 0;"><strong>Visit Date:</strong> ${formatDateTime(visitDate)}</li>`) ||
          ''
        }
      </ul>
      <p>Scan the QR code below for entry or click <a href="${baseUrl}?id=${
      visitor._id
    }" style="color: #007BFF;">here</a> to view details.</p>
      <div style="text-align: center; margin: 16px 0;">
        <img src="cid:qrcode" alt="Visitor QR Code" style="max-width: 150px; border: 1px solid #ccc; padding: 4px;" />
      </div>
      <p style="font-size: 14px; color: #555;">Thank you!</p>
    </div>
  `;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Visitor Registration Confirmation',
      html: emailHtml,
      attachments: [
        {
          filename: 'qrcode.png',
          content: base64Data,
          encoding: 'base64',
          cid: 'qrcode',
        },
      ],
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      status: true,
      message: 'Visitor registered successfully',
      data: {
        visitorId: visitor._id,
        qrCodeImage: qrCodeBase64,
      },
    });
  } catch (error) {
    console.error('Error registering visitor:', error);
    res.status(500).json({ status: false, message: 'Registration failed', error: error.message });
  }
};

module.exports = { registerVisitor };
