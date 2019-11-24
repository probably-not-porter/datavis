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
    data = [[],[]];
    loc = 1;

    for (x=0;x<dataset.length;x++){
        
        if (!(times_arr.includes(moment(dataset[x].recordtime)))){
            times_arr.push(moment(dataset[x].recordtime));
            data[0].push({x:moment(dataset[x].recordtime),y:dataset[x].elevation});
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
            data[loc].push({x:moment(dataset[x].recordtime), y:dataset[x].value_1,sensorid:dataset[x].sensorid});
        }else if (data[data.length - 1][0]){
            if(data[data.length - 1][0].sensorid == dataset[x].sensorid){
                data[loc].push({x:moment(dataset[x].recordtime), y:dataset[x].value_1, sensorid:dataset[x].sensorid});
            }else{
		data.push([]);
		loc++;
	    }
        }
        else{
            data.push([]);
            loc++;
        }
    }
    console.log(data);
    addData(lineChart, times_arr, data,color);
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
                xAxes: [{
                    type: 'time',
                    position: 'bottom',
		    time: {
			unit:'minute'
		    }
                }]
            },
	    tooltips: {
            	callbacks: {
                    label: function (tti, data) {
                    	// Here is the trick: the second argument has the dataset label
                    	return Date(data.y);
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
