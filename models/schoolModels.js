import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";

const schoolSchema = new mongoose.Schema(
  {
    schoolName: {
      type: String,
      required: [true, "School name is required"],
      trim: true, // ✅ extra spaces hata dega
    },
    schoolOfficeNumber: {
      type: String,
      required: [true, "School office number is required"],
      // Number me trim nahi hota, isliye skip
    },
    mobileNo: {
      type: String,
      required: [true, "Mobile number is required"],
      unique: true,
      trim: true, // ✅ spaces hata dega
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
    },
    schoolAddress: {
      type: String,
      required: [true, "School address is required"],
      trim: true,
    },
    state: {
      type: String,
      required: [true, "State is required"],
      trim: true,
    },
    district: {
      type: String,
      required: [true, "District is required"],
      trim: true,
    },
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
    },
    taluka: {
      type: String,
      required: [true, "Taluka is required"],
      trim: true,
    },
    pinCode: {
      type: String,
      required: [true, "Pin code is required"],
      trim: true,
      match: [/^[0-9]{6}$/, "Pin code must be 6 digits"],
    },
    schoolEmailId: {
      type: String,
      required: [true, "School email is required"],
      lowercase: true,
      unique: true,
      trim: true, // ✅ important: email me accidental space remove karega
      match: [/\S+@\S+\.\S+/, "Invalid email address"],
    },
    modeOfExam: {
      type: String,
      enum: ["ONLINE", "OFFLINE"],
      default: "OFFLINE",
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
schoolSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
});

//COMPARE FUNCTION FOR PASSWORD WHILE LOGIN(PASSWORD DECRYPT)
schoolSchema.methods.comparePassword = async function (plainPassword) {
  return await bcrypt.compare(plainPassword, this.password);
};

//JWT TOKEN
schoolSchema.methods.generateToken = function () {
  return JWT.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

const schoolModel = mongoose.model("Schools", schoolSchema);
export default schoolModel;
