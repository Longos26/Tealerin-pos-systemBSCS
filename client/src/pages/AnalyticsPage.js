import React, { useState, useEffect, createContext, useContext } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import axios from 'axios';
import DefaultLayout from "../components/DefaultLayout";

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

  const [barChartVisible, setBarChartVisible] = useState(true);
  const [lineChartVisible, setLineChartVisible] = useState(true);
  const [pieChartVisible, setPieChartVisible] = useState(true);

  if (loading) return <div>Loading sales data...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!Object.keys(salesData).length) return <div>No sales data available.</div>;

  // Prepare data for recharts
  const chartData = Object.keys(salesData).map((date, index) => ({
    date,
    value: salesData[date],
    fill: getRandomColor(), // Assign a random color to each data point
  }));

  // Interpret sales data in English
  const totalSales = Object.values(salesData).reduce((acc, curr) => acc + curr, 0);
  const highestSalesDate = Object.keys(salesData).reduce((acc, curr) => salesData[curr] > salesData[acc] ? curr : acc, Object.keys(salesData)[0]);
  const lowestSalesDate = Object.keys(salesData).reduce((acc, curr) => salesData[curr] < salesData[acc] ? curr : acc, Object.keys(salesData)[0]);
  const averageSalesPerDay = totalSales / Object.keys(salesData).length;

  const interpretation = `
    Based on the sales data, here are some key insights:

    * Total sales amount: ${totalSales.toFixed(2)}
    * The highest sales were on ${highestSalesDate} with a total of ${salesData[highestSalesDate].toFixed(2)}
    * The lowest sales were on ${lowestSalesDate} with a total of ${salesData[lowestSalesDate].toFixed(2)}
    * The average sales per day is ${averageSalesPerDay.toFixed(2)}

    Overall, the sales data suggests that ${highestSalesDate} was the best performing day, while ${lowestSalesDate} was the worst performing day.
  `;

  // Function to toggle the visibility of each graph
  const toggleBarChart = () => {
    setBarChartVisible(!barChartVisible);
  };

  const toggleLineChart = () => {
    setLineChartVisible(!lineChartVisible);
  };

  const togglePieChart = () => {
    setPieChartVisible(!pieChartVisible);
  };

  return (
    <DefaultLayout>
      <div className="d-flex justify-content-between">
        <h1>Sales Analytics</h1>
      </div>

      <div className="row">
        <div className="col-md-4">
          <div className="card" style={{ height: '500px', overflowY: 'auto', fontFamily: 'Arial', fontSize: 14 }}>
            <div className="card-header">
              <h1>Sales Summary</h1>
            </div>
            <div className="card-body">
              <h1>Key Insights</h1>
 <p>Total Sales: ₱{totalSales.toFixed(2)}</p>
              <p>Highest Sales Date: ₱{highestSalesDate}</p>
              <p>Lowest Sales Date: ₱{lowestSalesDate}</p>
              <p>Average Sales per Day: ₱{averageSalesPerDay.toFixed(2)}</p>
              <hr />
              <h1>Sales Interpretation</h1>
              <p>{interpretation}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card" style={{ height: '500px', overflowY: 'auto', fontFamily: 'Arial', fontSize: 14 }}>
            <div className="card-header">
              <h1>Bar Chart</h1>
              <button onClick={toggleBarChart}>{barChartVisible ? 'Hide' : 'Show'}</button>
            </div>
            {barChartVisible && (
              <BarChart width={500} height={300} data={chartData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <CartesianGrid stroke="#ccc" />
                <Bar dataKey="value" fill="#4CAF50" /> {/* Green color */}
              </BarChart>
            )}
          </div>
        </div>
        <div className="col-md-4">
          <div className="card" style={{ height: '500px', overflowY: 'auto', fontFamily: 'Arial', fontSize: 14 }}>
            <div className="card-header">
              <h1>Line Chart</h1>
              <button onClick={toggleLineChart}>{lineChartVisible ? 'Hide' : 'Show'}</button>
            </div>
            {lineChartVisible && (
              <LineChart width={500} height={300} data={chartData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <CartesianGrid stroke="#ccc" />
                <Line type="monotone" dataKey="value" stroke="#2196F3" /> {/* Blue color */}
              </LineChart>
            )}
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-4">
          <div className="card" style={{ height: '500px', overflowY: 'auto', fontFamily: 'Arial', fontSize: 14 }}>
            <div className="card-header">
              <h1>Pie Chart</h1>
              <button onClick={togglePieChart}>{pieChartVisible ? 'Hide' : 'Show'}</button>
            </div>
            {pieChartVisible && (
              <PieChart width={400} height={400}>
                <Pie data={chartData} dataKey="value" nameKey="date" cx="50%" cy="50%" outerRadius={100} fill="#FFC107" label /> {/* Orange color */}
                <Tooltip />
                <Legend />
              </PieChart>
            )}
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

// Function to generate a random color
function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// Export components
export default AnalyticsPage;
export { SalesDataProvider };