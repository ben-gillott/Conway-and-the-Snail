function setup() {}// createCanvas(256, 256);}
function draw() {}


var dim = 8;
var pixwidth = 30;
var stepLength = 4;
var borderValue = 0; //Value used when sampling the borderland
var flag = false;
var arr = new Array();
var arr2 = new Array();

function setupBtn(){
    setupArr();
    drawCanvas();
}

function timeStep(){
    timestep();
    drawCanvas();
}

function setupArr(){
    //Setup the array to be empty
    for(var x = 0; x < dim; x++){
        arr[x] = [];
        arr2[x] = [];
        for(var y = 0; y < dim; y++){
            arr[x][y] = Math.floor(Math.random()*2); //Generate two colors (0,1)
            arr2[x][y] = 0;
        }
    }
}


function drawCanvas(){
    var canvas = document.getElementById("acanvas");
    canvas.height = canvas.width = dim*pixwidth;
    var context = canvas.getContext("2d");

    for(x = 0; x < dim; x++) {
        for(y = 0; y < dim; y++) {
            var rgb = colorFromValue(arr[x][y]);

            context.fillStyle = "rgb(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + ")";
            context.fillRect(x*pixwidth, y*pixwidth, pixwidth, pixwidth);
        }
    }
}

function colorFromValue(v){
    if (v == 0){
        return [0,0,0];
    }else if (v == 1){
        return [250, 250, 250];
    }
    return [250, 0, 0];

}

function timestep(){
    for(var x = 1; x < dim-1; x++){
        for(var y = 1; y < dim -1; y++){
            arr[x][y] = calculate(x,y);
        }
    }
    // arr = arr2;
}

function calculate(x, y){
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