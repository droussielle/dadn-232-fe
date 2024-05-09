import { Height } from '@mui/icons-material';
import { Button, TextField } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';

import PaginatedTable from './PaginatedTable';

function ActivityLogTable() {
  const [activityLogs, setActivityLogs] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [userId, setUserId] = useState('');
  const filtered = useRef(false);

  useEffect(() => {
    const interval = setInterval(() => !filtered.current && fetchData(), 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/log/getAllLog`);
      setActivityLogs(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSearch = async () => {
    try {
      //   console.log(startDate);
      //   console.log(endDate);
      const response = await axios.get(
        `http://localhost:3001/api/log/search/date?startDate=${startDate}&endDate=${endDate}`,
      );
      setActivityLogs(response.data);
      filtered.current = true;
    } catch (error) {
      console.error('Error searching data:', error);
    }
  };

  const handleFilterByUser = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/log/search/${userId}?rowsPerPage=100`,
      );
      setActivityLogs(response.data);
      filtered.current = true;
    } catch (error) {
      console.error('Error filtering data by user:', error);
    }
  };

  const handleReset = () => {
    setStartDate('');
    setEndDate('');
    setUserId('');
    fetchData();
    filtered.current = false;
  };

  return (
    <div>
      <div>
        <TextField
          style={{ marginRight: '15px' }}
          label="Start Date"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          style={{ marginRight: '30px' }}
          label="End Date"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <Button variant="contained" onClick={handleSearch}>
          Search
        </Button>
      </div>
      <div>
        <br />
        <TextField
          style={{ marginRight: '30px' }}
          label="User Name"
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <Button variant="contained" onClick={handleFilterByUser}>
          Filter by User
        </Button>
      </div>
      <br />
      <Button variant="contained" onClick={handleReset}>
        Reset
      </Button>
      <br />
      <br />
      <br />
      <PaginatedTable data={activityLogs} />
      <br />
      <br />
    </div>
  );
}

export default ActivityLogTable;
