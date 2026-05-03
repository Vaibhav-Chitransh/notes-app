import { User } from "../models/user.model.js";
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import config from '../config/config.js'

const generateAccessToken = (user) => {
    return jwt.sign({id: user._id}, config.ACCESS_TOKEN_SECRET, {expiresIn: '15m'});
}

const generateRefreshToken = (user) => {
    return jwt.sign({id: user._id}, config.REFRESH_TOKEN_SECRET, {expiresIn: '7d'});
}

const cookieOptions = {
    httpOnly: true,
    secure: config.NODE_ENV === 'production',
    sameSite: 'lax',
}

export const signup = async (req, res) => {
    try {
        const {name, email, password} = req.body;

        if(!name || !email || !password) return res.status(400).json({message: 'All fields are required'});

        const isAlreadyPresent = await User.findOne({email});
        if(isAlreadyPresent) return res.status(409).json({message: "User already exists"});

        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

        const user = await User.create({name, email, password: hashedPassword});

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        user.refreshToken = refreshToken;
        await user.save();

        res.cookie('accessToken', accessToken, {...cookieOptions, maxAge: 15*60*1000});
        res.cookie('refreshToken', refreshToken, {...cookieOptions, maxAge: 7*24*60*60*1000});

        res.status(201).json({message: "User registered successfully", user: {
            id: user._id,
            name: user.name,
            email: user.email
        }, accessToken});
    } catch (error) {
        console.log(`Error while signing up: ${error}`);
        return res.status(500).json({message: "Internal server error while signup"});
    }
}

export const login = async (req, res) => {
    try {
        const {email, password} = req.body;

        if(!email || !password) return res.status(400).json({message: 'Email and password are required'});

        const user = await User.findOne({email});
        if(!user) return res.status(401).json({message: "Invalid email or password"});

        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
        const isPasswordValid = hashedPassword == user.password;

        if(!isPasswordValid) return res.status(401).json({message: "Invalid email or password"});

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        user.refreshToken = refreshToken;
        await user.save();

        res.cookie('accessToken', accessToken, {...cookieOptions, maxAge: 15*60*1000});
        res.cookie('refreshToken', refreshToken, {...cookieOptions, maxAge: 7*24*60*60*1000});

        res.status(200).json({message: 'Logged in successfully', user: {
            id: user._id,
            name: user.name,
            email: user.email
        }, accessToken});
    } catch (error) {
        console.log(`Error while login: ${error}`);
        return res.status(500).json({message: "Internal server error while login"});
    }
}

export const logout = async (req, res) => {
    try {
        const refreshToken = req.cookies?.refreshToken;

        if(refreshToken) await User.findOneAndUpdate({refreshToken}, {$unset: {refreshToken: 1}});

        res.clearCookie('accessToken', cookieOptions);
        res.clearCookie('refreshToken', cookieOptions);

        return res.status(200).json({message: 'logged out successfully'});
    } catch (error) {
        console.log(`Error while logout: ${error}`);
        return res.status(500).json({message: "Internal server error while logout"});
    }
}