import express from 'express';
import User from './userModel';
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';

const router = express.Router();

// 处理用户注册和登录的通用路由
router.post('/', asyncHandler(async (req, res) => {
  try {
    const { username, password } = req.body;

    // 验证必需的字段
    if (!username || !password) {
      return res.status(400).json({ 
        success: false, 
        msg: 'Username and password are required.' 
      });
    }

    // 根据 query 参数判断是注册还是登录
    if (req.query.action === 'register') {
      // 注册流程
      // 检查用户是否已存在
      const existingUser = await User.findByUserName(username);
      if (existingUser) {
        return res.status(400).json({ 
          success: false, 
          msg: 'Username already exists.' 
        });
      }

      // 创建新用户 - password会在model的pre save中自动hash
      const newUser = await User.create({
        username: username,
        password: password
      });

      // 生成JWT token
      const token = jwt.sign(
        { username: newUser.username },
        process.env.SECRET,
        { expiresIn: '24h' }
      );

      res.status(201).json({
        success: true,
        msg: 'User successfully created.',
        token: 'BEARER ' + token
      });

    } else {
      // 登录流程
      const user = await User.findByUserName(username);
      if (!user) {
        return res.status(401).json({ 
          success: false, 
          msg: 'Authentication failed.' 
        });
      }

      // 验证密码
      const isMatch = await user.comparePassword(password);
      if (isMatch) {
        const token = jwt.sign(
          { username: user.username },
          process.env.SECRET,
          { expiresIn: '24h' }
        );
        res.status(200).json({ 
          success: true, 
          token: 'BEARER ' + token 
        });
      } else {
        res.status(401).json({ 
          success: false, 
          msg: 'Authentication failed.' 
        });
      }
    }
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({ 
      success: false, 
      msg: 'Internal server error.' 
    });
  }
}));

// 验证token的路由
router.get('/verify', asyncHandler(async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ 
        success: false, 
        msg: 'No authorization header' 
      });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        msg: 'No token provided' 
      });
    }

    const decoded = jwt.verify(token, process.env.SECRET);
    const user = await User.findByUserName(decoded.username);
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        msg: 'User not found' 
      });
    }

    res.status(200).json({ 
      success: true, 
      msg: 'Token is valid' 
    });
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      msg: 'Invalid token' 
    });
  }
}));

export default router;