import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Example route for authentication
router.post('/login', (req: Request, res: Response) => {
  // Authenticate user
  const { username, password } = req.body;

  // Example: Check username and password against database
  if (username === 'admin' && password === 'password') {
    const token = jwt.sign({ username }, 'secretkey', { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
});

export default router;