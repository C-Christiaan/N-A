cell_width = 10;
cell_x_count = 80;

const CELL_MARGIN = 1;

var interval;
interval_timeout = 250;

living_cells = [];
first_generation = [];
new_generation = [];
buffor_cells = [];
buffor_cells_pointer = 0;
const MAX_BUFFOR_CELLS_LENGTH = 30;

mouse_pushed = false;
last_mouse_cell_position = null;
started = false;
generation = 1;

let living_cells_count = 0;
let terrain_cells_count = 0;
let lava_cells_count = 0;

window.onload = function () {
    if (cell_x_count != this.parseInt(cell_x_count))
        throw 'side length is not integer !!!';

    init_canvas();
    init_simulation();

    canv.addEventListener("mousemove", mouseMove);
    canv.addEventListener("mousedown", mouseDown);
    canv.addEventListener("mouseup", mouseUp);
    document.addEventListener("keydown", keyDown);
    document.getElementById("input_x_cells").addEventListener("change", dimensionsFormChanged);
    document.getElementById("input_cell_width").addEventListener("change", dimensionsFormChanged);
    canv.oncontextmenu = function (e) {
        var evt = new Object({ keyCode: 93 });
        if (e.preventDefault != undefined)
            e.preventDefault();
        if (e.stopPropagation != undefined)
            e.stopPropagation();
    }

    document.getElementById("speedSlider").addEventListener("input", function () {
        interval_timeout = parseInt(this.value);
        document.getElementById("speedValue").innerText = interval_timeout;
        clearInterval(interval);
        interval = setInterval(simulation, interval_timeout);
        document.getElementById("p_speed").innerHTML = "Speed = " + Math.floor(1000 / interval_timeout) + " generations per sec";
    });

    interval = setInterval(simulation, interval_timeout);
    document.getElementById("p_speed").innerHTML = "Speed = " + 1000 / interval_timeout + " generations per sec";
}

function whichCell(x, y, canBeOnGridcell) {
    if (((x % cell_width >= cell_width - CELL_MARGIN || y % cell_width >= cell_width - CELL_MARGIN) && !canBeOnGridcell) ||
        x < 0 || x >= canv.width || y < 0 || y >= canv.height) {
        return null;
    }
    cell_x = Math.floor(x / cell_width);
    cell_y = Math.floor(y / cell_width);
    if (!(x >= 0 && x < canv.width && y >= 0 && y < canv.height)) {
        return null;
    }
    return { x: cell_x, y: cell_y };
}

function pencilErase(evt) {
    x = parseInt(evt.offsetX);
    y = parseInt(evt.offsetY);

    if (last_mouse_cell_position != null)
        cell = whichCell(x, y, true);
    else
        cell = whichCell(x, y, false);

    if (cell == null && last_mouse_cell_position == null) {
        return;
    }
    else if (cell != null) {
        if (last_mouse_cell_position != null) {
            if (evt.buttons === 1) {
                cells = makeCellsLine(last_mouse_cell_position, cell);
                cells = cells.filter(c => !living_cells[c.x][c.y] && !terrain_cells[c.x][c.y] && !lava_cells[c.x][c.y]);
                createAndDrawCells(cells);
            }
            if (evt.buttons === 2) {
                cells = makeCellsLine(last_mouse_cell_position, cell);
                cells = cells.filter(c => living_cells[c.x][c.y] && !terrain_cells[c.x][c.y] && !lava_cells[c.x][c.y]);
                killAndDrawCells(cells);
            }
        }
        else {
            if (evt.buttons === 1 && !living_cells[cell.x][cell.y] && !terrain_cells[cell.x][cell.y] && !lava_cells[cell.x][cell.y])
                createAndDrawCells([cell]);
            if (evt.buttons === 2 && living_cells[cell.x][cell.y] && !terrain_cells[cell.x][cell.y] && !lava_cells[cell.x][cell.y])
                killAndDrawCells([cell]);
        }
    }
    last_mouse_cell_position = cell;
}

function init_canvas() {
    canv = document.getElementById("canv");
    canv.width = cell_x_count * cell_width;
    canv.height = cell_x_count * cell_width;

    ctx = canv.getContext("2d");
    ctx.fillStyle = "#404040";
    ctx.fillRect(0, 0, canv.width, canv.height);

    drawGrid();
}

function drawGrid() {
    ctx.strokeStyle = "#808080";
    ctx.lineWidth = 1;

    for (let i = 0; i <= cell_x_count; i++) {
        ctx.beginPath();
        ctx.moveTo(i * cell_width, 0);
        ctx.lineTo(i * cell_width, canv.height);
        ctx.stroke();
    }

    for (let j = 0; j <= cell_x_count; j++) {
        ctx.beginPath();
        ctx.moveTo(0, j * cell_width);
        ctx.lineTo(canv.width, j * cell_width);
        ctx.stroke();
    }
}

function init_simulation() {
    living_cells = [];
    new_generation = [];
    buffor_cells = [];
    buffor_cells_pointer = 0;
    terrain_cells = [];
    lava_cells = [];

    buffor_cells.push([]);
    for (let i = 0; i < cell_x_count; i++) {
        living_cells.push([]);
        new_generation.push([]);
        buffor_cells[0].push([]);
        terrain_cells.push([]);
        lava_cells.push([]);

        for (let j = 0; j < cell_x_count; j++) {
            living_cells[i].push(false);
            new_generation[i].push(false);
            buffor_cells[0][i].push(false);
            terrain_cells[i].push(false);
            lava_cells[i].push(false);
        }
    }
    placeTerrainCells();
    placeLavaCells();
    updateCellCounts();
    drawGeneration();
}

function placeTerrainCells() {
    const terrain_density_input = parseInt(document.getElementById("input_terrain_density").value);
    const terrain_density = terrain_density_input / 1000;

    terrain_cells_count = 0;
    for (let i = 0; i < cell_x_count; i++) {
        for (let j = 0; j < cell_x_count; j++) {
            if (Math.random() < terrain_density) {
                terrain_cells[i][j] = true;
                terrain_cells_count++;
            } else {
                terrain_cells[i][j] = false;
            }
        }
    }
}

function placeLavaCells() {
    const lava_density_input = parseInt(document.getElementById("input_lava_density").value);
    const lava_density = lava_density_input / 1000;

    lava_cells_count = 0;
    for (let i = 0; i < cell_x_count; i++) {
        for (let j = 0; j < cell_x_count; j++) {
            if (Math.random() < lava_density) {
                lava_cells[i][j] = true;
                lava_cells_count++;
            } else {
                lava_cells[i][j] = false;
            }
        }
    }
}

function mouseMove(evt) {
    if (mouse_pushed == true)
        pencilErase(evt);
}

function mouseDown(evt) {
    mouse_pushed = true;
    pencilErase(evt);
}

function mouseUp() {
    mouse_pushed = false;
    last_mouse_cell_position = null;

    if (buffor_cells_pointer >= buffor_cells.length)
        throw 'buffor_cells_pointer < buffor_cells.length';
    if (buffor_cells_pointer < buffor_cells.length - 1) {
        var buf = buffor_cells.length - 1 - buffor_cells_pointer;
        for (i = 0; i < buf; i++) {
            buffor_cells.pop();
        }
    }
    if (buffor_cells_pointer != buffor_cells.length - 1)
        throw 'buffor_cells_pointer == buffor_cells.length-1';
    if (buffor_cells.length == MAX_BUFFOR_CELLS_LENGTH) {
        buffor_cells.shift();
        buffor_cells_pointer--;
    }
    buffor_cells.push([]);
    for (i = 0; i < living_cells.length; i++) {
        buffor_cells[buffor_cells.length - 1].push([]);
        for (j = 0; j < living_cells[i].length; j++) {
            buffor_cells[buffor_cells.length - 1][i].push(living_cells[i][j]);
        }
    }
    buffor_cells_pointer++;
}

function keyDown(evt) {
    if (evt.key == 's') {
        if (document.getElementById("p_start_status").innerHTML == "Simulation started")
            button_stop();
        else if (document.getElementById("p_start_status").innerHTML == "Simulation stopped")
            button_start();
    }
    else if (evt.key == 'r')
        button_backTo1Gen();
    else if (evt.key == 'c')
        button_clear();
}

function dimensionsFormChanged() {
    document.getElementById("a_w").innerHTML = parseInt(document.getElementById("input_x_cells").value * parseInt(document.getElementById("input_cell_width").value));
}

function button_submit() {
    cx = parseInt(document.getElementById("input_x_cells").value);
    cd = parseInt(document.getElementById("input_cell_width").value);
    if (!(cx >= 5 && cx <= 250))
        alert("Error: length of board must be between 5 and 250");
    else if (!(cd >= 3 && cd <= 41))
        alert("Error: cell width must be between 3 and 25");
    else {
        cell_x_count = cx;
        cell_width = cd;
        button_clear();
    }
}

function button_start() {
    started = true;

    first_generation = [];
    for (let i = 0; i < living_cells.length; i++) {
        first_generation.push([]);
        for (let j = 0; j < living_cells[i].length; j++) {
            first_generation[i].push(living_cells[i][j]);
        }
    }

    document.getElementById("title_start_stop").innerHTML = "stop [S]";
    document.getElementById("button_start_stop").href = "javascript:button_stop();"

    document.getElementById("p_start_status").innerHTML = "Simulation started";

    drawGeneration();
}

function button_stop() {
    started = false;

    document.getElementById("title_start_stop").innerHTML = "start [S]";
    document.getElementById("button_start_stop").href = "javascript:button_start();"

    document.getElementById("p_start_status").innerHTML = "Simulation stopped";
}

function button_backTo1Gen() {
    button_stop();
    if (generation > 1) {
        living_cells = [];
        for (let i = 0; i < first_generation.length; i++) {
            living_cells.push([]);
            for (let j = 0; j < first_generation[i].length; j++) {
                living_cells[i].push(first_generation[i][j]);
            }
        }
        drawGeneration();
        generation = 1;

        document.getElementById("p_generation").innerHTML = "Generation = " + generation;
    }
}

function button_clear() {
    button_backTo1Gen();
    init_canvas();
    init_simulation();
}
function drawGrid() {
    ctx.strokeStyle = "#808080"; 
    ctx.lineWidth = 1;

    for (let i = 0; i <= cell_x_count; i++) {
        ctx.beginPath();
        ctx.moveTo(i * cell_width, 0);
        ctx.lineTo(i * cell_width, canv.height);
        ctx.stroke();
    }

    for (let j = 0; j <= cell_x_count; j++) {
        ctx.beginPath();
        ctx.moveTo(0, j * cell_width);
        ctx.lineTo(canv.width, j * cell_width);
        ctx.stroke();
    }
}

function drawGeneration() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canv.width, canv.height);

    for (let i = 0; i < cell_x_count; i++) {
        for (let j = 0; j < cell_x_count; j++) {
            if (living_cells[i][j]) {
                drawCell({ x: i, y: j }, "white");
            } else if (terrain_cells[i][j]) {
                drawCell({ x: i, y: j }, "green");
            } else if (lava_cells[i][j]) {
                drawCell({ x: i, y: j }, "red");
            } else {
                drawCell({ x: i, y: j }, "black");
            }
        }
    }


    if (!started) {
        drawGrid();
    }
}

function simulation() {
    if (started == false) return;

    let living_neighborhood = 0;
    let terrain_neighborhood = 0; 
    let lava_neighborhood = 0; 
    living_cells_count = 0;

    for (let x = 0; x < cell_x_count; x++) {
        for (let y = 0; y < cell_x_count; y++) {
            living_neighborhood = 0;
            terrain_neighborhood = 0;
            lava_neighborhood = 0;

            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    if (i === 0 && j === 0) continue;
                    let nx = x + i;
                    let ny = y + j;

                    if (nx >= 0 && nx < cell_x_count && ny >= 0 && ny < cell_x_count) {
                        if (living_cells[nx][ny]) living_neighborhood++;
                        if (terrain_cells[nx][ny]) terrain_neighborhood++; 
                        if (lava_cells[nx][ny]) lava_neighborhood++;
                    }
                }
            }

            if (living_cells[x][y]) {
                living_cells_count++;
                if (lava_neighborhood > 0) {
                    new_generation[x][y] = false;
                } else if (living_neighborhood < 2 || living_neighborhood > 3) {
                    new_generation[x][y] = false;
                } else {
                    new_generation[x][y] = true;
                }
            }
            else {
                if (living_neighborhood === 3 || (terrain_neighborhood > 0 && living_neighborhood > 0)) {   
                    new_generation[x][y] = true;
                } else {
                    new_generation[x][y] = false;
                }
            }
        }
    }

    for (let i = 0; i < cell_x_count; i++) {
        for (let j = 0; j < cell_x_count; j++) {
            living_cells[i][j] = new_generation[i][j];
        }
    }

    generation++;
    document.getElementById("p_generation").innerHTML = "Generation = " + generation;
    updateCellCounts();
    drawGeneration();
}

function updateCellCounts() {
    document.getElementById("p_living_cells").innerHTML = "Living Cells: " + living_cells_count;
    document.getElementById("p_terrain_cells").innerHTML = "Terrain Cells: " + terrain_cells_count;
    document.getElementById("p_lava_cells").innerHTML = "Lava Cells: " + lava_cells_count;
}

function makeCellsLine(prev_cell, cell) {
    var cells = [];
    if (cell.x - prev_cell.x == 0 && cell.y - prev_cell.y == 0) {
        return [cell];
    }
    else if (cell.y - prev_cell.y == 0) {
        var bottom, top;
        if (prev_cell.x > cell.x) {
            bottom = cell.x;
            top = prev_cell.x;
        }
        else {
            top = cell.x;
            bottom = prev_cell.x;
        }
        for (x = bottom; x <= top; x++) {
            cells.push({ x: x, y: cell.y });
        }
    }
    else if (cell.x - prev_cell.x == 0) {
        var left, right;
        if (prev_cell.y > cell.y) {
            left = cell.y;
            right = prev_cell.y;
        }
        else {
            right = cell.y;
            left = prev_cell.y;
        }
        for (y = left; y <= right; y++) {
            cells.push({ x: cell.x, y: y });
        }
    }
    else if (Math.abs(cell.x - prev_cell.x) > Math.abs(cell.y - prev_cell.y)) {
        var a = (cell.y - prev_cell.y) / (cell.x - prev_cell.x);
        var b = cell.y - (a * cell.x);
        var bottom, top;
        if (prev_cell.x > cell.x) {
            bottom = cell.x;
            top = prev_cell.x;
        }
        else {
            top = cell.x;
            bottom = prev_cell.x;
        }
        for (x = bottom; x <= top; x++) {
            y = a * x + b;
            cells.push({ x: parseInt(x + 0), y: parseInt(y + 0) });
        }
    }
    else if (Math.abs(cell.x - prev_cell.x) <= Math.abs(cell.y - prev_cell.y)) {
        var a = (cell.y - prev_cell.y) / (cell.x - prev_cell.x);
        var b = cell.y - (a * cell.x);
        var left, right;
        if (prev_cell.y > cell.y) {
            left = cell.y;
            right = prev_cell.y;
        }
        else {
            right = cell.y;
            left = prev_cell.y;
        }
        for (y = left; y <= right; y++) {
            x = (y - b) / a;
            cells.push({ x: parseInt(x + 0), y: parseInt(y + 0) });
        }
    }
    else
        throw "This exception shouldn't happen: no reachable code ... for sure???";
    return cells;
}

function createCells(cells) {
    for (i = 0; i < cells.length; i++)
        living_cells[cells[i].x][cells[i].y] = true;
}

function killCells(cells) {
    for (i = 0; i < cells.length; i++)
        living_cells[cells[i].x][cells[i].y] = false;
}

function createAndDrawCells(cells) {
    createCells(cells);
    for (i = 0; i < cells.length; i++)
        drawCell(cells[i], "white");
}

function killAndDrawCells(cells) {
    killCells(cells);
    for (i = 0; i < cells.length; i++)
        drawCell(cells[i], "black");
}

function drawCell(position, color) {
    ctx.fillStyle = color;
    ctx.fillRect(position.x * cell_width, position.y * cell_width, cell_width - CELL_MARGIN, cell_width - CELL_MARGIN);
}