import React, { useState } from 'react';
import Box from '@mui/material/Box';
import BarGraph from './pages/BarGraph';
import LineGraph from './pages/LineGraph';
import "./pages/Dashboard.css";

function Dashboard() {
  const [userId, setUserId] = useState('');

  return (
    <div className='bo'>
    <Box sx={{ display: 'flex' }}>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <div className="App">
          <h1>
            Dashboard <i className="fas fa-tachometer-alt"></i>
          </h1>

          {/* <div className="icon-container">
            <div className="icon" onClick={() => console.log("Dashboard icon clicked")}>
              <i className="fas fa-tachometer-alt"></i>
              <span>Dashboard</span>
            </div>

            <div className="icon" onClick={() => console.log("LineGraph icon clicked")}>
              <i className="fas fa-chart-line"></i>
              <span>Line Graph</span>
            </div>

            <div className="icon" onClick={() => console.log("BarGraph icon clicked")}>
              <i className="fas fa-chart-bar"></i>
              <span>Bar Graph</span>
            </div>
          </div> */}

          <div className="card-container" style={{ display: 'flex' }}>
            <div className="card">
              
              <LineGraph userId={userId} />
            </div>

            <div className="card">
              <BarGraph userId={userId} />
            </div>
          </div>
        </div>
      </Box>
    </Box>
    </div>
  );
}

export default Dashboard;
