import express from 'express';
const router = express.Router();

router.get('/', (req, res) => res.json({ success: true, message: 'Admin route active' }));

export default router;
