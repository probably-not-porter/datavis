/*
#
# Datavis 2.0
# Porter Libby - 2019 - initial setup
# pelibby16@earlham.edu
#
# Graph functions
*/

var lineChart;
var months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];

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
    console.log(dataset);
    //reset containers
    document.getElementById('readingStats').style.display = 'block';
    document.getElementById('line-chart').style.display = 'none';

    //prepare active container
    var parent = document.getElementById('readingStats');
    parent.innerHTML = "";

    if (dataset != null){
        // create title
        var trip = dataset[0].tripname;
        var site = dataset[0].sitename;
        var sector = dataset[0].sectorname;

        var title = document.createElement('h');
        title.innerHTML = "Spots from " + trip + " (trip), " + site + " (site), " + sector + " (sector)"; 
        parent.append(title);

        const table = document.createElement('table');
        var tableHTML = "";
        var keys = ["Spot","Date","Time","elevation","longitude","latitude","accuracy"];
        for(x=9;x<Object.keys(dataset[0]).length;x++){
            keys.push(Object.keys(dataset[0])[x]);
        }

        tableHTML += createTableHeader(keys);
        

        for ( x = 0 ; x < dataset.length ; x++){
            prop_arr = [];
            for (y=0;y<keys.length;y++){
                if (keys[y] == "Date"){
                    date = new Date(dataset[x]["recordtime"]);
                    prop_arr.push(months[date.getMonth()] + ' ' +date.getDate() + ", " + date.getFullYear());
                    prop_arr.push(date.toLocaleTimeString('en-US'));
                    y++;

                }else{
                    prop_arr.push(dataset[x][keys[y]]);
                }
            }
            tableHTML += createTableRow(prop_arr);
        }
        // append table to parent
        table.innerHTML = tableHTML;
        parent.append(table);
    }
}

function createTableRow(arr){
    text = '<tr>';
    for (j=0;j<arr.length;j++){
        if(j==0){
            text += "<th>Spot " + arr[j] + "</th>"
        }else{
            text += "<td>" + arr[j] + "</td>"
        }
    }
    text += '</tr>';
    return text;
}
function createTableHeader(arr){
    text = '<tr>';
    for (j=0;j<arr.length;j++){
        if(j==0){
            text += "<th>" + "" + "</th>"
        }else{
            text += "<th>" + arr[j] + "</th>"
        }
    }
    text += '</tr>';
    return text;
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
        type: 'line',
        data: {},
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                zoom: {
                    // Container for pan options
                    pan: {
                        enabled: true,
                        mode: 'x',
            
                        // Function called while the user is panning
                        onPan: function({chart}) { console.log(`I'm panning!!!`); },
                        // Function called once panning is completed
                        onPanComplete: function({chart}) { console.log(`I was panned!!!`); }
                    },
            
                    // Container for zoom options
                    zoom: {
                        enabled: true,
                        drag: false,
                        mode: 'x',
                        speed: 0.1,
            
                        // Function called while the user is zooming
                        onZoom: function({chart}) { console.log(`I'm zooming!!!`); },
                        // Function called once zooming is completed
                        onZoomComplete: function({chart}) { console.log(`I was zoomed!!!`); }
                    }
                }
            },
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
