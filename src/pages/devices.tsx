import LightbulbIcon from '@mui/icons-material/Lightbulb';
import ShowerIcon from '@mui/icons-material/Shower';
import { Box } from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Stack from '@mui/system/Stack';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import DeviceCard from '../components/deviceCard';

export default function DevicesList() {
  const navigate = useNavigate();

  const [sensors, setSensors] = useState([]);
  const [devices, setDevices] = useState([]);
  const [hasLoaded, setHasLoaded] = useState(false);

  const fetchInfo = () => {
    const bearer_token = `Bearer ${localStorage.getItem('token')}`;
    const config = {
      headers: {
        Authorization: bearer_token,
      },
    };
    axios
      .get(`http://localhost:3001/api/record/getAllSensors`)
      .then((res) => {
        setSensors(res.data);
      })
      .catch((err) => {});
    axios
      .get(`http://localhost:3001/api/device/getAllDevices`, config)
      .then((res) => {
        setDevices(res.data);
      })
      .catch((err) => {
        logOut('Vui lòng đăng nhập lại để truy cập vào ứng dụng');
      });
    if (sensors && devices) {
      setHasLoaded(true);
    }
    return 0;
  };

  const logOut = (error_message) => {
    localStorage.clear();
    navigate(
      '/login',
      error_message && {
        state: { error: true, message: error_message },
      },
    );
  };

  useEffect(() => {
    const interval = setInterval(() => fetchInfo(), 3000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <Stack
      component="main"
      spacing={3}
      sx={{ flexGrow: 1, bgcolor: 'background.default', px: 2, paddingLeft: 34 }}
    >
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={!hasLoaded}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="h6">Các thiết bị cảm biến</Typography>
      </Box>
      <Stack direction="row" spacing={2}>
        {sensors.map((item, index) => (
          <DeviceCard
            key={index}
            item="sensor"
            name={item.name}
            id={item.id}
            icon={<LightbulbIcon />}
          />
        ))}
      </Stack>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="h6">Các thiết bị đầu ra</Typography>
      </Box>
      <Stack direction="row" spacing={2}>
        {/* {console.log(devices)} */}
        {devices.map((item, index) => (
          <DeviceCard
            key={index}
            item="device"
            name={item.name}
            id={item.id}
            icon={<ShowerIcon />}
            // imagePath={item.image}
          />
        ))}
      </Stack>
    </Stack>
  );
}
