import { Height } from '@mui/icons-material';
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

function ActivityLogTable() {
  const [activityLogs, setActivityLogs] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        'http://localhost:3001/api/log/getAllLog?rowsPerPage=100',
      );
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
        `http://localhost:3001/api/log/search/date?startDate=${startDate}&endDate=${endDate}?rowsPerPage=100`,
      );
      setActivityLogs(response.data);
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
    } catch (error) {
      console.error('Error filtering data by user:', error);
    }
  };

  const handleReset = () => {
    setStartDate('');
    setEndDate('');
    setUserId('');
    fetchData();
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
          label="User ID"
          type="text"
          inputMode="numeric"
          pattern="\d*"
          min="1"
          step="1"
          value={userId}
          onChange={(e) => setUserId(e.target.value * 1)}
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
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Action</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>User name</TableCell>
              <TableCell>User ID</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {activityLogs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>{log.id}</TableCell>
                <TableCell>{log.action}</TableCell>
                <TableCell>{log.createdAt}</TableCell>
                <TableCell>{log.user.username}</TableCell>
                <TableCell>{log.userId}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <br />
      <br />
    </div>
  );
}

export default ActivityLogTable;
