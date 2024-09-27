import React, { createContext, useState } from 'react';
import ReactDOM from 'react-dom';
import { 
  BarChart, 
  LineChart, 
  PieChart, 
  ChartsXAxis, 
  ChartsYAxis, 
  ChartsTooltip, 
  ChartsLegend 
} from '@mui/x-charts';

const ChartContext = React.createContext();

const ChartProvider = ({ children }) => {
  const [chartData, setChartData] = useState({});

  return (
    <ChartContext.Provider value={{ chartData, setChartData }}>
      {children}
    </ChartContext.Provider>
  );
};

const barData = [
  { group: 'A', value: 10 },
  { group: 'B', value: 20 },
  { group: 'C', value: 30 },
  { group: 'D', value: 40 },
];

const lineData = [
  { x: 'Jan', y: 10 },
  { x: 'Feb', y: 20 },
  { x: 'Mar', y: 30 },
  { x: 'Apr', y: 40 },
];

const pieData = [
  { label: 'A', value: 10 },
  { label: 'B', value: 20 },
  { label: 'C', value: 30 },
  { label: 'D', value: 40 },
];

const AnalyticsPage = () => {
  return (
    <div>
      <h2>Bar Chart</h2>
      <BarChart
        xAxis={{
          scaleType: 'band',
          data: barData.map((item) => item.group),
        }}
        series={[
          {
            data: barData.map((item) => item.value),
          },
        ]}
        width={500}
        height={300}
      >
        <ChartsXAxis />
        <ChartsYAxis />
        <ChartsTooltip />
        <ChartsLegend />
      </BarChart>

      <h2>Line Chart</h2>
      <LineChart
        xAxis={{
          data: lineData.map((item) => item.x),
        }}
        series={[
          {
            data: lineData.map((item) => item.y),
          },
        ]}
        width={500}
        height={300}
      >
        <ChartsXAxis />
        <ChartsYAxis />
        <ChartsTooltip />
        <ChartsLegend />
      </LineChart>

      <h2>Pie Chart</h2>
      <PieChart
        series={[
          {
            data: pieData,
          },
        ]}
        width={400}
        height={200}
      >
        <ChartsTooltip />
        <ChartsLegend />
      </PieChart>
    </div>
  );
};


export default AnalyticsPage;