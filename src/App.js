import { Component } from 'react';
import { Element } from 'react-faux-dom';
import * as d3 from 'd3';
import './App.css';
// import data from './data';
// let data2 = [];
class App extends Component {
  state = {
    data: []
  }
  async componentWillMount() {
    try {
    //   console.log(this.state)
    let res = await fetch('http://65.52.32.33:4000/')
        res = await res.json();
        res = JSON.parse(res);
        res.time = new Date().getTime();

        //  console.log("res ", res);
        console.log("res ", this.state);

        // debugger
        this.setState(prevState => ({
            data: [...prevState.data, res]
        }))
      setInterval(async () => {
        res = await fetch('http://65.52.32.33:4000/')
        res= await res.json();
        res= JSON.parse(res);
        res.time = new Date().getTime();
        // this.state.data.map(function (a, b) {
        //     return a.time - b.time
        // })
        if(this.state.data.length>12){
            this.state.data.sort(function (a, b) {
                return b.time - a.time
            })

            this.state.data.pop()
            // debugger
//  console.log("a ", a);
            // this.setState(prevState => {
            //     prevState.data.pop();
            //     return {
            //         data: prevState.data
            //     }
            // })    
            
        }
        //  console.log("res ", res);
        console.log("res ", this.state);

        // debugger
        this.setState(prevState => ({
            data: [...prevState.data, res]
          }))
        this.setState(prevState => ({
            data: [...prevState.data.sort((a, b) => b.age - a.age)]
          }))
      }, 500);
    } catch(e) {
      console.log(e);
    }
}

    plot(chart, width, height, x, y) {
        // create scales!

        const xScale = d3.scaleBand()
            .domain(this.state.data.map(d => d[x]))
            .range([0, width]);
        const yScale = d3.scaleLinear()
            .domain([0, d3.max(this.state.data, d => d[y])])
            .range([height, 0]);
        const colorScale = d3.scaleOrdinal(d3.schemePastel2);

        chart.selectAll('.bar')
            .data(this.state.data)
            .enter()
            .append('rect')
            .classed('bar', true)
            .attr('x', d => xScale(d[x]))
            .attr('y', d => yScale(d[y]))
            .attr('height', d => (height - yScale(d[y])))
            .attr('width', d => xScale.bandwidth() - 10)
            .style('fill', (d, i) => colorScale(i));

        // chart.selectAll('.bar-label')
        //     .data(this.state.data)
        //     .enter()
        //     .append('text')
        //     .classed('bar-label', true)
        //     .attr('x', d => xScale(d[x]) + xScale.bandwidth()/2)
        //     .attr('dx', 0)
        //     .attr('y', d => yScale(d[y]))
        //     .attr('dy', -6)
        //     .text(d => d[y]);

        const xAxis = d3.axisBottom()
            .scale(xScale);
            
        chart.append('g')
            .classed('x axis', true)
            .attr('transform', `translate(0,${height})`)
            .call(xAxis);

        const yAxis = d3.axisLeft()
            .ticks(5)
            .scale(yScale);

        chart.append('g')
            .classed('y axis', true)
            .attr('transform', 'translate(0,0)')
            .call(yAxis);

        chart.select('.x.axis')
            .append('text')
            .attr('x',  width/2)
            .attr('y', 60)
            .attr('fill', '#000')
            .style('font-size', '20px')
            .style('text-anchor', 'middle')
            .text('Age');    
            
        chart.select('.y.axis')
            .append('text')
            .attr('x', 0)
            .attr('y', 0)
            .attr('transform', `translate(-50, ${height/2}) rotate(-90)`)
            .attr('fill', '#000')
            .style('font-size', '20px')
            .style('text-anchor', 'middle')
            .text('Salary');   
            
        // const yGridlines = d3.axisLeft()
        //     .scale(yScale)
        //     .ticks(5)
        //     .tickSize(-width,0,0)
        //     .tickFormat('')

        // chart.append('g')
        //     .call(yGridlines)
        //     .classed('gridline', true);
    }

    drawChart() {
        
        const width = 800;
        const height = 450;

        const el = new Element('div');
        const svg = d3.select(el)
            .append('svg')
            .attr('id', 'chart')
            .attr('width', width)
            .attr('height', height);

        const margin = {
            top: 60,
            bottom: 100,
            left: 80,
            right: 40
        };

        const chart = svg.append('g')
            .classed('display', true)
            .attr('transform', `translate(${margin.left},${margin.top})`);

        const chartWidth = width - margin.left - margin.right;
        const chartHeight = height - margin.top - margin.bottom
        // this.plot(chart, chartWidth, chartHeight);
        this.plot(chart, chartWidth, chartHeight, 'age', 'salary');

        return el.toReact();
    }

    render() {
        return (
            this.drawChart()
            );
    }
}

export default App;