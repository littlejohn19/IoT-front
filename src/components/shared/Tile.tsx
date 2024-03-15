import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';
import OpacityIcon from '@mui/icons-material/Opacity';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {Link} from 'react-router-dom';
import {DataModel} from "../../models/data.model";

interface TileProps {
    data: DataModel | null;
    id?: string | number,
    hasData?: boolean,
    active?: boolean
}

function Tile({id, active = false, hasData, data}: TileProps) {

    return (
        <Card className={`tile-device-inside ${active ? 'active' : ''}`} sx={{minWidth: 275}}>
            <CardContent style={{height: '200px'}}>
                <Typography style={{borderBottom: '5px solid #fff', paddingBottom: '10px'}} variant="h5"
                            component="div">
                    Device {id}
                </Typography>
                {!hasData && <Typography variant="h6"
                                         component="div">
                    No data
                </Typography>}
                {hasData && <Typography style={{paddingTop: '10px'}} component="div">
                    <Typography variant="h6" component="div">
                        <DeviceThermostatIcon></DeviceThermostatIcon>
                        {data?.temperature} <span>&deg;C</span>
                    </Typography>
                    <Typography variant="h6" component="div">
                        <CloudUploadIcon></CloudUploadIcon>
                        {data?.pressure} hPa
                    </Typography>
                    <Typography variant="h6" component="div">
                        <OpacityIcon></OpacityIcon>
                        {data?.humidity}%
                    </Typography>
                </Typography>}
            </CardContent>
            <CardActions>
                <Button size="small" component={Link} to={`/device/${id}`}>Details</Button>
            </CardActions>
        </Card>

    );
}

export default Tile;
