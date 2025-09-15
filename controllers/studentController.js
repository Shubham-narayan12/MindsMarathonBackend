import studentModel from "../models/studentsModel.js"; // 👈 apne model ka path sahi rakho

// STUDENT REGISTRATION CONTROLLER
export const studentRegistrationController = async (req, res) => {
  try {
    const {
      currency,
      studentName,
      parentName,
      parentEmailId,
      mobileNo,
      password,
      standard,
      address,
      city,
      country,
      pinCode,
      schoolName,
      schoolAddress,
      schoolCity,
      schoolPincode,
      academicYear,
    } = req.body;

    // 🔎 1. Required fields check
    if (
      !currency ||
      !studentName ||
      !parentName ||
      !parentEmailId ||
      !mobileNo ||
      !password ||
      !standard ||
      !address ||
      !city ||
      !country ||
      !pinCode ||
      !schoolName ||
      !schoolAddress ||
      !schoolCity ||
      !schoolPincode ||
      !academicYear
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // 🔎 2. Duplicate check (parentEmailId OR mobileNo same nahi hona chahiye)
    const existingStudent = await studentModel.findOne({
      $or: [{ mobileNo }, { parentEmailId }],
    });

    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: "Student with same mobile or parent email already exists",
      });
    }

    // ✅ 3. Student create
    const newStudent = await studentModel.create({
      currency,
      studentName,
      parentName,
      parentEmailId,
      mobileNo,
      password,
      standard,
      address,
      city,
      country,
      pinCode,
      schoolName,
      schoolAddress,
      schoolCity,
      schoolPincode,
      academicYear,
    });

    return res.status(201).json({
      success: true,
      message: "Student registered successfully",
      student: newStudent,
    });
  } catch (error) {
    console.error("❌ Error in studentRegistrationController:", error);
    return res.status(500).json({
      success: false,
      message: "Server error, please try again later",
      error: error.message,
    });
  }
};

//STUDENTS LOGIN
export const studentLoginController = async (req, res) => {
  try {
    const { emailId, mobileNo, password } = req.body;

    // validate input
    if ((!emailId && !mobileNo) || !password) {
      return res.status(400).send({
        success: false,
        message: "Please provide email/mobile and password",
      });
    }

    // find user by email or mobile
    const user = await studentModel.findOne({
      $or: [{ parentEmailId: emailId }, { mobileNo: mobileNo }],
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

//STUDENT LOGOUT
export const studentLogoutController = async (req, res) => {
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
      message: "Error In LOgout API",
      error,
    }); 
  }
};
