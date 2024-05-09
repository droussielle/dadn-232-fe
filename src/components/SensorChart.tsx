import 'chart.js/auto';

// import { Label } from '@mui/icons-material';
import { Button } from '@mui/material';
import axios from 'axios';
import { Chart, registerables } from 'chart.js';
import React, { useEffect, useState } from 'react';
import { Line, Scatter } from 'react-chartjs-2';

const SensorChartB = () => {
  const [sensorData, setSensorData] = useState({ current: [], previous: [] });
  const [selectedSensor, setSelectedSensor] = useState('temp-sensor');
  const [dateRange, setDateRange] = useState('today');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  Chart.register(...registerables);

  useEffect(() => {
    fetchData();
  }, [selectedSensor, dateRange, customStartDate, customEndDate]);

  // const formatDate = (date) => {
  //   const dd = String(date.getDate()).padStart(2, '0');
  //   const mm = String(date.getMonth() + 1).padStart(2, '0');
  //   const yyyy = date.getFullYear();
  //   return `${mm}-${dd}-${yyyy}`;
  // };
  function formatDate(dateTime: string | Date, format = 'MM-DD-YYYY'): string {
    let date: Date;

    if (dateTime instanceof Date) {
      date = dateTime;
    } else {
      // Chuyển đổi chuỗi thời gian thành đối tượng Date
      date = new Date(dateTime);
    }

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    const formattedDateTime = format
      .replace('YYYY', year.toString())
      .replace('MM', month)
      .replace('DD', day)
      .replace('HH', hours)
      .replace('mm', minutes)
      .replace('ss', seconds);

    return formattedDateTime;
  }

  const getMonday = (date) => {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
  };

  // const synchronizeData = (data1, data2) => {
  //   const maxLength = Math.max(data1.length, data2.length);
  //   const synchronizedData1 = data1.slice(0, maxLength);
  //   const synchronizedData2 = data2.slice(0, maxLength);
  //   return [synchronizedData1, synchronizedData2];
  // };

  const synchronizeData = (data1, data2) => {
    const maxLength = Math.max(data1.length, data2.length);
    const synchronizedData1 = Array(maxLength)
      .fill(null)
      .map((_, index) => data1[index] || {});
    const synchronizedData2 = Array(maxLength)
      .fill(null)
      .map((_, index) => data2[index] || {});
    return [synchronizedData1, synchronizedData2];
  };

  function formatDateTime(dateTime, format = 'YYYY-MM-DD HH:mm:ss') {
    const date = new Date(dateTime);

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    const formattedDateTime = format
      .replace('YYYY', year.toString())
      .replace('MM', month)
      .replace('DD', day)
      .replace('HH', hours)
      .replace('mm', minutes)
      .replace('ss', seconds);

    return formattedDateTime;
  }

  function getDateLastYearSameTime(date: Date): Date {
    const lastYear = new Date(date); // Tạo một bản sao của ngày được truyền vào
    const lastYearDay = date.getDate(); // Lấy ngày của ngày được truyền vào

    // Thiết lập ngày trong năm ngoái mà không đổi các giá trị khác
    lastYear.setFullYear(date.getFullYear() - 1);
    lastYear.setDate(lastYearDay); // Thiết lập ngày trong năm ngoái

    return lastYear;
  }

  const fetchData = async () => {
    try {
      const currentDate1 = new Date();
      const currentDate = new Date(currentDate1.getTime() + 24 * 60 * 60 * 1000);
      // let end_date = formatDate(currentDate);
      let end_date = formatDate(currentDate);
      let start_date = '';

      switch (dateRange) {
        case 'today':
          start_date = formatDate(currentDate1);
          break;
        case 'thisWeek':
          start_date = formatDate(getMonday(currentDate1));
          break;
        case 'thisMonth':
          start_date = formatDate(
            new Date(currentDate1.getFullYear(), currentDate1.getMonth(), 1),
          );
          break;
        case 'thisYear':
          start_date = formatDate(new Date(currentDate1.getFullYear(), 0, 1));
          break;
        default:
          start_date = formatDate(customStartDate);
          // end_date = formatDate(customEndDate);
          end_date = formatDate(
            new Date(new Date(customEndDate).getTime() + 24 * 60 * 60 * 1000),
          );
          break;
      }

      const currentResponse = await axios.get(
        `http://localhost:3001/api/record/getSensorDataByTime`,
        {
          params: {
            sensor_key: selectedSensor,
            start_date,
            end_date,
          },
        },
      );

      let prevStartDate, prevEndDate;
      switch (dateRange) {
        case 'today':
          prevStartDate = formatDate(
            new Date(currentDate1.getTime() - 24 * 60 * 60 * 1000),
          );
          prevEndDate = formatDate(new Date(currentDate.getTime() - 24 * 60 * 60 * 1000));
          // prevEndDate = formatDate(new Date(currentDate.getTime()));
          break;
        case 'thisWeek':
          prevStartDate = formatDate(
            getMonday(new Date(currentDate1.getTime() - 7 * 24 * 60 * 60 * 1000)),
          );
          prevEndDate = formatDate(
            // getMonday(new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000)),
            new Date(getMonday(currentDate1)),
          );
          break;
        case 'thisMonth':
          prevStartDate = formatDate(
            new Date(currentDate1.getFullYear() - 1, currentDate1.getMonth(), 1),
          );
          prevEndDate = formatDate(
            new Date(currentDate1.getFullYear() - 1, currentDate1.getMonth() + 1, 0),
          );
          break;
        case 'thisYear':
          prevStartDate = formatDate(new Date(currentDate1.getFullYear() - 1, 0, 1));
          prevEndDate = formatDate(new Date(currentDate1.getFullYear() - 1, 11, 31));
          break;
        default:
          prevStartDate = formatDate(
            // new Date(
            //   new Date(customStartDate).getTime() -
            //     (new Date(customStartDate).getTime() -
            //       new Date(customStartDate).getTime()),
            // ),
            getDateLastYearSameTime(new Date(customStartDate)),
          );
          prevEndDate = formatDate(
            // new Date(customStartDate.getTime() - 24 * 60 * 60 * 1000),
            new Date(
              getDateLastYearSameTime(new Date(customEndDate)).getTime() +
                24 * 60 * 60 * 1000,
            ),
          );
          break;
      }

      const prevResponse = await axios.get(
        `http://localhost:3001/api/record/getSensorDataByTime`,
        {
          params: {
            sensor_key: selectedSensor,
            start_date: prevStartDate,
            end_date: prevEndDate,
          },
        },
      );

      setSensorData({ current: currentResponse.data, previous: prevResponse.data });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const [currentData, previousData] = synchronizeData(
    sensorData.current,
    sensorData.previous,
  );

  // Sắp xếp dữ liệu previousData và currentData theo thời gian tăng dần
  previousData.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  currentData.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  const chartData = {
    labels1: currentData.map((data) => formatDateTime(data.createdAt, 'DD/MM/YYYY')),
    labels2: previousData.map((data) => formatDateTime(data.createdAt, 'DD/MM/YYYY')),
    // labels: previousData.map((data) => ''),
    // labels: currentData.map((data) => {
    //   switch (dateRange) {
    //     case 'today':
    //       return formatDateTime(data.createdAt, 'HH:mm');
    //     case 'thisWeek':
    //       return formatDateTime(data.createdAt, 'DD/MM');
    //     case 'thisMonth':
    //       return formatDateTime(data.createdAt, 'DD/MM');
    //     case 'thisYear':
    //       return formatDateTime(data.createdAt, 'DD/MM');
    //     default:
    //       return formatDateTime(data.createdAt, 'DD/MM');
    //   }
    // }),

    datasets: [
      {
        label: 'Current',
        data: currentData.map((data) =>
          selectedSensor === 'pir-sensor' ? (data.value === 'True' ? 1 : 0) : data.value,
        ),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
        // xAxisID: 'x-axis-1',
        labels: currentData.map((data) => formatDateTime(data.createdAt, 'DD/MM/YYYY')), // Label riêng cho dataset "Current"
      },
      {
        label: 'Previous',
        data: previousData.map((data) =>
          selectedSensor === 'pir-sensor' ? (data.value === 'True' ? 1 : 0) : data.value,
        ),
        fill: false,
        borderColor: 'rgb(192, 75, 192)',
        tension: 0.1,
        // xAxisID: 'x-axis-2', // Gán trục x cho line 2
        labels: previousData.map((data) => formatDateTime(data.createdAt, 'DD/MM/YYYY')),
      },
    ],
  };
  const options = {
    plugins: {
      tooltip: {
        enabled: true,
        mode: 'index',
        callbacks: {
          label: function (context: any) {
            const label = context.dataset.label || '';
            const value = context.parsed.y || '';
            const dataIndex = context.dataIndex;
            const createdAt = chartData.datasets[context.datasetIndex].labels[dataIndex];
            return `${label}: ${value} (${createdAt})`;
            // return `${value} (${createdAt})`;
          },
          title: function () {
            return ''; // Trả về chuỗi rỗng để ẩn giá trị của trục x
          },
        },
      },
    },

    scales: {
      x: {
        // id: 'x-axis-1', // ID cho trục x của line 1
        type: 'category',
        labels: chartData.labels1, // Sử dụng labels1 cho line 1
      },
      xAxis2: {
        // id: 'x-axis-2', // ID cho trục x của line 2
        position: 'top',
        type: 'category',
        labels: chartData.labels2, // Sử dụng labels2 cho line 2
      },
      ...(selectedSensor === 'pir-sensor' && {
        y: {
          ticks: {
            stepSize: 1,
            min: 0,
            max: 1,
          },
        },
      }),
    },
  };

  const scatterOptions = {
    scales: {
      y: {
        ticks: {
          maxTicksLimit: 10,
          stepSize: 1, // Bước giữa các giá trị trên trục y
          min: 0, // Giá trị nhỏ nhất trên trục y
          max: 1, // Giá trị lớn nhất trên trục y
        },
      },
    },
  };

  const handleReset = () => {
    // setCustomStartDate('');
    // setCustomEndDate('');
    // setDateRange('');
    // setSelectedSensor('');
    setSensorData({ current: [], previous: [] });
  };

  return (
    <div>
      <select
        style={{
          height: '30px',
          marginRight: '30px',
          marginBottom: '10px',
        }}
        value={selectedSensor}
        onChange={(e) => setSelectedSensor(e.target.value)}
      >
        <option value="light-sensor">Light Sensor</option>
        <option value="temp-sensor">Temperature Sensor</option>
        <option value="pir-sensor">PIR Sensor</option>
      </select>
      <select
        style={{ height: '30px', width: '100px' }}
        value={dateRange}
        onChange={(e) => setDateRange(e.target.value)}
      >
        <option value="today">Today</option>
        <option value="thisWeek">This Week</option>
        <option value="thisMonth">This Month</option>
        <option value="thisYear">This Year</option>
        <option value="custom">Custom</option>
      </select>
      {dateRange === 'custom' && (
        <div>
          <label>Start Date:</label>
          <input
            type="date"
            value={customStartDate}
            onChange={(e) => setCustomStartDate(e.target.value)}
          />
          <label>End Date:</label>
          <input
            type="date"
            value={customEndDate}
            onChange={(e) => setCustomEndDate(e.target.value)}
          />
        </div>
      )}
      <br />
      <Button variant="contained" onClick={handleReset}>
        Reset
      </Button>
      <div style={{ height: '500px', width: '100%', marginTop: '30px' }}>
        {selectedSensor === 'pir-sensor' ? (
          <Scatter data={chartData} options={options} />
        ) : (
          <Line data={chartData} options={options} />
        )}
      </div>
    </div>
  );
};

export default SensorChartB;
