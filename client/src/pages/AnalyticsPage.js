import React, { useState, useEffect, createContext, useContext } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie,
  XAxis, YAxis, Tooltip, Legend, CartesianGrid
} from 'recharts';
import axios from 'axios';
import DefaultLayout from "../components/DefaultLayout";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/Sales.css'; // Custom styles

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
        const response = await axios.get("/api/bills/get-bills");
        const data = response.data;

        // Transform the sales data to aggregate by date
        const transformedData = data.reduce((acc, bill) => {
          const date = bill.date.toString().substring(0, 10); // Convert date to string
          const amount = bill.totalAmount;
          acc[date] = (acc[date] || 0) + amount;
          return acc;
        }, {});

        setSalesData(transformedData);
      } catch (error) {
        setError(error.message);
      } finally {
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

// Component for displaying analytics
const AnalyticsPage = () => {
  const { salesData, error, loading } = useContext(SalesDataContext);
  const [barChartVisible, setBarChartVisible] = useState(true);
  const [lineChartVisible, setLineChartVisible] = useState(true);
  const [pieChartVisible, setPieChartVisible] = useState(true);

  if (loading) return <div className="loading">Loading sales data...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!Object.keys(salesData).length) return <div className="no-data">No sales data available.</div>;

  // Prepare chart data
  const chartData = Object.keys(salesData).map((date) => ({
    date,
    value: salesData[date],
    fill: getRandomColor(),
  }));

  // Monthly data aggregation
  const monthlyData = Object.keys(salesData).reduce((acc, date) => {
    const month = date.substring(0, 7); // Extract month from date
    acc[month] = (acc[month] || 0) + salesData[date];
    return acc;
  }, {});

  const monthlyChart = Object.keys(monthlyData).map((month) => ({
    month,
    value: monthlyData[month],
    fill: getRandomColor(),
  }));

  // Sales interpretations
  const totalSales = Object.values(salesData).reduce((acc, curr) => acc + curr, 0);
  const highestSalesDate = Object.keys(salesData).reduce((acc, curr) => salesData[curr] > salesData[acc] ? curr : acc);
  const lowestSalesDate = Object.keys(salesData).reduce((acc, curr) => salesData[curr] < salesData[acc] ? curr : acc);
  const averageSalesPerDay = totalSales / Object.keys(salesData).length;

  const interpretation = `
    Total sales amount: ₱${totalSales.toFixed(2)}
    The highest sales were on ${highestSalesDate} with a total of ₱${salesData[highestSalesDate].toFixed(2)}
    The lowest sales were on ${lowestSalesDate} with a total of ₱${salesData[lowestSalesDate].toFixed(2)}
    The average sales per day is ₱${averageSalesPerDay.toFixed(2)}
  `;

  // Monthly sales interpretation
  const totalMonthlySales = Object.values(monthlyData).reduce((acc, curr) => acc + curr, 0);
  const highestMonthlySalesMonth = Object.keys(monthlyData).reduce((acc, curr) => monthlyData[curr] > monthlyData[acc] ? curr : acc);
  const lowestMonthlySalesMonth = Object.keys(monthlyData).reduce((acc, curr) => monthlyData[curr] < monthlyData[acc] ? curr : acc);
  const averageMonthlySales = totalMonthlySales / Object.keys(monthlyData).length;

  const monthlyInterpretation = `
    Total monthly sales amount: ₱${totalMonthlySales.toFixed(2)}
    The highest monthly sales were in ${highestMonthlySalesMonth} with a total of ₱${monthlyData[highestMonthlySalesMonth].toFixed(2)}
    The lowest monthly sales were in ${lowestMonthlySalesMonth} with a total of ₱${monthlyData[lowestMonthlySalesMonth].toFixed(2)}
    The average monthly sales are ₱${averageMonthlySales.toFixed(2)}
  `;

  // Toggle chart visibility
  const toggleBarChart = () => setBarChartVisible(!barChartVisible);
  const toggleLineChart = () => setLineChartVisible(!lineChartVisible);
  const togglePieChart = () => setPieChartVisible(!pieChartVisible);

  return (
    <DefaultLayout>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-4">
            <div className="card">
              <div className="card-header">
                <h1>Daily Sales Report</h1>
              </div>
              <div className="card-body">
                <p>Total Sales: ₱{totalSales.toFixed(2)}</p>
                <p>Highest Sales Date: {highestSalesDate}</p>
                <p>Lowest Sales Date: {lowestSalesDate}</p>
                <p>Average Sales Per Day: ₱{averageSalesPerDay.toFixed(2)}</p>
              </div>
            </div>
            <div className="card">
              <div className="card-header">
                <h1>Daily Sales Interpretation</h1>
              </div>
              <div className="card-body">
                <p>{interpretation}</p>
              </div>
            </div>
          </div>
          <div className="col-md-8">
            <div className="card">
              <div className="card-header">
                <h1>Daily Sales Data</h1>
              </div>
              <div className="card-body">
                <button className="btn btn-primary" onClick={toggleBarChart}>
                  {barChartVisible ? "Hide" : "Show"} Bar Chart
                </button>
                {barChartVisible && (
                  <BarChart
                    width={500}
                    height={300}
                    data={chartData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                )}
                <button className="btn btn-primary" onClick={toggleLineChart}>
                  {lineChartVisible ? "Hide" : "Show"} Line Chart
                </button>
                {lineChartVisible && (
                  <LineChart
                    width={500}
                    height={300}
                    data={chartData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
                  </LineChart>
                )}
                <button className="btn btn-primary" onClick={togglePieChart}>
                  {pieChartVisible ? "Hide" : "Show"} Pie Chart
                </button>
                {pieChartVisible && (
                  <PieChart
                    width={500}
                    height={300}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <Pie
                      dataKey="value"
                      isAnimationActive={true}
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      fill="#8884d8"
                      label
                    />
                    <Tooltip />
                  </PieChart>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-4">
          <div className="card">
              <div className="card-header">
                <h1>Monthly Sales Report</h1>
              </div>
              <div className="card-body">
                <p>Total Monthly Sales: ₱{totalMonthlySales.toFixed(2)}</p>
                <p>Highest Monthly Sales: {highestMonthlySalesMonth}</p>
                <p>Lowest Monthly Sales: {lowestMonthlySalesMonth}</p>
                <p>Average Monthly Sales: ₱{averageMonthlySales.toFixed(2)}</p>
              </div>
            </div>
            <div className="card">
              <div className="card-header">
                <h1>Monthly Sales Interpretation</h1>
              </div>
              <div className="card-body">
                <p>{monthlyInterpretation}</p>
              </div>
            </div>
          </div>
          <div className="col-md-8">
            <div className="card">
              <div className="card-header">
                <h1>Monthly Sales Data</h1>
              </div>
              <div className="card-body">
                <button className="btn btn-primary" onClick={toggleBarChart}>
                  {barChartVisible ? "Hide" : "Show"} Bar Chart
                </button>
                {barChartVisible && (
                  <BarChart
                    width={500}
                    height={300}
                    data={monthlyChart}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                )}
                <button className="btn btn-primary" onClick={toggleLineChart}>
                  {lineChartVisible ? "Hide" : "Show"} Line Chart
                </button>
                {lineChartVisible && (
                  <LineChart
                    width={500}
                    height={300}
                    data={monthlyChart}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
                  </LineChart>
                )}
                <button className="btn btn-primary" onClick={togglePieChart}>
                  {pieChartVisible ? "Hide" : "Show"} Pie Chart
                </button>
                {pieChartVisible && (
                  <PieChart
                    width={500}
                    height={300}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <Pie
                      dataKey="value"
                      isAnimationActive={true}
                      data={monthlyChart}
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      fill="#8884d8"
                      label
                    />
                    <Tooltip />
                  </PieChart>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

// Function to generate a random color
const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export default AnalyticsPage;
export { SalesDataProvider };