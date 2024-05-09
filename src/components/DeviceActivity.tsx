import { Card, CardContent, Container, Grid, TextField, Typography } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

const ActivityCard = ({ title, manualCount, autoCount }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="h2">
          {title}
        </Typography>
        <Typography variant="body1" color="textPrimary">
          Manual: {manualCount}
        </Typography>
        <Typography variant="body1" color="textPrimary">
          Auto: {autoCount}
        </Typography>
      </CardContent>
    </Card>
  );
};

const DeviceActivity = () => {
  const currentDate = new Date();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 2)
    .toISOString()
    .split('T')[0];
  const lastDayOfMonth = new Date().toISOString().split('T')[0];

  const [startDate, setStartDate] = useState(firstDayOfMonth);
  const [endDate, setEndDate] = useState(lastDayOfMonth);
  const [activityData, setActivityData] = useState({
    lightOnManual: 0,
    lightOffManual: 0,
    lightOnAuto: 0,
    lightOffAuto: 0,
    pumpOnManual: 0,
    pumpOffManual: 0,
    pumpOnAuto: 0,
    pumpOffAuto: 0,
  });

  useEffect(() => {
    fetchData();
  }, [startDate, endDate]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/log/search/date?startDate=${startDate}&endDate=${endDate}`,
      );
      const data = response.data;
      // Process data to count activities
      const newData = {
        lightOnManual: 0,
        lightOffManual: 0,
        lightOnAuto: 0,
        lightOffAuto: 0,
        pumpOnManual: 0,
        pumpOffManual: 0,
        pumpOnAuto: 0,
        pumpOffAuto: 0,
      };
      data.forEach((item) => {
        switch (item.action) {
          case 'Turn on led device':
            newData.lightOnManual++;
            break;
          case 'Turn off led device':
            newData.lightOffManual++;
            break;
          case 'Turn on led auto mode':
            newData.lightOnAuto++;
            break;
          case 'Turn off led auto mode':
            newData.lightOffAuto++;
            break;
          case 'Turn on pump device':
            newData.pumpOnManual++;
            break;
          case 'Turn off pump device':
            newData.pumpOffManual++;
            break;
          case 'Turn on pump auto mode':
            newData.pumpOnAuto++;
            break;
          case 'Turn off pump auto mode':
            newData.pumpOffAuto++;
            break;
          default:
            break;
        }
      });
      setActivityData(newData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  return (
    <Container mt={5}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6">Start Date:</Typography>
          <TextField
            type="date"
            value={startDate}
            onChange={handleStartDateChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h6">End Date:</Typography>
          <TextField
            type="date"
            value={endDate}
            onChange={handleEndDateChange}
            fullWidth
          />
        </Grid>
      </Grid>
      <Grid container spacing={3} mt={3}>
        <Grid item xs={12} md={6}>
          <ActivityCard
            title="Light On Activity"
            manualCount={activityData.lightOnManual}
            autoCount={activityData.lightOnAuto}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <ActivityCard
            title="Light Off Activity"
            manualCount={activityData.lightOffManual}
            autoCount={activityData.lightOffAuto}
          />
        </Grid>
      </Grid>
      <Grid container spacing={3} mt={3}>
        <Grid item xs={12} md={6}>
          <ActivityCard
            title="Pump On Activity"
            manualCount={activityData.pumpOnManual}
            autoCount={activityData.pumpOnAuto}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <ActivityCard
            title="Pump Off Activity"
            manualCount={activityData.pumpOffManual}
            autoCount={activityData.pumpOffAuto}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default DeviceActivity;
