import express from 'express';
import Message from '../models/Message.js';

const router = express.Router();

// @desc    Submit a new contact message
// @route   POST /api/messages
// @access  Public
router.post('/', async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and message.' });
    }

    const newMessage = await Message.create({
      name,
      email,
      phone,
      subject,
      message
    });

    res.status(201).json({
      success: true,
      message: 'Thank you. Your message has been received by our concierge.',
      data: newMessage
    });
  } catch (err) {
    next(err);
  }
});

export default router;
