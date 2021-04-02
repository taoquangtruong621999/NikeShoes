import express from 'express';
import User from '../models/userModel';
import { getToken, isAuth,isAdmin } from '../util';

const router = express.Router();

router.put('/:id', isAuth, async (req, res) => {
  const userId = req.params.id;
 
  const user = await User.findById(userId);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.password = req.body.password || user.password;
    const updatedUser = await user.save();
    res.send({
      _id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: getToken(updatedUser),
    });
  } else {
    res.status(404).send({ message: 'User Not Found' });
  }
});
router.put('/admin/:id', isAuth, async (req, res) => {
  const userId = req.params.id;
  const user = await User.findById(userId);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.password = req.body.password || user.password;
    const updatedUser = await user.save();
    res.send({
      _id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      
    });
  } else {
    res.status(404).send({ message: 'User Not Found' });
  }
});
router.post('/signin', async (req, res) => {
  const signinUser = await User.findOne({
    email: req.body.email,
    password: req.body.password,
  });
  if (signinUser) {
    res.send({
      _id: signinUser.id,
      name: signinUser.name,
      email: signinUser.email,
      isAdmin: signinUser.isAdmin,
      token: getToken(signinUser),
    });
  } else {
    res.status(401).send({ msg: 'Invalid Email or Password.' });
  }
});

router.post('/register', async (req, res) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  const newUser = await user.save();
  if (newUser) {
    res.send({
      _id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      isAdmin: newUser.isAdmin,
      token: getToken(newUser),
    });
  } else {
    res.status(401).send({ message: 'Invalid User Data.' });
  }
});

router.get('/createadmin', isAuth,async function(req, res) {
  try {
    const searchKeyword = req.query.searchKeyword
    ? {
        name: {
          $regex: req.query.searchKeyword,
          $options: 'i',
        },
      }
    : {};
    //  const user = new User({
    //    name: 'penpao',
    //    email: 'taoquangtruong621999@gmail.com',
    //    password: '1234',
    //   isAdmin: true,
    //  });
    //  const newUser = await user.save();
    // res.send(newUser);
    const user=await User.find({...searchKeyword});
    res.send(user);
  } catch (error) {
    res.send({ msg: error.msg });
  }
});
router.get('/', isAuth,isAdmin,async function(req, res) {
  try {
    const category = req.query.category ? { category: req.query.category } : {};
  const searchKeyword = req.query.searchKeyword
    ? {
        name: {
          $regex: req.query.searchKeyword,
          $options: 'i',
        },
      }
    : {};
  
    //  const user = new User({
    //    name: 'penpao',
    //    email: 'taoquangtruong621999@gmail.com',
    //    password: '1234',
    //   isAdmin: true,
    //  });
    //  const newUser = await user.save();
    // res.send(newUser);
    const user=await User.find({ ...category, ...searchKeyword })
    res.send(user);
  } catch (error) {
    
  }
  
 
});

router.get('/:id', isAuth,isAdmin,async function(req, res) {
  const user = await User.findOne({ _id: req.params.id });
  if (user) {
    res.send(user);
  } else {
    res.status(404).send({ message: 'Product Not Found.' });
  }
 
});
router.delete('/:id', isAuth, async (req, res) => {
  const deletedUser = await User.findById(req.params.id);
  if (deletedUser) {
    await deletedUser.remove();
    res.send({ message: 'User Deleted' });
  } else {
    res.send('Error in Deletion.');
  }
});
export default router;
