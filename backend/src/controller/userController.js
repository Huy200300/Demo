const userService = require("../services/userService");
const jwtService = require("../services/jtwServices");

const getAllUsers = async (req, res) => {
  try {
    const respone = await userService.getAllUsers();
    return res.status(200).json(respone);
  } catch (error) {
    return res.status(404).json({ message: error });
  }
};

const createrUser = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, phone } = req.body;
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const isCheckEmail = reg.test(email);

    if (!name || !email || !password || !phone || !confirmPassword) {
      return res
        .status(200)
        .json({ status: "error", message: "the input is required" });
    } else if (!isCheckEmail) {
      return res
        .status(200)
        .json({ status: "error", message: "the input is email" });
    } else if (password !== confirmPassword) {
      return res.status(200).json({
        status: "error",
        message: "the password equal confirmPassword",
      });
    }

    const respone = await userService.createUser(req.body);
    return res.status(200).json(respone);
  } catch (error) {
    return res.status(404).json({ message: error });
  }
};

const userLogin = async (req, res) => {
  const { email, password } = req.body;
  const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const isCheckEmail = reg.test(email);
  try {
    if (!email || !password) {
      return res
        .status(200)
        .json({ status: "error", message: "the input required" });
    } else if (!isCheckEmail) {
      return res
        .status(200)
        .json({ status: "error", message: "the input email" });
    }
    const respone = await userService.loginUser(req.body);
    const { refresh_token, ...newRespone } = respone;
    res.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      secure: false,
      samesite: 'strict'
    });
    return res.status(200).json(newRespone);
  } catch (error) {
    return res.status(404).json({ message: error });
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const data = req.body;
    if (!userId) {
      return res.status(200).json({
        status: "error",
        message: "the userId is  required",
      });
    }
    const respone = await userService.updateUser(userId, data);
    return res.status(200).json(respone);
  } catch (error) {
    return res.status(404).json({ message: error });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(200).json({
        status: "error",
        message: "the userId is required",
      });
    }
    const respone = await userService.deleteUser(userId);
    return res.status(200).json(respone);
  } catch (error) {
    return res.status(404).json({ message: error });
  }
};

const getUsersDetail = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(200).json({
        status: "error",
        message: "the userId is required",
      });
    }
    const respone = await userService.getUsersDetail(userId);
    return res.status(200).json(respone);
  } catch (error) {
    return res.status(404).json({ message: error });
  }
};

const refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refresh_token
    if (!token) {
      return res.status(200).json({
        status: "error",
        message: "the refreshToken is required",
      });
    }
    const respone = await jwtService.refreshTokenJwt(token);
    return res.status(200).json(respone);
  } catch (error) {
    return res.status(404).json({ message: error });
  }
};

const userLogout = async (req, res) => {
  try {
    res.clearCookie('refresh_token');
    return res.status(200).json({
      status: "success",
      message: "logout success",
    });
  } catch (error) {
    return res.status(404).json({ message: error });
  }
};

const deleteManyUser =  async (req, res) => {
  try {
    const ids = req.body.ids;
    if (!ids) {
      return res.status(404).json({
        status: "error",
        message: "user not found",
      })
    }
    const respone = await userService.deleteManyUser(ids);
    return res.status(200).json(respone);
  } catch (error) {
    return res.status(404).json({ message:error });
  }
};

module.exports = {
  createrUser,
  userLogin,
  updateUser,
  deleteUser,
  getAllUsers,
  getUsersDetail,
  refreshToken,
  userLogout,
  deleteManyUser
};
