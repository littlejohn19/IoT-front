import {LineChart} from '@mui/x-charts/LineChart';
import {DataModel} from "../models/data.model";

interface ChartsProps {
    data: DataModel[];
}
function Charts({data}: ChartsProps) {
    const chartData = data || [].map((item: DataModel) => ({
        temperature: item.temperature,
        pressure: item.pressure,
        humidity: item.humidity,
        readingDate: new Date(item.readingDate).toISOString()
    }));

    const xLabels = chartData && chartData.map(item => new Date(item.readingDate).toLocaleString());

    if (!data?.length) {
        return (
            <>
                <h2>No data</h2>
            </>
        )
    }

    return (
        <>
            {data && <LineChart
                width={1000}
                height={300}
                series={[
                    {data: chartData.map((item:DataModel) => item.temperature !== undefined ? item.temperature : null), label: 'Temperature'},
                    {data: chartData.map((item:DataModel) => item.pressure !== undefined ? item.pressure : null), label: 'Pressure'},
                    {data: chartData.map((item:DataModel) => item.humidity !== undefined ? item.humidity : null), label: 'Humidity'},
                ]}
                xAxis={[{scaleType: 'point', data: xLabels}]}
            />}
        </>
    );
}

export default Charts;
