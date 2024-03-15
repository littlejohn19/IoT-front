import { RequestHandler, Request, Response, NextFunction } from 'express';
import { config } from "../config";

export const checkIdParam: RequestHandler = (request: Request, response: Response, next: NextFunction) => {
    const { id } = request.params;
    if (parseInt(id, 10) >= config.supportedDevicesNum) {
        return response.status(400).send('Brak parametru ID.');
    }
    next();
};
