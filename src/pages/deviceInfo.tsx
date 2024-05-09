import { Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Slider from '@mui/material/Slider';
import Snackbar, { SnackbarOrigin } from '@mui/material/Snackbar';
import Stack from '@mui/system/Stack';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Form, useLoaderData } from 'react-router-dom';

import { DeviceControls } from '../components/deviceCard';

interface Device {
  id: number;
  name: string;
  autoMode: string;
  thresholdValue: string;
  thresholdType: string;
}

interface State extends SnackbarOrigin {
  open: boolean;
  message: string;
}

interface LoaderParams {
  deviceID: number;
}

function valuetext(value: number) {
  return `${value}°C`;
}

const marks = [
  {
    value: 0,
    label: '0',
  },
  {
    value: 10,
    label: '10',
  },
  {
    value: 20,
    label: '20',
  },
  {
    value: 30,
    label: '30',
  },
  {
    value: 40,
    label: '40',
  },
  {
    value: 50,
    label: '50',
  },
  {
    value: 60,
    label: '60',
  },
  {
    value: 70,
    label: '70',
  },
  {
    value: 80,
    label: '80',
  },
  {
    value: 90,
    label: '90',
  },
  {
    value: 100,
    label: '100',
  },
];

const marksPercent = [
  {
    value: 0,
    label: '0%',
  },
  {
    value: 10,
    label: '10%',
  },
  {
    value: 20,
    label: '20%',
  },
  {
    value: 30,
    label: '30%',
  },
  {
    value: 40,
    label: '40%',
  },
  {
    value: 50,
    label: '50%',
  },
  {
    value: 60,
    label: '60%',
  },
  {
    value: 70,
    label: '70%',
  },
  {
    value: 80,
    label: '80%',
  },
  {
    value: 90,
    label: '90%',
  },
  {
    value: 100,
    label: '100%',
  },
];

export default function DeviceInfo() {
  const device = useLoaderData<Device>();
  //   const currentThreshold = device.thresholdValue;
  const [currentThreshold, setThreshold] = useState(device.thresholdValue);
  const handleChange = (event: Event, newValue: number | number[]) => {
    const bearer_token = `Bearer ${localStorage.getItem('token')}`;
    const config = {
      headers: {
        Authorization: bearer_token,
      },
    };
    // setValue(newValue as number[]);
    // console.log(bearer_token);
    axios
      .post(
        `http://localhost:3001/api/device/setThreshold/` + device.id,
        {
          thresholdValue: newValue,
        },
        config,
      )
      .then((res) => {
        setState({
          vertical: 'bottom',
          horizontal: 'right',
          open: true,
          message: 'Cập nhật ngưỡng thành công',
        });
        setTimeout(() => {
          setState({ ...state, open: false });
        }, 2000);
      })
      .catch((err) => {
        setState({
          vertical: 'bottom',
          horizontal: 'right',
          open: true,
          message: 'Cập nhật ngưỡng không thành công. Vui lòng thử lại sau.',
        });
      });
    setThreshold(newValue);
  };
  const [state, setState] = useState<State>({
    open: false,
    vertical: 'top',
    horizontal: 'center',
    message: '',
  });
  const { vertical, horizontal, open } = state;

  return (
    <Stack
      component="main"
      spacing={3}
      sx={{
        flexGrow: 1,
        bgcolor: 'background.default',
        px: 2,
        paddingLeft: 34,
        paddingRight: 10,
      }}
    >
      <Typography variant="h6">Thiết bị: {device.name}</Typography>
      <Stack
        direction="row"
        sx={{ justifyContent: 'space-between', alignItems: 'center' }}
      >
        <Typography>Điều khiển thiết bị</Typography>
        <DeviceControls id={device.id}></DeviceControls>
      </Stack>
      <Typography variant="h6">Ngưỡng của thiết bị</Typography>
      <Slider
        aria-label="Small steps"
        value={currentThreshold}
        getAriaValueText={valuetext}
        step={1}
        marks={marks}
        min={0}
        max={100}
        valueLabelDisplay="on"
        onChange={handleChange}
      />
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        autoHideDuration={5000}
        message={state.message}
        key={vertical + horizontal}
      />
    </Stack>
  );
}

// const getDevice = async (id) => {
//   const [device, setDevice] = useState([]);
//   const bearer_token = `Bearer ${localStorage.getItem('token')}`;
//   const config = {
//     headers: {
//       Authorization: bearer_token,
//     },
//   };
//   axios
//     .get(`http://localhost:3001/api/device/getDeviceInfo/` + id, config)
//     .then((res) => {
//       setDevice(res.data);
//       return device;
//     });
// };

export async function loader({ params }: { params: LoaderParams }) {
  // console.log(params);
  const bearer_token = `Bearer ${localStorage.getItem('token')}`;
  const response = await fetch(
    'http://localhost:3001/api/device/getDeviceInfo/' + params.deviceID,
    {
      method: 'get',
      headers: new Headers({
        Authorization: bearer_token,
      }),
    },
  );
  //   console.log(response);
  const device: Device = await response.json();
  //   console.log(device);
  return device;
}
