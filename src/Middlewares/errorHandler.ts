import { Request, Response, NextFunction } from "express";

class HttpException extends Error {
    status: number;
    error: {};

    constructor(status: number, message: string, error: {}) {
        super(message);
        this.status = status;
        this.error = error;
    }
}

const errorHandler = (error: HttpException, req: Request, res: Response, next: NextFunction) => {
    const status = error.status ? error.status : 500;
    const message = error.message ? error.message : "Something went wrong";
    const errors = error.error;
    res.status(status).send({ status, message, error: errors, success: false });
}

export default errorHandler;