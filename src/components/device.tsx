import HdrAutoIcon from '@mui/icons-material/HdrAuto';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import ShowerIcon from '@mui/icons-material/Shower';
import { CardActionArea, CardActions } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import Stack from '@mui/system/Stack';
import * as React from 'react';

export default function DeviceCard({ item = 'sensor', name = 'device name' }) {
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
          <DeviceControls />
        </CardActions>
      )}
    </Card>
  );
}

function DeviceControls() {
  return (
    <Stack direction="row" spacing={2} alignItems="right">
      <Switch />
      <IconButton aria-label="delete">
        <HdrAutoIcon />
      </IconButton>
    </Stack>
  );
}

// function OutputDevices() {
//   return ();
// }
