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
    console.log( "ready!" );
});

function createGraph(dataset, title){
    label_arr = [];
    elevation_arr = [];
    times_arr = [];
    bucket = -1;
    for (x=0;x<dataset.length;x++){
        console.log(dataset[x].platformid)
        if ((x == 0) || (dataset[x-1].platformid != dataset[x].platformid)){
            bucket++;
            label_arr.push(dataset[x].platformid);
            elevation_arr.push([]);
            times_arr.push([]);
            console.log(times_arr);
            console.log(elevation_arr);
            console.log(label_arr);
        }
        if (!(times_arr[bucket].includes(dataset[x].recordtime.split('T')[1]))){
            newtime = new Date(dataset[x].recordtime).getTime()
            elevation_arr[bucket].push({x: newtime ,y: (dataset[x].elevation)});
            times_arr[bucket].push(dataset[x].recordtime.split('T')[1].substring(0,8));
        }
    }
    //elevation_arr = [...new Set(elevation_arr)];
    //times_arr = [...new Set(times_arr)];
    console.log('UNIQUE DATA')
    console.log(elevation_arr);
    console.log(times_arr);
    addData(lineChart, times_arr, elevation_arr,label_arr);
}
function addData(chart, label_arr, data, title_arr) {
    console.warn('UPDATING CHART');
    chart.options.title.text = 'test';
    for (x=0; x< label_arr.length; x++){
        chart.data.labels = chart.data.labels.concat(label_arr[x]);
        var newDataset = {
            label: title_arr[x],
            borderColor: getRandomColor(),
            borderWidth: 3,
            fill: false,
            data: data[x],
        }
        chart.data.datasets.push(newDataset);
    }
    chart.update();
    console.log(chart);
}