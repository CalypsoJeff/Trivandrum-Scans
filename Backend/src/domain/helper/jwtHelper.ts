import jwt from 'jsonwebtoken';
const SECRET_KEY = "YOUR_SECRET_KEY";
const REFRESH_SECRET_KEY = "REFRESH_SECRET_KEY"

export const generateToken = (user: string, email: string, role: string) => {
    const token = jwt.sign({ user: user, email: email, role: role }, SECRET_KEY, {
        expiresIn: '10m'
    });
    const refreshToken = jwt.sign({ user: user, email: email, role: role }, REFRESH_SECRET_KEY, {
        expiresIn: '5d',
    });
    return { token, refreshToken }
};

export const generateResetToken = (email: string) => {
    const resetToken = jwt.sign({ email }, SECRET_KEY, { expiresIn: '15m' }); // Short expiration
    return resetToken;
};
// Token Validation Function
export const validateResetToken = (token: string, email: string): boolean => {
    try {
        const decoded = jwt.verify(token, SECRET_KEY) as { email: string };

        // Check if the token's email matches the user's email
        if (decoded.email !== email) {
            throw new Error("Token validation failed: Email mismatch");
        }

        return true; // Token is valid
    } catch (error) {
        console.error("Token validation error:", error);
        return false; // Token is invalid
    }
};
