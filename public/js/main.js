/*
#
# Datavis 2.0
# pelibby16@earlham.edu
#
# Starts the program + general stuff
*/

function ready(){
    switchToData() // set screen to data
    $.ajax({
        type: 'GET',
        url: '/v',
        success: function(response) { 
            document.getElementById("version-tag").innerHTML = "IFS Datavis Tool<br>v" + response;
        },
        error: function(xhr, status, err) {
            console.error('DATA: XHR Error.');
        }
    });
    $.ajax({
        type: 'GET',
        url: '/poolstatus',
        success: function(response) { 
            if (response == false){
                document.getElementById("nodb").style.display = "block";
            }
            
        },
        error: function(xhr, status, err) {
            console.error('DATA: XHR Error.');
        }
    });

    base_url = document.location.href; // get base url

    url_parts = base_url.split('?')
    url_params = null;

    if (url_parts[1]){ // selection exists
        if (url_parts[1].length > 0){ // params exist
            url_params = url_parts[1].split('/');
        }
        if ((url_params[0] == 'query') && (url_params.length > 5)){ // load premade query
            loadQuery(url_params);
        }else{
            console.warn('MAIN: Query incomplete; Ignored.');
        }
    }
    
    document.getElementById('loading').style.display = 'none';
    document.getElementById("button_permalink").disabled = true;
    document.getElementById("button_csv").disabled = true;
    toggleDetails(); // starts out in detail 2 mode.
}