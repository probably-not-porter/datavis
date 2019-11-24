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
    data = [[]];
    loc = 0;
    types = [];

    for (x=0;x<dataset.length;x++){
        
        if (!(times_arr.includes(moment(dataset[x].recordtime)))){
            times_arr.push(moment(dataset[x].recordtime));
            //data[0].push({x:moment(dataset[x].recordtime),y:dataset[x].elevation});
        }

        dataset.sort(function(a, b){
            var nameA=a.sensortype, nameB=b.sensortype;
            if (nameA < nameB) //sort string ascending
                return -1 
            if (nameA > nameB)
                return 1
            return 0 //default return value (no sorting)
        })
        if (x == 0){
            types.push(dataset[x].sensortype + ' (' + dataset[x].sensorunits + ')');
            data[loc].push({x:moment(dataset[x].recordtime), y:dataset[x].value_1,sensorid:dataset[x].sensorid, sensorunits:dataset[x].sensorunits});
        }else if ((data[data.length - 1][0]) && (data[data.length - 1][0].sensorid == dataset[x].sensorid)){
            data[loc].push({x:moment(dataset[x].recordtime), y:dataset[x].value_1, sensorid:dataset[x].sensorid, sensorunits:dataset[x].sensorunits});
        }
        else{
            data.push([]);
            loc++;
            types.push(dataset[x].sensortype + ' (' + dataset[x].sensorunits + ')');
            data[loc].push({x:moment(dataset[x].recordtime), y:dataset[x].value_1, sensorid:dataset[x].sensorid, sensorunits:dataset[x].sensorunits});
        }
    }
    console.log(data);
    addData(lineChart, times_arr, data,types,color);
}
function addData(chart,times,data,types,color) {
    console.warn('UPDATING CHART: this might take a minute!');
    console.log(types);
    
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
                    label: function (tti, data) {
                        var lab = tti.yLabel + " (" + (new Date(tti.xLabel).toLocaleTimeString()) + ")";
                    	return lab;
                    }
            	}
            },
        }
    });
    lineChart = chart;
    chart.options.title.text = 'Dataset Graph';
    chart.data.labels = times;
    for (x = 0;x<data.length;x++){
        var dataset = {
            label: types[x],
            borderColor: getRandomColor(),
            borderWidth: 3,
            fill: false,
            data: data[x],
        }
        chart.data.datasets.push(dataset);
    }
    chart.update();
}
