import { Response, Router } from 'express';
import { authenticateToken, authorizeRoles } from '../middleware/auth';
import User from '../models/user';
import { AuthRequest } from '../types';

const router = Router();

router.get(
  '/profile',
  authenticateToken,
  async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'User not authenticated.' });
        return;
      }

      const user = await User.findByPk(req.user.userId, {
        attributes: { exclude: ['passwordHash'] },
      });

      if (!user) {
        res.status(404).json({ message: 'User not found.' });
        return;
      }

      res.status(200).json({ message: 'Welcome to your profile!', user });
    } catch (error) {
      console.error('Error fetching profile:', error);
      res.status(500).json({ message: 'Internal server error.' });
    }
  }
);

router.get(
  '/admin-data',
  authenticateToken,
  authorizeRoles('admin'),
  (req: AuthRequest, res: Response) => {
    res.status(200).json({ message: 'This is admin data!', user: req.user });
  }
);

export default router;
