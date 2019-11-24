/*
#
# Datavis 2.0
# Porter Libby - 2019 - initial setup
# pelibby16@earlham.edu
#
# Graph functions
*/

var lineChart;
$( document ).ready(function() {
    lineChart = new Chart(document.getElementById("line-chart"), {
        type: 'scatter',
        data: {},
        options: {
            responsive: true,
            maintainAspectRatio: false,
            title: {
                display: true,
                text: 'No Data Selected'
            }
        }
    });
});

function createGraph(dataset, title,color){
    times_arr = [];
    data1 = [];
    data2 = [];
    data3 = [];
    data4 = [];
    for (x=0;x<dataset.length;x++){
        if (!(times_arr.includes(Date.parse(dataset[x].recordtime)))){
            times_arr.push(Date.parse(dataset[x].recordtime));
            data1.push({x:Date.parse(dataset[x].recordtime),y:dataset[x].elevation});
        }

        if (dataset[x].sensorid == '77a'){
            data2.push({x:Date.parse(dataset[x].recordtime), y:dataset[x].value_1});
        }else if (dataset[x].sensorid == '77b'){
            data3.push({x:Date.parse(dataset[x].recordtime), y:dataset[x].value_1});
        } else if (dataset[x].sensorid == '77c'){
            data4.push({x:Date.parse(dataset[x].recordtime), y:dataset[x].value_1});
        }
    }
    console.log(data1,data2);
    addData(lineChart, times_arr, [data1,data2,data3,data4],color);
}
function addData(chart,times,data,color) {
    console.warn('UPDATING CHART: this might take a minute!');
    
    if (chart){
        chart.destroy();
    }
    chart = new Chart(document.getElementById("line-chart"), {
        type: 'scatter',
        data: {},
        options: {
            responsive: true,
            maintainAspectRatio: false,
            title: {
                display: true,
                text: 'No Data Selected'
            },
            scales: {
                yAxes: [{
                    ticks: {
                        callback: function(value) { 
                            return new Date(value).toLocaleDateString('de-DE', {month:'short', year:'numeric'}); 
                        },
                    },
                }]
            }
        }
    });
    lineChart = chart;
    chart.options.title.text = 'Dataset Graph';
    chart.data.labels = times;
    for (x = 0;x<data.length;x++){
        var dataset = {
            label: 'dataset_' + x,
            borderColor: getRandomColor(),
            borderWidth: 3,
            fill: false,
            data: data[x],
        }
        chart.data.datasets.push(dataset);
    }
    chart.update();
}