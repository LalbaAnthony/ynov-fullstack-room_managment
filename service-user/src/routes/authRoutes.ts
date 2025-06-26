import { Router } from 'express';
import * as authController from '../controllers/authController';

const router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);

router.get('/public-test', (req, res) => {
  res.status(200).json({ message: 'This is a public test route.' });
});

export default router;