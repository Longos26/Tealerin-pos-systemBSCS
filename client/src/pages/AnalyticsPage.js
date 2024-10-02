import React, { useState, useEffect, createContext, useContext } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import axios from 'axios';

// Create a context for sales data
const SalesDataContext = createContext();

// Provider for sales data
const SalesDataProvider = ({ children }) => {
  const [salesData, setSalesData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await axios.get('/api/bills/get-bills');
        const data = response.data;
        
        const transformedData = data.reduce((acc, bill) => {
          const date = bill.date.substring(0, 10); // Assuming date is a string
          const amount = bill.totalAmount;
          acc[date] = (acc[date] || 0) + amount;
          return acc;
        }, {});

        setSalesData(transformedData);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchSalesData();
  }, []);

  return (
    <SalesDataContext.Provider value={{ salesData, error, loading }}>
      {children}
    </SalesDataContext.Provider>
  );
};

const AnalyticsPage = () => {
  const { salesData, error, loading } = useContext(SalesDataContext);

  if (loading) return <div>Loading sales data...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!Object.keys(salesData).length) return <div>No sales data available.</div>;

  const chartData = Object.keys(salesData).map((date) => ({ date, value: salesData[date] }));

  return (
    <div>
      <h2>Bar Chart</h2>
      <BarChart width={500} height={300} data={chartData}>
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <CartesianGrid stroke="#ccc" />
        <Bar dataKey="value" fill="#8884d8" />
      </BarChart>

      <h2>Line Chart</h2>
      <LineChart width={500} height={300} data={chartData}>
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <CartesianGrid stroke="#ccc" />
        <Line type="monotone" dataKey="value" stroke="#8884d8" />
      </LineChart>

      <h2>Pie Chart</h2>
      <PieChart width={400} height={400}>
        <Pie data={chartData} dataKey="value" nameKey="date" cx="50%" cy="50%" outerRadius={100} fill="#82ca9d" label />
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
};

export default AnalyticsPage;
export { SalesDataProvider, SalesDataContext };
