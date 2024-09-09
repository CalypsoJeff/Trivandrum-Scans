import { log } from "console";

const jwt = require ('jsonwebtoken')
const SECRET_KEY = "YOUR_SECRET_KEY"; 
const REFRESH_SECRET_KEY = "REFRESH_SECRET_KEY"

export const generateToken = (user: string, email: string,) => {
    const token = jwt.sign({user: user, email: email }, SECRET_KEY, {
        expiresIn: '2h'
    });

    const refreshToken = jwt.sign({user: user, email: email }, REFRESH_SECRET_KEY, {
        expiresIn: '5d',
    });

    

    return {token,refreshToken}
};

