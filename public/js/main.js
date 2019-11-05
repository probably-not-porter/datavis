/*
#
# Datavis 2.0
# Porter Libby - 2019 - initial setup
# pelibby16@earlham.edu
#
# Starts the program + general stuff
*/

function ready(){ // placeholder for now
    switchToData() // set screen to data
    base_url = document.location.href; // get base url
    console.log(base_url);

    url_parts = base_url.split('?')
    url_params = null;

    if (url_parts[1]){ // selection exists
        if (url_parts[1].length > 0){ // params exist
            url_params = url_parts[1].split('/');
        }
        console.log(url_params);
        if (url_params[0] == 'query'){ // load premade query
            loadQuery(url_params);
        }
    }
    
    document.getElementById('loading').style.display = 'none';
}