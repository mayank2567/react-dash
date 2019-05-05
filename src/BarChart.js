import React, { Component } from 'react';
import { Element } from 'react-faux-dom';
import * as d3 from "d3";
import { UncontrolledReactSVGPanZoom } from 'react-svg-pan-zoom';

class BarChart extends Component {
    state = {
        salData: [{ age: 20, salary: 0, total: 0, count: 0 }, { age: 21, salary: 0, total: 0, count: 0 }, { age: 31, salary: 0, total: 0, count: 0 }, { age: 41, salary: 0, total: 0, count: 0 }, { age: 61, salary: 0, total: 0, count: 0 }]
    }
    async componentWillMount() {
        try {
            //   console.log(this.state)
            let res = await fetch('http://65.52.32.33:4000/')
            res = await res.json();
            res = JSON.parse(res);
            res.time = new Date().getTime();


            setInterval(async () => {
                res = await fetch('http://65.52.32.33:4000/')
                res = await res.json();
                res = JSON.parse(res);
                res.time = new Date().getTime();
                this.setState(prevState => {
                    for (let item of this.state.salData) {

                        if (res.age < 20 && item.age === 20) {
                            item.salary += res.salary;
                            item.count += res.count;
                            item.total += res.total;
                        } else if (res.age < 30 && item.age === 21) {
                            item.salary += res.salary;
                            item.count += res.count;
                            item.total += res.total;
                        } else if (res.age < 40 && item.age === 31) {
                            item.salary += res.salary;
                            item.count += res.count;
                            item.total += res.total;
                        } else if (res.age < 60 && item.age === 41) {
                            item.salary += res.salary;
                            item.count += res.count;
                            item.total += res.total;
                        } else if (res.age >= 60 && item.age === 61) {
                            item.salary += res.salary;
                            item.count += res.count;
                            item.total += res.total;
                        }
                    }
                    return this.state.salData;

                })
               
                console.log("res ", this.state);

               
            }, 500);

            
        } catch (e) {
            console.log(e);
        }
    }

    plot(chart, width, height, x, y) {
        // create scales!

        const xScale = d3.scaleBand()
            .domain(this.state.salData.map(d => d[x]))
            .range([0, width]);
        const yScale = d3.scaleLinear()
            .domain([0, d3.max(this.state.salData, d => d[y])])
            .range([height, 0]);
        const colorScale = d3.scaleOrdinal(d3.schemePastel2);

        chart.selectAll('.bar')
            .data(this.state.salData)
            .enter()
            .append('rect')
            .classed('bar', true)
            .attr('x', d => xScale(d[x]))
            .attr('y', d => yScale(d[y]))
            .attr('height', d => (height - yScale(d[y])))
            .attr('width', d => xScale.bandwidth() - 10)
            .style('fill', (d, i) => colorScale(i));



        const xAxis = d3.axisBottom()
            .scale(xScale);

        chart.append('g')
            .classed('x axis', true)
            .attr('transform', `translate(0,${height})`)
            .call(xAxis);

        const yAxis = d3.axisLeft()
            .ticks(10)
            .scale(yScale);

        chart.append('g')
            .classed('y axis', true)
            .attr('transform', 'translate(0,0)')
            .call(yAxis);

        chart.select('.x.axis')
            .append('text')
            .attr('x', width / 2)
            .attr('y', 60)
            .attr('fill', '#000')
            .style('font-size', '20px')
            .style('text-anchor', 'middle')
            .text('Age');

        chart.select('.y.axis')
            .append('text')
            .attr('x', 0)
            .attr('y', 0)
            .attr('transform', `translate(-50, ${height / 2}) rotate(-90)`)
            .attr('fill', '#000')
            .style('font-size', '20px')
            .style('text-anchor', 'middle')
            .text(y);

    }

    drawChart(a, b) {

        const width1 = 800;
        const height1 = 450;

        const el = new Element('div');
        const svg = d3.select(el)
            .append('svg')
            .attr('id', 'chart')
            .attr('width', width1)
            .attr('height', height1)

        const margin = {
            top: 60,
            bottom: 100,
            left: 80,
            right: 40
        };

        const chart = svg.append('g')
            .classed('display', true)
            .attr('transform', `translate(${margin.left},${margin.top})`);

        const chartWidth = width1 - margin.left - margin.right;
        const chartHeight = height1 - margin.top - margin.bottom
        // this.plot(chart, chartWidth, chartHeight);
        this.plot(chart, chartWidth, chartHeight, a, b);

        return el.toReact();
    }

    render() {

        const element = (

            <div>
                <h2>It is {new Date().toLocaleTimeString()}.</h2>
                <div>
                    <button className="btn" onClick={() => this.Viewer.zoomOnViewerCenter(1.1)}>Zoom in</button>
                    <button className="btn" onClick={() => this.Viewer.fitSelection(40, 40, 200, 200)}>Zoom area 200x200</button>
                    <button className="btn" onClick={() => this.Viewer.fitToViewer()}>Fit</button>

                    <hr />

                    <UncontrolledReactSVGPanZoom
                        width={1300} height={450}
                        ref={Viewer => this.Viewer = Viewer}

                        onClick={event => console.log('click', event.x, event.y, event.originalEvent)}
                    >
                        {this.drawChart('age', 'salary')}

                    </UncontrolledReactSVGPanZoom>
                    <UncontrolledReactSVGPanZoom
                        width={1300} height={450}
                        ref={Viewer => this.Viewer = Viewer}

                        onClick={event => console.log('click', event.x, event.y, event.originalEvent)}
                    >
                {this.drawChart('age', 'total')}

                    </UncontrolledReactSVGPanZoom>
                    <UncontrolledReactSVGPanZoom
                        width={1300} height={450}
                        ref={Viewer => this.Viewer = Viewer}

                        onClick={event => console.log('click', event.x, event.y, event.originalEvent)}
                    >
                {this.drawChart('age', 'count')}

                    </UncontrolledReactSVGPanZoom>
                </div>
            </div>
        );
        return (element);
    }
}

export default BarChart;
