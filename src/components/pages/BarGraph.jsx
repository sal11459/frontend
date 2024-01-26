import React, { useEffect, useState } from 'react';
import Chart from "react-apexcharts";
import Box from '@mui/material/Box';
import Sidenav from './Sidenav';

function BarGraph() {
  const [data, setDatabaseData] = useState([]);
  const [userId, setUserId] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('Linux');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');


  const fetchData = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/questionhistoryget/?user_id=${userId}`);
      const fetchedData = await response.json();

      if (fetchedData) {
        setDatabaseData(fetchedData);
        
      } else {
        console.error('Fetched data is undefined.');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userId]);

  useEffect(()=>{
    console.log(data)
  },[data])

  const domainNames = [...new Set(data.map(item => item.domain))];
  const difficultyLevels = [...new Set(data.map(item => item.difficulty_level))];

  const filteredData = data.filter(item =>
    (!selectedDomain || item.domain === selectedDomain) &&
    (!selectedDifficulty || item.difficulty_level === selectedDifficulty)
  );

  const initialData = {
  options: {
    colors: selectedDomain && selectedDifficulty
      ? ["#FF6384"]
      : ["#FF6384", "#36A2EB", "#FFCE56"],
    chart: {
      id: "basic-bar",
    },
    xaxis: {
      categories: selectedDomain === "All Domains"
        ? domainNames
        : difficultyLevels.filter(difficulty =>
            filteredData.some(item =>
              item.domain === selectedDomain && item.difficulty_level === difficulty
            )
          ),
    },
  },
  series: [],
};

  
  if (selectedDomain && selectedDifficulty) {
    // Mapping series data when both domain and difficulty are selected
    const selectedSeries = filteredData
      .filter(item => item.domain === selectedDomain && item.difficulty_level === selectedDifficulty)
      .map(item => ({
        x: item?.submission_time || 0,
        y: item?.score !== undefined ? item.score : 0,
      }));
  
    initialData.series = [{
      name: `${selectedDomain}-${selectedDifficulty}`,
      data: selectedSeries,
    }];
  } else if (selectedDomain && !selectedDifficulty) {
    // Mapping series data when only domain is selected
    initialData.series = difficultyLevels.slice(0, 3).map(difficulty => {
      const seriesData = filteredData
        .filter(item => item.domain === selectedDomain && item.difficulty_level === difficulty)
        .map(item => ({
          x: item?.submission_time || 0,
          y: item?.score !== undefined ? item.score : 0,
        }));
  
      return {
        name: `${selectedDomain}-${difficulty}`,
        data: seriesData,
      };
    });
 

  
  } else {
    const maxScoreData = domainNames.map(domain => {
      const topDifficulties = difficultyLevels.slice(0, 3);
      const seriesDataForDomain = topDifficulties.map(difficulty => {
        const domainData = filteredData
          .filter(item => item.domain === domain && item.difficulty_level === difficulty)
          .map(item => ({
            x: domain,
            y: item?.score !== undefined ? item.score : 0,
          }));
  
        const maxScoreForDifficulty = Math.max(...domainData.map(score => score.y), 0);
  
        return {
          name: `${domain}-${difficulty}`,
          data: domainData,
          maxScore: maxScoreForDifficulty,
        };
      });
  
      return seriesDataForDomain;
    }).flat();
  
    // Check if maxScoreData is defined before accessing its properties
    if (maxScoreData && maxScoreData.length > 0) {
      initialData.series = maxScoreData;
    } else {
      console.error('Max Score Data is undefined or empty.');
      initialData.series = [{ data: [] }];
    }
  
    // Update x-axis categories to display all domain names
    initialData.options.xaxis.categories = domainNames;
  
    // Add colors for each domain
    initialData.options.colors = domainNames.map((_, index) => `#${index % 2 ? 'FF6384' : '36A2EB'}`);
  }
  
  
  
  
  

  const handleDomainChange = (event) => {
    const selectedDomain = event.target.value;
    setSelectedDomain(selectedDomain);
    setSelectedDifficulty('');
  };

  const handleDifficultyChange = (event) => {
    const selectedDifficulty = event.target.value;
    setSelectedDifficulty(selectedDifficulty);
  };

  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <div className="App">
            <h1>
              Bar Chart <i className="fas fa-chart-line"></i>
            </h1>
            <div className="dropdown-container">
            <label htmlFor="domainDropdown">Select Domain:</label>
            <select id="domainDropdown" onChange={handleDomainChange} value={selectedDomain}>
              {domainNames.map((domain, index) => (
                <option key={index} value={domain}>
                  {domain}
                </option>
              ))}
            </select>
              {selectedDomain && (
                <>
                  <label htmlFor="difficultyDropdown">Select Difficulty:</label>
                  <select id="difficultyDropdown" onChange={handleDifficultyChange} value={selectedDifficulty}>
                    <option value="">All Difficulties</option>
                    {difficultyLevels.map((difficulty, index) => (
                      <option key={index} value={difficulty}>
                        {difficulty}
                      </option>
                    ))}
                  </select>
                </>
              )}
            </div>
            <div className="chart-container">
              <div className="chart-title">Performance Comparison</div>
              <div className="chart">
                <Chart
                  options={initialData.options}
                  series={initialData.series}
                  type="bar"
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

export default BarGraph;
