"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.signup = exports.login = void 0;
const bcrypt_1 = require("bcrypt");
const User_model_1 = require("../models/User.model");
const util_1 = require("../utils/util");
// user login
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield User_model_1.User.findOne({ email });
        const isTrue = yield (0, bcrypt_1.compare)(password, (user === null || user === void 0 ? void 0 : user.password) || '');
        if (!user || !isTrue) {
            return res.status(400).json({ error: "Invalid email or password" });
        }
        yield (0, util_1.generateToken)({ userid: user._id, res });
        res.status(201).json({ fullName: user.fullName, email: user.email, profilePic: user.profilePic });
    }
    catch (e) {
        console.log("error in login", e.message);
        res.status(500).json({ error: "internal server error" });
    }
});
exports.login = login;
// user logout
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fullName, email, password, profilePic } = req.body;
    try {
        const findEmail = yield User_model_1.User.findOne({ email });
        if (!findEmail) {
            if (fullName && email && password) {
                const salt = yield (0, bcrypt_1.genSalt)(10);
                const hashedPassword = yield (0, bcrypt_1.hash)(password, salt);
                const profilePics = profilePic ? profilePic : 'https://i.pinimg.com/736x/0d/64/98/0d64989794b1a4c9d89bff571d3d5842.jpg';
                const newUser = new User_model_1.User({ fullName, email, password: hashedPassword, profilePic: profilePics });
                yield newUser.save();
                yield (0, util_1.generateToken)({ userid: newUser._id, res });
                res.status(201).json({ fullName, email, profilePics });
            }
            else {
                res.status(400).json({ error: "please fill all fields" });
            }
        }
        else {
            res.status(400).json({ error: "user already exist" });
        }
    }
    catch (e) {
        res.status(500).json({ error: "internal hh server error" });
    }
});
exports.signup = signup;
// user logout
const logout = (req, res) => {
    res.cookie("rck", "", { maxAge: 0 });
    res.status(200).json({ message: "logged out successfully" });
};
exports.logout = logout;
