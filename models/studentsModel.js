import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";

const studentSchema = new mongoose.Schema(
  {
    currency: {
      type: String,
      required: [true, "Currency is required"],
      trim: true,
    },

    studentName: {
      type: String,
      required: [true, "Student name is required"],
      trim: true,
    },

    parentName: {
      type: String,
      required: [true, "Parent name is required"],
      trim: true,
    },

    parentEmailId: {
      type: String,
      required: [true, "Parent email is required"],
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, "Invalid parent email address"],
    },

    mobileNo: {
      type: String,
      required: [true, "Mobile number is required"],
      trim: true,
      validate: {
        validator: function (v) {
          return /^[0-9]{10}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid mobile number!`,
      },
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },

    standard: {
      type: String,
      required: [true, "Standard/Class is required"],
      trim: true,
    },

    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },

    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
    },

    country: {
      type: String,
      required: [true, "Country is required"],
      trim: true,
    },

    pinCode: {
      type: String,
      required: [true, "Pincode is required"],
      trim: true,
      validate: {
        validator: function (v) {
          return /^[0-9]{6}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid pincode!`,
      },
    },

    schoolName: {
      type: String,
      required: [true, "School name is required"],
      trim: true,
    },

    schoolAddress: {
      type: String,
      required: [true, "School address is required"],
      trim: true,
    },

    schoolCity: {
      type: String,
      required: [true, "School city is required"],
      trim: true,
    },

    schoolPincode: {
      type: String,
      required: [true, "School pincode is required"],
      trim: true,
      validate: {
        validator: function (v) {
          return /^[0-9]{6}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid school pincode!`,
      },
    },

    academicYear: {
      type: String,
      required: [true, "Academic year is required"],
      trim: true,
    },
    otp: {
      type: String,
      default: null,
    },
    otpExpire: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

//HASH FUNCTION FOR PASSWORD ENCRYPT
studentSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
});

//COMPARE FUNCTION FOR PASSWORD WHILE LOGIN(PASSWORD DECRYPT)
studentSchema.methods.comparePassword = async function (plainPassword) {
  return await bcrypt.compare(plainPassword, this.password);
};

//JWT TOKEN
studentSchema.methods.generateToken = function () {
  return JWT.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

const studentModel = mongoose.model("students", studentSchema);
export default studentModel;
