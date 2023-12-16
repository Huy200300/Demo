const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const { genneralAccesstoken, genneralRefreshtoken } = require("./jtwServices");

const getAllUsers = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const userAll = await User.find();
      resolve({
        status: "success",
        message: "Users fetched successfully",
        data: userAll,
      });
    } catch (error) {
      reject(error);
    }
  });
};

const createUser = (newUser) => {
  return new Promise(async (resolve, reject) => {
    const { name, email, password, confirmPassword, phone } = newUser;

    try {
      const isEmailExist = await User.findOne({ email: email });
      if (isEmailExist !== null) {
        resolve({
          status: "error",
          message: "Email already exist",
        });
      }
      const hash = bcrypt.hashSync(password, 10);
      const user = await User.create({
        name,
        email,
        password: hash,
        phone,
      });
      if (user) {
        resolve({
          status: "success",
          message: "User created successfully",
          data: user,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

const loginUser = (loginUser) => {
  return new Promise(async (resolve, reject) => {
    const { email, password } = loginUser;

    try {
      const checkerUser = await User.findOne({ email: email });
      if (checkerUser === null) {
        resolve({
          status: "error",
          message: "Email does not already exist",
        });
      }
      const compareHash = bcrypt.compareSync(password, checkerUser.password);
      if (!compareHash) {
        resolve({
          status: "error",
          message: "The password is incorrect or has already been changed",
        });
      }

      const access_token = await genneralAccesstoken({
        id: checkerUser.id,
        isAdmin: checkerUser.isAdmin,
      });

      const refresh_token = await genneralRefreshtoken({
        id: checkerUser.id,
        isAdmin: checkerUser.isAdmin,
      });

      resolve({
        status: "success",
        message: "Login was successful",
        access_token,
        refresh_token,
      });
    } catch (error) {
      reject(error);
    }
  });
};

const updateUser = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const userId = await User.findOne({ _id: id });
      const updatedUser = await User.findByIdAndUpdate(id, data, { new: true });
      if (userId === null) {
        resolve({
          status: "error",
          message: "User not found",
        });
      }
      resolve({
        status: "success",
        message: "User updated successfully",
        data: updatedUser,
      });
    } catch (error) {
      reject(error);
    }
  });
};

const deleteUser = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const userId = await User.findOne({ _id: id });
      if (userId === null) {
        resolve({
          status: "error",
          message: "User not found",
        });
      }
      await User.findByIdAndDelete(id);
      resolve({
        status: "success",
        message: "User deleted successfully",
      });
    } catch (error) {
      reject(error);
    }
  });
};

const getUsersDetail = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const userId = await User.findOne({ _id: id });
      if (userId === null) {
        resolve({
          status: "error",
          message: "User not found",
        });
      }
      resolve({
        status: "success",
        message: "User fetched successfully",
        data: userId,
      });
    } catch (error) {
      reject(error);
    }
  });
};

const deleteManyUser = (ids) => {
  return new Promise(async (resolve, reject) => {
    try {
      await User.deleteMany({ _id: ids });
      resolve({
        status: "success",
        message: "User deleted successfully",
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  createUser,
  loginUser,
  updateUser,
  deleteUser,
  getAllUsers,
  getUsersDetail,
  deleteManyUser,
};
