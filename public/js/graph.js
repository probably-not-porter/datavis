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
function createGraphReading(dataset, q_arr, color){
    //reset containers
    document.getElementById('readingStats').style.display = 'block';
    document.getElementById('line-chart').style.display = 'none';

    //prepare active container
    var parent = document.getElementById('readingStats');
    parent.innerHTML = "";

    // create title
    var trip = q_arr[0];
    var site = q_arr[1];
    var sector = q_arr[2];
    var spot = q_arr[3];

    var title = document.createElement('h');
    title.innerHTML = "Trip " + trip + ", Site " + site + ", Sector " + sector + ", Spot " + spot; 
    parent.append(title);

    //fill with content
    var textElem = document.createElement('p');
    textElem.innerHTML = "Latitude: " + dataset[x].latitude;
    parent.append(textElem);

    var textElem = document.createElement('p');
    textElem.innerHTML = "Longitude: " + dataset[x].longitude;
    parent.append(textElem);

    var textElem = document.createElement('p');
    textElem.innerHTML = "Elevation: " + dataset[x].elevation;
    parent.append(textElem);

    var textElem = document.createElement('p');
    textElem.innerHTML = "Accuracy: " + dataset[x].accuracy;
    parent.append(textElem);
    
    for (x=0;x<dataset.length;x++){
        var textElem = document.createElement('p');
        textElem.innerHTML = dataset[x].sensortype + ": " + dataset[x].value;
        parent.append(textElem);
    }
    
}
function createGraphStreaming(dataset, title,color){
    // reset some containers
    document.getElementById('line-chart').style.display = 'block';
    document.getElementById('readingStats').style.display = 'none';

    title = ''
    times_arr = []; // x axis ticks (timestamps)
    data = [[]]; // this array will each set of data (split by sensor)
    loc = 0; // set tracking
    types = []; // type tracking

    // create title
    title += dataset[0].platformname + ' (' + dataset[0].recordtime + ')';

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
    addData(lineChart, times_arr, data,types,color,title);
}
function addData(chart,times,data,types,color,title) {
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
                        maxTicksLimit: ($(window).width() / 50)
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
            legend: {
                position: 'top',
                labels: {
                    fontColor: 'rgb(255, 99, 132)'
                },
                onClick: function(e, legendItem) {
                    var index = legendItem.datasetIndex;
                    var ci = this.chart;
                    var alreadyHidden = (ci.getDatasetMeta(index).hidden === null) ? false : ci.getDatasetMeta(index).hidden;
        
                    ci.data.datasets.forEach(function(e, i) {
                        var meta = ci.getDatasetMeta(i);
        
                        if (i !== index) {
                            if (!alreadyHidden) {
                                meta.hidden = meta.hidden === null ? !meta.hidden : null;
                            } else if (meta.hidden === null) {
                                meta.hidden = true;
                            }
                        } else if (i === index) {
                            meta.hidden = null;
                        }
                    });
        
                  ci.update();
                }
            }
        }
    });
    lineChart = chart;
    chart.options.title.text = title; // graph title
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
