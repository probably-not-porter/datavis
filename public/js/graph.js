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
    label_arr = [];
    data_arr = [];
    times_arr = [];
    bucket = -1;
    for (x=0;x<dataset.length;x++){
        if ((x == 0) || (dataset[x-1].platformid != dataset[x].platformid)){
            bucket++;
            label_arr.push("Elevation (" + dataset[x].platformid + ", " + dataset[x].recordtime.toString().substring(0,10) + ")");
            data_arr.push([]);
            times_arr.push([]);
        }
        if (!(times_arr[bucket].includes(dataset[x].recordtime.split('T')[1]))){
            newtime = new Date(dataset[x].recordtime).getTime()
            data_arr[bucket].push({x: newtime ,y: (dataset[x].elevation)});
            times_arr[bucket].push(dataset[x].recordtime.split('T')[1].substring(0,8));
        }
    }
    addData(lineChart, times_arr, data_arr,label_arr,color);
}
function addData(chart, label_arr, data, title_arr,color) {
    console.warn('UPDATING CHART: this might take a minute!');
    chart.destroy();
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
    for (x=0; x< label_arr.length; x++){
        chart.data.labels = chart.data.labels.concat(label_arr[x]);
        var newDataset = {
            label: title_arr[x],
            borderColor: color,
            borderWidth: 3,
            fill: false,
            data: data[x],
        }
        chart.data.datasets.push(newDataset);
    }
    chart.update();
}