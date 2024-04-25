import HdrAutoIcon from '@mui/icons-material/HdrAuto';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import ShowerIcon from '@mui/icons-material/Shower';
import { CardActionArea, CardActions } from '@mui/material';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import Stack from '@mui/system/Stack';
import axios from 'axios';

export default function DeviceCard({ item = 'sensor', name = 'device name', id }) {
  return (
    <Card sx={{ minWidth: 300 }}>
      <CardActionArea>
        <CardMedia component="img" height="140" image="/light.jpg" alt="device" />
        <CardContent>
          <Stack direction="row" justifyContent="space-between">
            <Stack direction="row" spacing={2} alignItems="center">
              {item == 'lights' ? <LightbulbIcon /> : <ShowerIcon />}
              {item == 'lights' ? (
                <Typography variant="h6">{name}</Typography>
              ) : (
                <Typography variant="h6">{name}</Typography>
              )}
            </Stack>
          </Stack>
        </CardContent>
      </CardActionArea>
      {item == 'sensor' ? (
        ''
      ) : (
        <CardActions>
          <DeviceControls id={id} />
        </CardActions>
      )}
    </Card>
  );
}

function DeviceControls({ id }) {
  return (
    <Stack direction="row" spacing={2} alignItems="right">
      {/* <Switch /> */}
      <Button
        variant="contained"
        onClick={() => {
          const bearer_token = `Bearer ${localStorage.getItem('token')}`;
          const config = {
            headers: {
              Authorization: bearer_token,
            },
          };
          axios.get(`http://localhost:3001/api/device/toggleDevice/` + id, config);
        }}
      >
        Bật/tắt
      </Button>
      <IconButton aria-label="delete">
        <HdrAutoIcon />
      </IconButton>
    </Stack>
  );
}

// function OutputDevices() {
//   return ();
// }
  