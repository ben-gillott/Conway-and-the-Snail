var dim = 250;
var pixwidth = 2;
var stepLength = 4;
var startAreaValue = 200;
var flag = false;
var arr = new Array();
var map = new Array();
var seacolor = [0,80,200];

/**
 * When the time step button is pressed:
 * -gets the next iteration
 * -draws the result
 */
function timeStepBtn(){
    console.log("time stepped");
    arr = getNextIteration(arr);
    drawCanvas(arr);
}


function setupBtn(){
    setup2DArr(arr, 0);
    setup2DArr(map, 0);

    //Setup the map
    var img = document.getElementById('map-image');
    var canvas = document.getElementById("mcanvas"); // var canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    var context = canvas.getContext("2d"); 
    context.drawImage(img, 0, 0);

    var pixelData;
    var xoffset = 20; 

    for(var x = 0; x < 187; x++){
        for(var y = 0; y < 250; y++){
            pixelData = context.getImageData(x, y, 1, 1).data;
            map[x+xoffset][y] = mapColorToMapValue(pixelData);
        }
    }

    fillStarterValues(arr);
    drawCanvas(arr);
    console.log("setup completed");
}


/**
 * 
 * @param {*} data A pixel value in the map describing the setup of the experiment
 */
function mapColorToMapValue(data){
    //Red -> Starting vals (2)
    if(data[0] > 100 && data [1] < 50 && data[2] < 50){
        return 2;
    }
    //Black -> Land value
    else if(data[0] < 50 && data [1] < 50 && data[2] < 50){
        return 1;
    }
    //White -> Sea value (1)
    else if(data[0] > 200 && data [1] > 200 && data[2] > 200){
        return 0;
    }
    else{
        //Color category not found, treat as sea
        console.log("Color not registered in mapColorToMapValue" + data);
        return 0;
    }
}


function setup2DArr(arrIn, defl){
    //Setup the array to be empty
    for(var x = 0; x < dim; x++){
        arrIn[x] = [];
        for(var y = 0; y < dim; y++){
            arrIn[x][y] = defl;
        }
    }
}

function fillStarterValues(arrIn){
    var mapval;

    for(var x = 0; x < dim; x++){
        for(var y = 0; y < dim; y++){
            mapval = map[x][y];
            if(mapval == 0){
                //SEA: This value should not be needed or read
                arrIn[x][y] = 0;
            }else if (mapval == 1){
                //LAND: this starts with base value
                arrIn[x][y] = 0;
            }else if(mapval == 2){
                //Starter land: start with more advanced value
                arrIn[x][y] = startAreaValue;
            }else{
                arrIn[x][y] = 0;
                console.log("Error in fillStarterValues");
            }
        }
    }
}

function fillRandomValues(arrIn){
    for(var x = 0; x < dim; x++){
        for(var y = 0; y < dim; y++){
            arrIn[x][y] = Math.floor(Math.random()*2); //Generate two colors (0,1)
        }
    }
}


function drawCanvas(arrIn){
    var canvas = document.getElementById("acanvas");
    canvas.height = canvas.width = dim*pixwidth;
    var context = canvas.getContext("2d");

    for(x = 0; x < dim; x++) {
        for(y = 0; y < dim; y++) {
            
            var rgb = colorFromArrCoord(x,y,arrIn);

            // var rgb = colorFromMapCoord(x,y);

            context.fillStyle = "rgb(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + ")";
            context.fillRect(x*pixwidth, y*pixwidth, pixwidth, pixwidth);
        }
    }
}

function colorFromArrCoord(x,y,arrIn){
    if(map[x][y] == 0){
        return seacolor;
    }
    var greyScale = arrIn[x][y];
    return [greyScale, greyScale, greyScale];
}


function getNextIteration(arrIn){
    var retArr = new Array();
    setup2DArr(retArr, 0);

    for(var x = 1; x < dim-1; x++){
        for(var y = 1; y < dim -1; y++){
            //TODO:Switch the calculation function here
            retArr[x][y] = calculateDiffusion(x,y,arrIn); 
        }
    }
    return retArr;
}

/**
 * Calculates the next value for a given iteration
 */
function calculateDiffusion(x, y, arr){
    if(map[x][y] == 0){
        return -1;
    }

    var ys = [y+1, y, y-1, y+1, y-1, y+1, y, y-1];
    var xs = [x+1,x+1,x+1,x,x,x-1,x-1,x-1];

    var count = 0;
    var squares = 0;

    for (var i = 0; i < 8; i++){
        // console.log(map[p[0]][p[1]]);
        var mapval = map[xs[i]][ys[i]];

        if(mapval == 0){
            //SEAZONE
        }else if (mapval == 1){
            //LANDZONE
            squares++;
            count += arr[xs[i]][ys[i]];
        }
        else if (mapval == 2){
            //STARTZONE
            squares++;
            count += arr[xs[i]][ys[i]];
        }
        else{
            console.log("AN ERROR OCCURED - unidentified map value");
        }
    }

    var speed = Math.random()*2;
    var num = Math.max(Math.floor(speed*count/Math.max(squares, 1)), arr[x][y]);
    return num;
    //Changed
}



function calculateCGL(x, y){
    var num = arr[x+1][y+1]+arr[x+1][y]+arr[x+1][y-1]+arr[x][y+1]+arr[x][y-1]+arr[x-1][y+1]+arr[x-1][y]+arr[x-1][y-1];
    //Any live cell with two or three neighbors survives.
    //All other live cells die in the next generation. 
    if(arr[x][y] == 1 && !(num == 2 || num == 3)){
        return 0;
    }
    //Any dead cell with three live neighbors becomes a live cell.
    else if(arr[x][y] == 0 && (num == 3)){
        return 1;
    }
    return arr[x][y];
}

