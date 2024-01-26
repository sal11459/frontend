import React, { useEffect, useState } from 'react';
import Chart from "react-apexcharts";
import Box from '@mui/material/Box';
import Sidenav from './Sidenav';

function LineGraph() {
  const [data, setDatabaseData] = useState([]);
  const [userId, setUserId] = useState('');
  const [selectedDomain, setSelectedDomain] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [state, setState] = useState({
    options: {
      colors: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"],
      chart: {
        id: "basic-bar",
      },
    },
    series: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/questionhistoryget/?user_id=${userId}`);
        const fetchedData = await response.json();
        setDatabaseData(fetchedData);

        console.log(fetchedData);

        const initialSeries = fetchedData.reduce((acc, item) => {
          const seriesIndex = acc.findIndex(seriesItem => seriesItem.name === `${item.domain}-${item.difficulty_level}`);
          if (seriesIndex !== -1) {
            acc[seriesIndex].data.push({
              x: item.submission_time,
              y: item.score,
            });
          } else {
            acc.push({
              name: `${item.domain}-${item.difficulty_level}`,
              data: [{
                x: item.submission_time,
                y: item.score,
              }],
            });
          }
          return acc;
        }, []);

        setState((prevState) => ({
          ...prevState,
          series: initialSeries,
        }));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [userId]);

  const handleDomainChange = (event) => {
    const selectedDomain = event.target.value;
    setSelectedDomain(selectedDomain);

    const filteredSeries = data.filter((item) =>
      item.domain.includes(selectedDomain)
    ).reduce((acc, item) => {
      const seriesIndex = acc.findIndex(seriesItem => seriesItem.name === `${item.domain}-${item.difficulty_level}`);
      if (seriesIndex !== -1) {
        acc[seriesIndex].data.push({
          x: item.submission_time,
          y: item.score,
        });
      } else {
        acc.push({
          name: `${item.domain}-${item.difficulty_level}`,
          data: [{
            x: item.submission_time,
            y: item.score,
          }],
        });
      }
      return acc;
    }, []);

    setState({
      options: {
        ...state.options,
      },
      series: filteredSeries,
    });

    setSelectedDifficulty(""); // Reset selected difficulty when domain changes
  };

  const handleDifficultyChange = (event) => {
    const selectedDifficulty = event.target.value;
    setSelectedDifficulty(selectedDifficulty);

    const filteredSeries = data.filter((item) =>
      item.difficulty_level.includes(selectedDifficulty)
    ).reduce((acc, item) => {
      const seriesIndex = acc.findIndex(seriesItem => seriesItem.name === `${item.domain}-${item.difficulty_level}`);
      if (seriesIndex !== -1) {
        acc[seriesIndex].data.push({
          x: item.submission_time,
          y: item.score,
        });
      } else {
        acc.push({
          name: `${item.domain}-${item.difficulty_level}`,
          data: [{
            x: item.submission_time,
            y: item.score,
          }],
        });
      }
      return acc;
    }, []);

    setState({
      options: {
        ...state.options,
      },
      series: filteredSeries,
    });
  };

  const domainNames = [...new Set(data.map(item => item.domain))];
  const difficultyLevels = ["easy", "medium", "difficult"];

  return (
    <>
      <Box sx={{ display: 'flex' }}>

        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <div className="App">
            <h1>
              Line Chart <i className="fas fa-chart-line"></i>
            </h1>
            <label>Select Domain:</label>
            <select onChange={handleDomainChange} value={selectedDomain}>
              <option value="">Select Domain</option>
              {domainNames.map((name, index) => (
                <option key={index} value={name}>
                  {name}
                </option>
              ))}
            </select>

            {selectedDomain && (
              <div>
                <label>Select Difficulty:</label>
                <select onChange={handleDifficultyChange} value={selectedDifficulty}>
                  <option value="">Select Difficulty</option>
                  {difficultyLevels.map((level, index) => (
                    <option key={index} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="chart-container">
              <div className="chart-title">Performance Comparison</div>
              <div className="chart">
                <Chart
                  options={state.options}
                  series={state.series}
                  type="line"
                  width="100%"
                />
              </div>
            </div>
          </div>
        </Box>
      </Box>
    </>
  );
}

export default LineGraph;
