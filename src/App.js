import React, { Component } from 'react';
import BarChart from './BarChart';

// import Chart from './scatter';
import './App.css';
// import data from './data';
// let data2 = [];
class App extends Component {
    
    render() {
        
        return (<div className="form-container">  
            {/* <Chart/> */}
            <BarChart/>
      </div>
            );
    }
}

export default App;