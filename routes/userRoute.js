const express = require('express');
const {
  userSignup,
  userForgotPassword,
  userResetPassword,
  userLogout,
  getUsersList,
  getUserById,
  updateUserData,
  deleteUsers,
  blockUsers,
  getAdminProfile,
  updateAdminProfile,
  userUpdateProfile,
  userLogin,
  adminLogin,
  getProfile,
  getAllContentProvider,
  invitePcpUser,
} = require('../controllers/userController');
const {
  isAuthenticatedUser,
  authorizationRoles,
} = require('../middlerwere/authentication');

const router = express.Router();

//Authentication Routes
router.post('/userSignup', userSignup);
router.post('/adminLogin', adminLogin);
router.post('/userForgotPassword', userForgotPassword);
router.patch('/userResetPassword/:token', userResetPassword);
router.get('/userLogout', isAuthenticatedUser, userLogout);

//For Admin Profile
router.get('/getAdminProfile/:id', getAdminProfile);
router.patch('/updateAdminProfile/:id', updateAdminProfile);

// for admin only
router.get(
  '/getUsers',
  isAuthenticatedUser,
  authorizationRoles('admin'),
  getUsersList
);

router.get(
  '/getuser/:id',
  isAuthenticatedUser,
  authorizationRoles('admin'),
  getUserById
);

router.put(
  '/updateuser/:id',
  isAuthenticatedUser,
  authorizationRoles('admin'),
  updateUserData
);

router.delete(
  '/deleteusers',
  isAuthenticatedUser,
  authorizationRoles('admin'),
  deleteUsers
);

router.put(
  '/blockusers',
  isAuthenticatedUser,
  authorizationRoles('admin'),
  blockUsers
);

//Mobile APIS
router.patch('/userUpdateProfile/:id', userUpdateProfile);
router.post('/userLogin', userLogin);
router.get('/getProfile/:id', getProfile);
router.get(
  '/getAllPcp',
  isAuthenticatedUser,
  authorizationRoles('admin'),
  getAllContentProvider
);

router.post(
  '/invite',
  isAuthenticatedUser,
  authorizationRoles('admin'),
  invitePcpUser
);

module.exports = router;
