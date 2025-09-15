import schoolModel from "../models/schoolModels.js";

//SCHOOL REGISTRATION
export const schoolRegistrationController = async (req, res) => {
  try {
    const {
      schoolName,
      schoolOfficeNumber,
      mobileNo,
      password,
      schoolAddress,
      state,
      district,
      city,
      taluka,
      pinCode,
      schoolEmailId,
    } = req.body;

    if (
      !schoolName ||
      !schoolOfficeNumber ||
      !mobileNo ||
      !password ||
      !schoolAddress ||
      !state ||
      !district ||
      !city ||
      !taluka ||
      !pinCode ||
      !schoolEmailId
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    // 🔄 Duplicate email/mobile check (extra safety)
    const existingSchool = await schoolModel.findOne({
      $or: [{ mobileNo }, { schoolEmailId }],
    });
    if (existingSchool) {
      return res.status(400).json({
        success: false,
        message: "School with same mobile or email already exists",
      });
    }
    // ✅ New School create
    const newSchool = await schoolModel.create({
      schoolName,
      schoolOfficeNumber,
      mobileNo,
      password,
      schoolAddress,
      state,
      district,
      city,
      taluka,
      pinCode,
      schoolEmailId,
    });

    return res.status(201).json({
      success: true,
      message: "School created successfully",
      school: newSchool,
    });
  } catch (error) {
    console.error("❌ Error in addSchoolController:", error);
    return res.status(500).json({
      success: false,
      message: "Server error, please try again later",
      error: error.message,
    });
  }
};

//SCHOOL LOGIN
export const schoolLoginController = async (req, res) => {
  try {
    const { emailId, mobileNo, password } = req.body;

    // validate input
    if ((!emailId && !mobileNo) || !password) {
      return res.status(400).send({
        success: false,
        message: "Please provide email/mobile and password",
      });
    }

    // ✅ Extra password validation
    if (typeof password !== "string" || password.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Password is required and must be a non-empty string",
      });
    }

    // find user by email or mobile
    const user = await schoolModel.findOne({
      $or: [{ schoolEmailId: emailId }, { mobileNo: mobileNo }],
    });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    // check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).send({
        success: false,
        message: "Invalid password",
      });
    }

    // generate token
    const token = user.generateToken();

    // send response with cookie
    res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        secure: true, // ✅ only send over HTTPS
        sameSite: "None", // ✅ important for cross-origin
        expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      })
      .send({
        success: true,
        message: "LOGIN SUCCESSFUL",
        token,
      });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error in LOGIN API",
    });
  }
};

//SCHOOL LOGOUT
export const schoolLogout = async (req, res) => {
  try {
    res
      .status(200)
      .cookie("token", "", {
        expires: new Date(Date.now()),
      })
      .send({
        success: true,
        message: "Logout Successfully",
      });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In Logout API",
      error,
    });
  }
};
