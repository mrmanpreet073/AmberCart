import { User } from "../Models/userModel.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { sendResetPasswordEmail, sendVerificationEmail } from "../../../Common/Configuration/email.js";
import { Session } from "../Models/userSessionModel.js";
import crypto from 'crypto'
import { log } from "console";
import cloudinary from "../../../Common/Utils/cloudnary.js";
import { singleUpload, multiUpload } from "../../../Common/Middleware/multer.js";
import axios from "axios";


export const register = async (req, res) => {

    try {
        const { firstName, lastName, email, password } = req.body;

        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'All feilds are required'
            })
        }

        const user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({
                success: false,
                message: 'User Already Existed'
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword
        })

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "10m" })

        newUser.token = token;
        await newUser.save();

        sendVerificationEmail(email, token)

        if (newUser) {
            return res.status(201).json({
                success: true,
                message: 'User Created Successfully',
                user: newUser
            })
        }

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }

}

export const verify = async (req, res) => {

    try {
        const authHeader = req.headers.authorization;
        // console.log("authHeader", authHeader);

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(400).json({
                success: false,
                message: "Authorization Token is Invalid or Token"
            })
        }

        const token = authHeader.split(" ")[1]

        let decoded;

        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET)
        } catch (error) {

            if (error.name === "TokenExpiredError") {
                return res.status(401).json({
                    success: false,
                    message: "Token Expired .........."
                })
            }

            return res.status(401).json({
                success: false,
                message: "Token Verification Failed"
            })
        }

        const user = await User.findById(decoded.id)
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User Not Found"
            })
        }

        if (user.isVerified) {
            return res.status(400).json({
                success: false,
                message: "User Already Verified"
            })
        }

        user.token = null
        user.isVerified = true

        await user.save()

        return res.status(200).json({
            success: true,
            message: "User Verified Successfully",
            user
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message

        })
    }



}

export const reVerify = async (req, res) => {

    try {

        const { email } = req.body;
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "user not found"

            })
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "10m" })

        user.token = token;
        await user.save();

        await sendVerificationEmail(email, token)

        return res.status(200).json({
            success: true,
            message: "Verification email sent again successfully",
            token
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }

}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            return res.status(400).json({
                success: false,
                message: "User does not exist"
            });
        }

        const isMatch = await bcrypt.compare(password, existingUser.password);

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid Credentials"
            });
        }

        if (existingUser.isVerified === false) {
            return res.status(400).json({
                success: false,
                message: "Verify your account before login"
            });
        }

        // Generate tokens
        const accessToken = jwt.sign(
            { id: existingUser._id },
            process.env.JWT_ACC_SECRET,
            { expiresIn: "15m" } // short-lived now
        );
        const refreshToken = jwt.sign(
            { id: existingUser._id },
            process.env.JWT_REF_SECRET,
            { expiresIn: "20d" }
        );

        const hashedRef = crypto.createHash('sha256')
            .update(refreshToken)
            .digest('hex');

        existingUser.isLoggedIn = true;
        await existingUser.save();

        // Replace any existing session (single-session-per-user model)
        await Session.findOneAndDelete({ userId: existingUser._id });

        await Session.create({
            userId: existingUser._id,
            refreshToken: hashedRef,
            expiresAt: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000) // 20 days
        });

        // Refresh token → httpOnly cookie (JS can't read it, browser auto-sends it)
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // HTTPS only in prod
            sameSite: "none", 
            maxAge: 20 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            success: true,
            message: `Welcome ${existingUser.firstName}`,
            user: existingUser,
            accessToken // only the access token goes in the JSON body
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const googleLogin = async (req, res) => {
    try {
        const { token } = req.body;

        // verify token with Google — get user info
        const googleRes = await axios.get(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            { headers: { Authorization: `Bearer ${token}` } }
        );

        const { email, given_name, family_name, sub } = googleRes.data;

        // find or create user — same as before
        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                firstName: given_name,
                lastName: family_name,
                email,
                googleId: sub,
                isVerified: true,
                password: null,
            });
        }

        // generate YOUR tokens — exact same as normal login
        const accessToken = jwt.sign(
            { id: user._id },
            process.env.JWT_ACC_SECRET,
            { expiresIn: "5d" }
        );

        const refreshToken = jwt.sign(
            { id: user._id },
            process.env.JWT_REF_SECRET,
            { expiresIn: "7d" }
        );

        const hashedRef = crypto
            .createHash("sha256")
            .update(refreshToken)
            .digest("hex");

        await Session.findOneAndDelete({ userId: user._id });
        await Session.create({ userId: user._id, refreshToken: hashedRef });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            success: true,
            message: `Welcome ${user.firstName}`,
            user,
            accessToken
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const logout = async (req, res) => {
    try {
        const incomingRefreshToken = req.cookies?.refreshToken;

        if (incomingRefreshToken) {
            const hashedIncoming = crypto.createHash('sha256')
                .update(incomingRefreshToken)
                .digest('hex');

            await Session.findOneAndDelete({ refreshToken: hashedIncoming });
        }

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict"
        });

        return res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const forgotPassword = async (req, res) => {

    try {
        const { email } = req.body

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Account not Existed"
            });
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 1000 * 60 * 5);
        const hashedOtp = await bcrypt.hash(otp, 10)
        user.otp = hashedOtp;
        user.otpExpiry = otpExpiry;

        await user.save();

        sendResetPasswordEmail(email, otp)

        return res.status(200).json({
            success: true,
            message: "OTP sent Successfylly"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }

};

export const verifyOtp = async (req, res) => {

    try {
        const { otp, newPassword } = req.body;
        const email = req.params.email
        if (!otp) {
            return res.status(400).json({
                success: false,
                message: "OTP is required"
            });
        }
        if (!newPassword) {
            return res.status(400).json({
                success: false,
                message: "New password is required"
            });
        }


        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            });
        }
        const currentTime = new Date();

        if (user.otpExpiry < currentTime) {
            user.otp = null;
            user.otpExpiry = null;
            await user.save();

            return res.status(400).json({
                success: false,
                message: "OTP has expired. Please request a new OTP"
            });
        }

        const isMatch = await bcrypt.compare(otp, user.otp);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10)
        user.password = hashedPassword;
        await user.save()

        return res.status(200).json({
            success: true,
            message: "Password Updated Successfuly"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }

};

export const allUsers = async (req, res) => {

    try {
        const users = await User.find();
        return res.status(200).json({
            success: true,
            message: "User Fetched Successfully",
            users
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }

};


export const getUserById = async (req, res) => {

    try {
        const { userId } = req.params;
        const user = await User.findById(userId).select("-password -otp -otpExpiry -token")

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User Not Found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "User Found Successfully",
            user
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }

};

export const updateUser = async (req, res) => {

    try {
        const userIdToUpdate = req.params.id; // id of the user we want to update
        // console.log('userIdToUpdate', userIdToUpdate);

        const loggedInUser = req.user // from auth middleware 
        // console.log("REQ body", req.body);

        const { firstName, lastName, email, address, zipCode, city, phoneNumber, role } = req.body

        // console.log("loggenInUser id = ", loggedInUser._id.toString());

        if (userIdToUpdate !== loggedInUser._id.toString() && loggedInUser.role != "admin") {
            return res.status(403).json({
                success: false,
                message: "You are not allow to update this profile"
            });
        }
        const user = await User.findById(userIdToUpdate); if (!user) {
            return res.status(404).json({
                success: false,
                message: "User Not Existed"
            });
        }
        let profilePic = user.profilePic;
        let profilePicPublicId = user.profilePicPublicId

        if (req.file) {
            if (profilePicPublicId) {
                await cloudinary.uploader.destroy(profilePicPublicId)
            }
            const uploadResult = await new Promise((resolve, reject) => {
                cloudinary.uploader
                    .upload_stream(
                        {
                            folder: "Profiles",
                        },
                        (error, result) => {
                            if (error) return reject(error);
                            resolve(result);
                        }
                    )
                    .end(req.file.buffer);
            });
            // console.log("Upload Result = ", uploadResult);

            profilePic = uploadResult.secure_url
            profilePicPublicId = uploadResult.public_id





        }

        if (firstName !== undefined) user.firstName = firstName;
        if (lastName !== undefined) user.lastName = lastName;
        if (email !== undefined) user.email = email;
        if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;
        if (address !== undefined) user.address = address;
        if (city !== undefined) user.city = city;
        if (zipCode !== undefined) user.zipCode = zipCode;
        if (profilePic !== undefined) user.profilePic = profilePic;
        if (profilePicPublicId !== undefined) user.profilePicPublicId = profilePicPublicId;
        if (role !== undefined) user.role = role;


        const updatedUser = await user.save();
        return res.status(200).json({
            success: true,
            message: "Profile Updated Successfully",
            user: updatedUser
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }

};

export const refresh = async (req, res) => {
    try {
        const incomingRefreshToken = req.cookies?.refreshToken;

        if (!incomingRefreshToken) {
            return res.status(401).json({
                success: false,
                message: "No refresh token provided"
            });
        }

        // 1. Verify JWT signature + expiry
        let decoded;
        try {
            decoded = jwt.verify(incomingRefreshToken, process.env.JWT_REF_SECRET);
        } catch (err) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired refresh token"
            });
        }

        // 2. Check it matches what's stored server-side (hashed)
        const hashedIncoming = crypto.createHash('sha256')
            .update(incomingRefreshToken)
            .digest('hex');

        const session = await Session.findOne({
            userId: decoded.id,
            refreshToken: hashedIncoming
        });

        if (!session) {
            // Token was valid JWT but not the one on file → possible reuse/theft
            return res.status(401).json({
                success: false,
                message: "Session not found, please login again"
            });
        }

        // 3. Issue a new access token
        const newAccessToken = jwt.sign(
            { id: decoded.id },
            process.env.JWT_ACC_SECRET,
            { expiresIn: "15m" }
        );

        return res.status(200).json({
            success: true,
            accessToken: newAccessToken
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};