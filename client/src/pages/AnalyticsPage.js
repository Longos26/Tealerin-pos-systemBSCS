import React, { useState, useEffect, createContext, useContext } from 'react';
import ReactDOM from 'react-dom';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import axios from 'axios';

// Create a context for sales data
export const SalesDataContext = createContext();

// Create a provider for sales data
export const SalesDataProvider = ({ children }) => {
  const [salesData, setSalesData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Added loading state

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await axios.get('/api/bills/get-bills'); // Ensure this endpoint is correct
        const data = response.data;
        
        // Transform the data based on the API response
        const salesData = data.reduce((acc, bill) => {
          const date = bill.date.substring(0, 10); // Assuming date is in a string format
          const amount = bill.totalAmount;
          acc[date] = (acc[date] || 0) + amount; // Summing amounts by date
          return acc;
        }, {});

        setSalesData(salesData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching sales data:', error);
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

  // Handle loading state
  if (loading) {
    return <div>Loading sales data...</div>;
  }

  // Handle error state
  if (error) {
    return (
      <div>
        <h2>Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  // Check if salesData is empty
  if (!salesData || Object.keys(salesData).length === 0) {
    return <div>No sales data available.</div>;
  }

  // Prepare data for charts
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
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="date"
          cx="50%"
          cy="50%"
          outerRadius={100}
          fill="#82ca9d"
          label
        />
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
};

export default AnalyticsPage;
