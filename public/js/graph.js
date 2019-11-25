/*
#
# Datavis 2.0
# Porter Libby - 2019 - initial setup
# pelibby16@earlham.edu
#
# Graph functions
*/

var lineChart;

// create null chart for no data case
$( document ).ready(function() {
    lineChart = new Chart(document.getElementById("line-chart"), {
        type: 'scatter', // init to scatter plot
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
    times_arr = []; // x axis ticks (timestamps)
    data = [[]]; // this array will each set of data (split by sensor)
    loc = 0; // set tracking
    types = []; // type tracking

    // sort dataset according to sensortype value
    dataset.sort(function(a, b){
        var nameA=a.sensortype, nameB=b.sensortype;
        if (nameA < nameB) //sort string ascending
            return -1 
        if (nameA > nameB)
            return 1
        return 0 //default return value (no sorting)
    })

    // create independent buckets of data for each plot
    for (x=0;x<dataset.length;x++){
        if (!(times_arr.includes(moment(dataset[x].recordtime)))){
            times_arr.push(moment(dataset[x].recordtime));
        }
        if (x == 0){ // if first element
            types.push(dataset[x].sensortype + ' (' + dataset[x].sensorunits + ')'); // these will be labels
            data[loc].push({x:moment(dataset[x].recordtime), y:dataset[x].value_1,sensorid:dataset[x].sensorid, sensorunits:dataset[x].sensorunits});
        }else if ((data[data.length - 1][0]) && (data[data.length - 1][0].sensorid == dataset[x].sensorid)){ // data matches last used bucket
            data[loc].push({x:moment(dataset[x].recordtime), y:dataset[x].value_1, sensorid:dataset[x].sensorid, sensorunits:dataset[x].sensorunits});
        }
        else{ // no match, create new bucket
            data.push([]); // create empty subset
            loc++;
            types.push(dataset[x].sensortype + ' (' + dataset[x].sensorunits + ')'); // these will be labels
            data[loc].push({x:moment(dataset[x].recordtime), y:dataset[x].value_1, sensorid:dataset[x].sensorid, sensorunits:dataset[x].sensorunits});
        }
    }
    addData(lineChart, times_arr, data,types,color);
}
function addData(chart,times,data,types,color) {
    console.warn('UPDATING CHART: this might take a minute!');
    
    if (chart){
        chart.destroy(); // clear old information so it doesnt overflow
    }
    chart = new Chart(document.getElementById("line-chart"), { // create new chart structure for streaming data
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
                xAxes: [{
                    type: 'time',
                    position: 'bottom',
                    time: {
                        unit:'minute'
                    },
                    ticks: {
                        autoSkip: true,
                        maxTicksLimit: 50
                    }
                }]
            },
	    tooltips: { 
            	callbacks: {
                    label: function (tti, data) { // callback to set tooltips
                        var lab = tti.yLabel + " (" + (new Date(tti.xLabel).toLocaleTimeString()) + ")";
                    	return lab;
                    }
            	}
            },
        }
    });
    lineChart = chart;
    chart.options.title.text = 'Dataset Graph'; // graph title
    chart.data.labels = times;

    for (x = 0;x<data.length;x++){ // create plot for each set of data [elevation,pressure,etc...]
        var dataset = {
            label: types[x],
            borderColor: getRandomColor(), // choose random color for now
            borderWidth: 3,
            fill: false,
            data: data[x],
        }
        chart.data.datasets.push(dataset);
    }
    chart.update();
}
