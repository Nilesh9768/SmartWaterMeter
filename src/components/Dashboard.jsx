import React, { useState, useEffect } from 'react'
import Chart from "react-apexcharts";
export default function Dashboard() {

    const generateData = () => {
        let arr = [];
        for (let i = 1; i < 11; i++) {
            arr.push(i);
        }
        return arr;
    }

    const initialOptions = {
        chart: {
            id: "basic-bar",
            events: {
                dataPointSelection: (event, chartContext, config) => {
                    console.log("chartContet", chartContext)
                }
            },
            xaxis: {
                categories: []
            },
            plotOptions: {
                bar: {
                    distributed: true
                }
            }
        }
    }

    const initialSeries = [
        {
            name: "Daily Water Consumption",
            data: []
        }
    ]

    const [options, setOptions] = useState(initialOptions);
    const [series, setSeries] = useState(initialSeries);

    useEffect(() => {
        const getCategories = generateData();
        const tempOptions = { ...options };
        if (tempOptions.xaxis) tempOptions.xaxis.categories = getCategories;
        setOptions(tempOptions);
        const loadData = async () => {
            const resp = await fetch(`https://api.thinger.io/v1/users/AayushVishwakarma/buckets/ESP8266/data?max_ts=1668001265600&min_ts=1667923504802&sort=desc&authorization=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJFU1A4MjY2Iiwic3ZyIjoiYXAtc291dGhlYXN0LmF3cy50aGluZ2VyLmlvIiwidXNyIjoiQWF5dXNoVmlzaHdha2FybWEifQ.GnufgrNrik28uUGGmVlIt6V3IU9SJyypXanmd3pjhE8`);
            const data = await resp.json();
            let tempData = [];
            data.map((obj) => {
                tempData.push(obj.val.Total.toFixed(1));
            })
            const tempSeries = [...series];
            tempSeries[0].data = tempData.slice(0, 10);
            setSeries(tempSeries);
            // console.log("rsp", tempData);
        }
        loadData();
    }, [])

    // useEffect(() => {
    //     console.log("series", series)
    // }, [series])


    return (
        <div className="app">
            <div className="row">
                <div className="mixed-chart">
                    {console.log("ser", series)}
                    <Chart
                        options={{
                            chart: {
                                width: 380,
                                type: 'pie',
                            },
                            labels: ['Morning', 'Afternoon', 'Evening'],
                            responsive: [{
                                breakpoint: 480,
                                options: {
                                    chart: {
                                        width: 200
                                    },
                                    legend: {
                                        position: 'bottom'
                                    }
                                }
                            }]
                        }}
                        series={[44, 55, 13]}
                        type="pie"
                        width="38%"
                    />
                    <Chart
                        options={options}
                        series={series}
                        type="bar"
                        width="60%"
                    />
                </div>
            </div>
        </div>
    )
}
