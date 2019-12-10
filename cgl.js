function setup() {}// createCanvas(256, 256);}
function draw() {}


var dim = 8;
var pixwidth = 30;
var arr = new Array();

function buttonClick(){
    setupArr();
    drawCanvas();
}

function setupArr(){
    //Setup the array to be empty
    for(var x = 0; x < dim; x++){
        arr[x] = [];
        for(var y = 0; y < dim; y++){
            arr[x][y] = Math.random()*250;
        }
    }
}


function drawCanvas(){
    var canvas = document.getElementById("acanvas");
    canvas.height = canvas.width = dim*pixwidth;
    var context = canvas.getContext("2d");

    for(x = 0; x < dim; x++) {
        for(y = 0; y < dim; y++) {
            var num = arr[x][y];

            context.fillStyle = "rgb(" + num + "," + num + "," + num + ")";
            context.fillRect(x*pixwidth, y*pixwidth, pixwidth, pixwidth);
        }
    }
}
