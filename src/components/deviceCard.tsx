import HdrAutoIcon from '@mui/icons-material/HdrAuto';
import { CardActionArea, CardActions } from '@mui/material';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import Stack from '@mui/system/Stack';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, Outlet } from 'react-router-dom';

export default function DeviceCard({
  item = 'sensor',
  name = 'device name',
  id,
  icon,
  imagePath = 'light.jpg',
}) {
  return (
    <Card sx={{ minWidth: 300 }}>
      <CardActionArea component={Link} to={'/devices/' + id}>
        <CardMedia component={'img'} height="140" image={imagePath} alt="device" />
        <CardContent>
          <Stack direction="row" justifyContent="space-between">
            <Stack direction="row" spacing={2} alignItems="center">
              {icon}
              <Typography variant="h6">{name}</Typography>
            </Stack>
          </Stack>
        </CardContent>
      </CardActionArea>
      {item == 'sensor' ? null : (
        <CardActions>
          <DeviceControls id={id} />
        </CardActions>
      )}
    </Card>
  );
}

export function DeviceControls({ id }) {
  const [open, setOpen] = useState(false);
  const [device, setDevice] = useState();
  const [autoMode, setAutoMode] = useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const fetchInfo = () => {
    const bearer_token = `Bearer ${localStorage.getItem('token')}`;
    const config = {
      headers: {
        Authorization: bearer_token,
      },
    };
    axios
      .get(`http://localhost:3001/api/device/getDeviceInfo/` + id, config)
      .then((res) => {
        res.data.autoMode ? setAutoMode(true) : setAutoMode(false);
      })
      .catch((err) => {});
  };

  useEffect(() => {
    const interval = setInterval(fetchInfo, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <Stack direction="row" spacing={2} alignItems="right">
      {/* <Switch /> */}
      <Button
        variant="contained"
        disabled={autoMode}
        onClick={() => {
          const bearer_token = `Bearer ${localStorage.getItem('token')}`;
          const config = {
            headers: {
              Authorization: bearer_token,
            },
          };
          axios
            .get(`http://localhost:3001/api/device/toggleDevice/` + id, config)
            .then((res) => {
              handleClick();
            })
            .catch((err) => {});
        }}
      >
        Bật/tắt
      </Button>
      <IconButton
        aria-label="toggle-auto"
        color={autoMode ? 'primary' : 'false'}
        onClick={() => {
          const bearer_token = `Bearer ${localStorage.getItem('token')}`;
          const config = {
            headers: {
              Authorization: bearer_token,
            },
          };
          axios
            .get(`http://localhost:3001/api/device/toggleAutoModeDevice/` + id, config)
            .then((res) => {
              res.data.device.autoMode ? setAutoMode(true) : setAutoMode(false);
            })
            .catch();
        }}
      >
        <HdrAutoIcon />
      </IconButton>
    </Stack>
  );
}

// function OutputDevices() {
//   return ();
// }
