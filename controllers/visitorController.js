const path = require('path');
const fs = require('fs');
const QRCode = require('qrcode');
const Visitor = require('../models/visitorModel');
const transporter = require('../config/emailConfig');

const registerVisitor = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, company, purpose, pickupLocation, instructions, pickupTime, visitDate } =
      req.body;

    if (!fullName || !email) {
      return res.status(400).json({ status: false, message: 'Missing required fields' });
    }

    const qrData = JSON.stringify(req.body);
    const qrCodeBase64 = await QRCode.toDataURL(qrData).catch((err) => {
      console.error('QR Code generation failed:', err);
      throw new Error('Failed to generate QR Code.');
    });

    const tempDir = path.join(__dirname, '../temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }

    const qrCodePath = path.join(tempDir, `${Date.now()}-qrcode.png`);
    const base64Data = qrCodeBase64.replace(/^data:image\/png;base64,/, '');
    fs.writeFileSync(qrCodePath, base64Data, 'base64');

    const visitor = await Visitor.create(req.body);

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Visitor Registration Confirmation</h2>
        <p>Hello ${fullName},</p>
        <p>Your visitor registration is confirmed with the following details:</p>
        <ul>
          ${fullName ? `<li><strong>Name:</strong> ${fullName}</li>` : ''}
          ${phoneNumber ? `<li><strong>Phone Number:</strong> ${phoneNumber}</li>` : ''}
          ${email ? `<li><strong>Email:</strong> ${email}</li>` : ''}
          ${company ? `<li><strong>Company:</strong> ${company}</li>` : ''}
          ${purpose ? `<li><strong>Purpose:</strong> ${purpose}</li>` : ''}
          ${pickupLocation ? `<li><strong>Pickup Location:</strong> ${pickupLocation}</li>` : ''}
          ${instructions ? `<li><strong>Instructions:</strong> ${instructions}</li>` : ''}
          ${pickupTime ? `<li><strong>Pickup Time:</strong> ${pickupTime}</li>` : ''}
          ${visitDate ? `<li><strong>Visit Date:</strong> ${visitDate}</li>` : ''}
        </ul>
        <p>Please scan the QR code below for entry:</p>
        <img src="cid:qrcode" alt="Visitor QR Code" style="max-width: 300px;" />
        <p>Thank you!</p>
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
          path: qrCodePath,
          cid: 'qrcode',
        },
      ],
    };

    await transporter.sendMail(mailOptions);

    fs.unlinkSync(qrCodePath);

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
