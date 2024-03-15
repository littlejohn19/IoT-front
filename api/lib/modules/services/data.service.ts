import DataModel from '../schemas/data.schema';
import {IData} from "../models/data.model";

export default class DataService {

    public async createData(dataParams: IData) {
        try {
            const dataModel = new DataModel(dataParams);
            await dataModel.save();
        } catch (error) {
            console.error('Wystąpił błąd podczas tworzenia danych:', error);
            throw new Error('Wystąpił błąd podczas tworzenia danych');
        }
    }

    public async query(deviceID: string) {
        try {
            const data = await DataModel.find({deviceId: deviceID});
            return data;
        } catch (error) {
            throw new Error(`Query failed: ${error}`);
        }
    }


    public async get(deviceId: string, limit: number = 1) {
        try {
            const data = await DataModel.find({deviceId: deviceId}).limit(limit).sort({$natural:-1})
            return data.reverse();
        } catch (error) {
            throw new Error(`Query failed: ${error}`);
        }
    }

    public async getAllNewest() {
        const latestData:any = [];

        await Promise.all(
            Array.from({ length: 17 }, async (_, i) => {
                try {
                    const latestEntry = await DataModel.find({ deviceId: i  }).limit(1).sort({$natural:-1});
                    // console.log(latestEntry)
                    if (latestEntry.length) {
                        latestData.push(latestEntry[0]);
                    } else {
                        latestData.push({deviceId: i});
                    }
                } catch (error) {
                    console.error(`Błąd podczas pobierania danych dla urządzenia ${i + 1}: ${error.message}`);
                    latestData.push({});
                }
            })
        );

        return latestData;
    }


    public async deleteData(id: string) {
        try {
            const query = { deviceId: id };
            await DataModel.deleteMany(query);
        } catch (error) {
            console.error('Wystąpił błąd podczas usuwania danych:', error);
            throw new Error('Wystąpił błąd podczas usuwania danych');
        }
    }

}
