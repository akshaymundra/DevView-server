import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

/**
 * Hashes a password using bcrypt.
 * @param password - The password to be hashed.
 * @returns A promise that resolves to the hashed password.
 * @throws An error if there is an issue hashing the password.
 */
export const hashPassword = async (password: string): Promise<string> => {
    const hashedPass = await bcrypt.hash(password, 10);
    if (hashedPass) {
        return hashedPass;
    } else {
        throw new Error('Error hashing password');
    }
}


/**
 * Validates a password by comparing it with a hash.
 * @param password - The password to validate.
 * @param hash - The hash to compare the password with.
 * @returns A boolean indicating whether the password is valid or not.
 */
export const validatePassword = async (password: string, hash: string) => {
    const res = await bcrypt.compare(password, hash);

    if (res) {
        return true;
    }
    else {
        return false;
    }
}


export const issueJwt = (user: any) => {
    const _id = user._id;
    const expiresIn = '3d';

    const payload = {
        sub: _id,
        iat: Date.now()
    };
    const secretKey = process.env.JWT_SECRET || "secret-key";

    const signedToken = jwt.sign(payload, secretKey, { expiresIn: expiresIn });

    return {
        token: "Bearer " + signedToken,
        expires: expiresIn
    }
}
