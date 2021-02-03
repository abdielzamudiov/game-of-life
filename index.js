const vancas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const size = 600;
const scale = 10;
const resolution = size / scale;

let newGen = true;
let generation = 0;
let cells;

setup();

const buttonStart = document.getElementById('start')
const buttonStop = document.getElementById('stop')
const buttonRandom = document.getElementById('random')
const buttonClean = document.getElementById('clean') 

buttonStart.addEventListener('click', event => {
    newGen = true;
    buttonStop.textContent = 'Pausar'
    setInterval(newGeneration, 50);
})
buttonStop.addEventListener('click', event => {
    const paused = () => {
        buttonStop.textContent = 'Pausado'
        return false
    }
    const play = () => {
        buttonStop.textContent = 'Pausar'
        return true
    }
    newGen = (buttonStop.textContent === 'Pausar') ? paused() : play()
})

buttonRandom.addEventListener('click',event => {
    randomCells();
    resultsConstructor(cellsALiveCount())
    drawCells();
})

buttonClean.addEventListener('click', event => {
    resultsConstructor(0)
    newGen = false
    cells = createCells();
    drawCells();
})

function resultsConstructor(cellsAlive){
    generation = 0;
    buttonStop.textContent = 'Pausar'
    setRetults(generation, cellsAlive)
}

function newGeneration(){
    newGen === true ?  step() : null
}

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
function cellsALiveCount(){
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
    return cellsAlive;
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
    elemTop = canvas.offsetTop + canvas.clientTop;

canvas.addEventListener('click', function(event) {
     var x = event.pageX - elemLeft,
        y = event.pageY - elemTop;
        x = Math.floor(x/10)
        y = Math.floor(y/10)
        cells[x][y] = cells[x][y] === true ? false : true;
        drawCells();
}, false);