import { userModal } from "../modals/usersModal.js";

const register = async (req, res) => {
  try {
    const { userName, email, password, confrimPassword } = req.body;

    const userExists = userModal.findOne(email);
    if (userExists) {
      return res
        .status(400)
        .json({ success: false, message: "user is already exists" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error });
    console.log("Register Catch Error ::::::::-");
  }
};

export { register };
