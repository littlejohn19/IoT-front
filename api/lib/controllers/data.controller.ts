import Controller from '../interfaces/controller.interface';
import {Request, Response, NextFunction, Router} from 'express';
import {checkIdParam} from '../middlewares/deviceIdParam.middleware'
import {getCurrentDateTime} from "../utils/date.service";
import DataService from "../modules/services/data.service";
import {IData} from "../modules/models/data.model";
import Joi from 'joi';

class DataController implements Controller {
    public path = '/api/data';
    public router = Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}/latest`, this.getLatestReadingsFromAllDevices);
        this.router.post(`${this.path}/:id`, checkIdParam, this.addData);
        this.router.get(`${this.path}/:id`, checkIdParam, this.getAllDeviceData);
        this.router.get(`${this.path}/:id/latest`, checkIdParam, this.getPeriodData);
        this.router.get(`${this.path}/:id/:num`, checkIdParam, this.getPeriodData);
        this.router.delete(`${this.path}/:id`, checkIdParam, this.cleanDeviceData);
    }

    private addData = async (request: Request, response: Response, next: NextFunction) => {

        const Data = new DataService;

        const { air } = request.body;
        const { id } = request.params;

        // Definicja schematu walidacji za pomocą Joi
        const schema = Joi.object({
            air: Joi.array().items(
                Joi.object({
                    id: Joi.number().integer().positive().required(),
                    value: Joi.number().positive().required()
                })
            ).unique((a, b) => a.id === b.id), // Sprawdzenie, czy wartości id są unikalne
            deviceId: Joi.number().integer().positive().valid(parseInt(id, 10)).required() // Sprawdzenie, czy deviceId jest poprawny
        });

        try {
            const validatedData = await schema.validateAsync({ air, deviceId: parseInt(id, 10) });

            const readingData: IData =
                {
                    temperature: validatedData.air[0].value,
                    pressure: validatedData.air[1].value,
                    humidity: validatedData.air[2].value,
                    deviceId: validatedData.deviceId
                }
            await Data.createData(readingData);
            response.status(200).json(readingData);
        } catch (error) {
            console.error(`Błąd walidacji danych: ${error.message}`);
            response.status(400).json({ error: 'Nieprawidłowe dane wejściowe.' });
        }
    }

    private getAllDeviceData = async (request: Request, response: Response, next: NextFunction) => {
        const {id} = request.params;

        const Data = new DataService;

        const allData = await Data.query(id);

        response.status(201).json(allData);
    }

    private getPeriodData = async (request: Request, response: Response, next: NextFunction) => {
        const {id, num} = request.params;

        let limit;

        if (!num) {
            limit = 1;
        } else {
            limit = +num;
        }

        if (isNaN(parseInt(id, 10))) {
            response.status(400).send();
            return;
        }

        const Data = new DataService;

        const allData = await Data.get(id, limit);

        response.status(201).json(allData);
    }

    private getLatestReadingsFromAllDevices = async (request: Request, response: Response, next: NextFunction) => {
        const Data = new DataService;

        const allData = await Data.getAllNewest();

        response.status(201).json(allData);
    }

    private cleanDeviceData = async (request: Request, response: Response, next: NextFunction) => {
        const {id} = request.params;
        const Data = new DataService;

        await Data.deleteData(id)
        response.sendStatus(200);
    }
}

export default DataController;
