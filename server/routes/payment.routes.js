import express from 'express';
const router = express.Router();

router.get('/', (req, res) => res.json({ success: true, message: 'Payments route active' }));

export default router;
