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
    elev_arr = [];
    data1 = [];
    data2 = [];
    data3 = [];
     = [];
    for (x=0;x<dataset.length;x++){
        if (!(times_arr.includes(dataset[x].recordtime))){
            times_arr.push(dataset[x].recordtime);
            elev_arr.push(dataset[x].elevation);
        }

        if (dataset[x].sensorid == '77a'){
            a77.push(dataset[x].value_1);
        }else if (dataset[x].sensorid == '77b'){
            b77.push(dataset[x].value_1);
        } else if (dataset[x].sensorid == '77c'){
            c77.push(dataset[x].value_1);
        }
    }
    addData(lineChart, times_arr,elev_arr,a77,b77,c77,getRandomColor());
}
function addData(chart,times,data1,data2,data3,data4,color) {
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
            }
        }
    });
    lineChart = chart;
    chart.options.title.text = 'Dataset Graph';
    chart.data.labels = times;
    var dataset1 = {
        label: 'dataset1',
        borderColor: 'red',
        borderWidth: 3,
        fill: false,
        data: data1,
    }
    var dataset2 = {
        label: 'dataset2',
        borderColor: 'red',
        borderWidth: 3,
        fill: false,
        data: data2,
    }
    var dataset3 = {
        label: 'dataset3',
        borderColor: 'red',
        borderWidth: 3,
        fill: false,
        data: data3,
    }
    var dataset4 = {
        label: 'dataset4',
        borderColor: 'red',
        borderWidth: 3,
        fill: false,
        data: data4,
    }
    chart.data.datasets.push(dataset1,dataset2,dataset3,dataset4);
    chart.update();
}