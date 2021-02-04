//Game of Life for a college homework
// University: UPSIN
// Class: Sistemas Inteligentes
// Author: Eliu Abdiel Zamudio Vaquereño
// Profesor: Rodolfo Ostos Robles
//checkout this project already deployed on https://eliuabdiel.github.io/game-of-life/ 

const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d'); //use canvas 2d context
const size = 600;
const scale = 10;
const resolution = size / scale;

//get buttons elements
const buttonStart = document.getElementById('start')
const buttonStop = document.getElementById('stop')
const buttonRandom = document.getElementById('random')
const buttonClean = document.getElementById('clean') 

let newGen = true;
let generation = 0;
let cells;
let elemLeft;
let elemTop;
let firstTime = 0;

//setup canvas context
setup();

//this las piece of code is for getting the value of the cell clicked
elemLeft = canvas.offsetLeft + canvas.clientLeft;
elemTop = canvas.offsetTop + canvas.clientTop; //first we calculate the position of the canvas

//eventListeners 

//canvas eventListener...each time canvas is clicked
canvas.addEventListener('click', function(event) {
     var x = event.pageX - elemLeft, //will get the position of the mouse by substracting the canvas position that 
        y = event.pageY - elemTop;   //we calculate to the DOM position of the mouse
        x = Math.floor(x/10) //round the number, in this case to the floor that means if 59.9 then 59 or if 59.2 then 59
        y = Math.floor(y/10)
        cells[x][y] = cells[x][y] === true ? false : true; //if the selected cell is already alive and is clicked the cell will die
        drawCells();
}, false);

//button 'Iniciar' eventListener
buttonStart.addEventListener('click', event => {
    newGen = true;
    buttonStop.textContent = 'Pausar'
    firstTime === 0 ? setInterval(newGeneration, 100) : null; //new generation every 100 ms
})

//button 'Pausar' eventListener
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

//button 'Aleatorio' eventListener
buttonRandom.addEventListener('click',event => {
    randomCells();
    resultsConstructor(cellsALiveCount())
    drawCells();
})

//button 'Limpiar' eventListener
buttonClean.addEventListener('click', event => {
    resultsConstructor(0)
    newGen = false
    cells = createCells();
    drawCells();
})

//Functions 

//constructor every time buttons 'Aleatorio' and 'Limpiar' are clicked
function resultsConstructor(cellsAlive){
    generation = 0;
    buttonStop.textContent = 'Pausar'
    setRetults(generation, cellsAlive)
}

//function that validates the Interval for each generation
function newGeneration(){
    firstTime = 1;
    newGen === true ?  step() : null
}

//function that setup de canvas with its size by 600px by 600px and the context with his scale to get a 60x60 bacteria canvas
function setup(){
    canvas.width = size;
    canvas.height = size;
    context.scale(scale, scale); //each bacteria dimentions are 10x10 bc scale = 600/10
    context.fillStyle = 'black'; //each bacteria will be filled with the color black 
    cells = createCells()
}

//function that create cells, create de array that will represent the the canvas and each array inside this array are the colums and rows, and all elements of
// this array will be a coordenate that represents the bacteria, it will set and return a full array to false, so every cell on this array will be death
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

//each element of the cell array will get a ramdom value, this is for the 'Aleatorio' button
function randomCells(){
    for (let y = 0; y < resolution; y++){
        for (let x = 0; x < resolution; x++){
            if ( Math.random() < 0.5 ) 
                cells[y][x] = true;  
        }
    } 
}

//this function draw cells on the canvas
function drawCells(){
    context.fillStyle = 'white';
    context.fillRect(0, 0, resolution, resolution);
    context.fillStyle = 'black'
    for (let y = 0; y < resolution; y++){
        for(let x = 0; x < resolution; x++){
            if (cells[x][y]) 
                context.fillRect(x,y,1,1) //position of the cell are given with x and y, fill react first parameters are the coordenates
        }
    }
}

//this function validates if a cell will live or die
function step(){
    let newCells = createCells();
    let cellsAlive = 0
    for (let y = 0; y < resolution; y++){
        for (let x = 0; x < resolution; x++){
            const neighbours = getNeightbourCount(x,y);
            if (cells[x][y] && neighbours >= 2 && neighbours <= 3) 
                newCells[x][y] = true; //if the cell in cells array that is the las generation can live, the nextgen cell in 'newCell'  array will be true
            else if (!cells[x][y] && neighbours === 3) 
                newCells[x][y] = true; //a cell that in the canva is death can live if the neighbours are equals to 3
            cellsAlive += cells[x][y] ? 1 : 0  //cellsalive count
        }
    }
    setRetults(generation++,cellsAlive)
    cells = newCells;
    drawCells();
}

//this function is overrated, i havent refactor sorry, this is only for getting the cellsalive count when 'Aleatorio' button is clicked
function cellsALiveCount(){
    let newCells = createCells();
    let cellsAlive = 0
    for (let y = 0; y < resolution; y++){
        for (let x = 0; x < resolution; x++){
            const neighbours = getNeightbourCount(x,y);
            if (cells[x][y] && neighbours >= 2 && neighbours <= 3) 
                newCells[x][y] = true;
            else if (!cells[x][y] && neighbours === 3) 
                newCells[x][y] = true;
            cellsAlive += cells[x][y] ? 1 : 0 
        }
    }
    return cellsAlive;
}
//this function calculates wheter a cell has neighbours and it return the number of neighbours
function getNeightbourCount(x, y){
    let count = 0;
    for (let yy = -1; yy < 2; yy++){
        for (let xx = -1; xx < 2; xx++){
            if (xx === 0 && yy === 0) 
                continue;
            if (x + xx < 0 || x + xx > resolution - 1) 
                continue;
            if (y + yy < 0 || y + yy > resolution - 1) 
                continue;
            if (cells[x + xx][y + yy]) 
                count++;
        }
    }
    return count;
}
//this function set de results of generation and population to be rendered
function setRetults(generation, cellsAlive){
    document.getElementById('generation').innerHTML = generation;
    document.getElementById('population').innerHTML = cellsAlive;
}


//based on the canvas rendering idea of Joost Bijlsma https://github.com/jgbijlsma
//improved by https://github.com/eliuabdiel 