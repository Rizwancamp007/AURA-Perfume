import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Please add a name'] },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  phone: { type: String },
  subject: { type: String, default: 'General Inquiry' },
  message: { type: String, required: [true, 'Please add a message'] }
}, {
  timestamps: true
});

const Message = mongoose.model('Message', messageSchema);
export default Message;
