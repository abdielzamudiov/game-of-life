const vancas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const size = 600;
const scale = 10;
const resolution = size / scale;

let generation = 0;
let cells;

setup();
randomCells();
drawCells();

setInterval(step, 50);

function setup(){
    canvas.width = size;
    canvas.height = size;
    context.scale(scale, scale);
    context.fillStyle = 'black';
    cells = createCells()
}

function createCells(){
    let arr = new Array(resolution);
    for (let y = 0; y < resolution; y++){
        let cols = new Array(resolution);
        for(let x = 0; x < resolution; x++){
            cols[x] = false;
        }
        arr[y] = cols;
    }
    return arr;
}

function randomCells(){
    for (let y = 0; y < resolution; y++){
        for (let x = 0; x < resolution; x++){
            if ( Math.random() < 0.5 ) {
                cells[y][x] = true;
            }   
        }
    } 
}

function drawCells(){
    context.fillStyle = 'white';
    context.fillRect(0, 0, resolution, resolution);
    context.fillStyle = 'black'
    for (let y = 0; y < resolution; y++){
        for(let x = 0; x < resolution; x++){
            if (cells[x][y]) context.fillRect(x,y,1,1)
        }
    }
}

function step(){
    let newCells = createCells();
    let cellsAlive = 0
    for (let y = 0; y < resolution; y++){
        for (let x = 0; x < resolution; x++){
            const neighbours = getNeightbourCount(x,y);
            if (cells[x][y] && neighbours >= 2 && neighbours <= 3) newCells[x][y] = true;
            else if (!cells[x][y] && neighbours === 3) newCells[x][y] = true;
            cellsAlive += cells[x][y] ? 1 : 0 
        }
    }
    setRetults(generation++,cellsAlive)
    cells = newCells;
    drawCells();
}

function getNeightbourCount(x, y){
    let count = 0;
    for (let yy = -1; yy < 2; yy++){
        for (let xx = -1; xx < 2; xx++){
            if (xx === 0 && yy === 0) continue;
            if (x + xx < 0 || x + xx > resolution - 1) continue;
            if (y + yy < 0 || y + yy > resolution - 1) continue;
            if (cells[x + xx][y + yy]) count++;
        }
    }
    return count;
}

function setRetults(generation, cellsAlive){
    document.getElementById('generation').innerHTML = generation;
    document.getElementById('population').innerHTML = cellsAlive;
}
var elemLeft = canvas.offsetLeft + canvas.clientLeft,
    elemTop = canvas.offsetTop + canvas.clientTop,
    elements = [];
console.log('canvas ofserleft',canvas.offsetLeft,'canvas clientleft', canvas.clientLeft)
console.log('canvas offsetTop', canvas.offsetTop,'canvas clientTop', canvas.clientTop)

canvas.addEventListener('click', function(event) {
     var x = event.pageX - elemLeft,
        y = event.pageY - elemTop;
        console.log('click', x,y)
        x = Math.ceil(x/10)
        y = Math.ceil(y/10)
        console.log('click redondeado', x,y)
        cells[x][y] = true;
        drawCells();
}, false);