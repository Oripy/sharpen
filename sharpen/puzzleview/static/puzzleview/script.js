let test_puzzle_url = "https://app.crackingthecryptic.com/i1b2tofyj0"; //fortress
test_puzzle_url = "https://app.crackingthecryptic.com/wyqe8cjb01";
// test_puzzle_url = "https://sudokupad.app/clover/dec-7-2023-foggy-xv-pairs"; // fog
// test_puzzle_url = "https://app.crackingthecryptic.com/21bvx5z3n5"; // little killer
// test_puzzle_url = "https://app.crackingthecryptic.com/0e83ahsjp5"; // skyscraper
// test_puzzle_url = "https://app.crackingthecryptic.com/00ynm0o6j5" // pencilmarks
// test_puzzle_url = "https://app.crackingthecryptic.com/0jc2imleer"; // palindrome & killer
// test_puzzle_url = "https://app.crackingthecryptic.com/3y9wfi6wco"; // German Whisper
// test_puzzle_url = "https://sudokupad.app/dec-1-2023-dutch-whispers"; 
// test_puzzle_url = "https://app.crackingthecryptic.com/6sztf0swi8"; // text in center
// test_puzzle_url = "https://app.crackingthecryptic.com/60wxgsamk5"; // diagonals
// test_puzzle_url = "https://app.crackingthecryptic.com/3q6mri0s98"; // between line
// test_puzzle_url = "https://app.crackingthecryptic.com/2ltc4am5r6"; // thermos & odd/even
// test_puzzle_url = "https://app.crackingthecryptic.com/o07lderrxk"; // thermos
// test_puzzle_url = "https://app.crackingthecryptic.com/7woqsyke29"; // killer
// test_puzzle_url = "https://app.crackingthecryptic.com/2lyndcalsk"; // arrows with large bubbles
// test_puzzle_url = "https://app.crackingthecryptic.com/0qe26aaixc"; // lines and quadruples
// test_puzzle_url = "https://app.crackingthecryptic.com/6l4moy8137"; // XV and kropki
// test_puzzle_url = "https://sudokupad.app/philip-newman/20240201-im-so-sorry"; // kropki with values
// test_puzzle_url = "https://app.crackingthecryptic.com/2gv3mu7khs"; // difference kropki
// test_puzzle_url = "https://sudokupad.app/ryr673qcbh"; //cages and colors

async function get_fpuzzle_string_from_CTC_short(url) {
    // Todo: check if valid CTC short URL
    let puzzle_id = url.split("/").slice(-1)[0];
    const response = await fetch("https://sudokupad.app/api/puzzle/" + puzzle_id);
    return response.text();
}

const GREY = "#aaaaaa";
const RENBAN_COLOR = "#F067F0";
const WHISPER_COLOR = "#67F067";
const ENTROPIC_COLOR = "#FFCCAA";
const REGION_SUM_COLOR = "#2ECBFF";
const NABNER_COLOR = "#C9C883";
const DOUBLE_ARROW_COLOR = "#C54B8B";
const ROW_INDEXER_COLOR = "#7CC77C";
const COLUMN_INDEXER_COLOR = "#C77C7C";
const BOX_INDEXER_COLOR = "#7C7CC7";
const THERMO_COLOR = "#d0d0d0";
const PALINDROME_COLOR = "#c0c0c0";
const FOG_COLOR = "#aeaeae";

const CELL_WIDTH = 40;
const BORDER_WIDTH = CELL_WIDTH;
const KROPKI_DIAMETER = CELL_WIDTH/3.5;
const KILLER_OFFSET = CELL_WIDTH/7;
const QUADRUPLE_DIAMETER = CELL_WIDTH*0.75;
const LINE_BASE_WIDTH = CELL_WIDTH/2;
const BUBBLE_DIAMETER = CELL_WIDTH*0.75;
const ODD_EVEN_DIAMETER = CELL_WIDTH*0.8;
const ARROW_HEAD_LENGH = CELL_WIDTH/3;

function cell_RC(text) {
    let [, row, column] = text.match(/^R(\d+)C(\d+)$/);
    return [parseInt(row), parseInt(column)];
}

function cell_center(cell) {
    return [(cell[1]-1)*CELL_WIDTH+BORDER_WIDTH+CELL_WIDTH/2,
            (cell[0]-1)*CELL_WIDTH+BORDER_WIDTH+CELL_WIDTH/2]
}

function cell_corner(cell, corner = "UL", offset = 0) {
    if (corner == "UL") {
        return [(cell[1]-1)*CELL_WIDTH+BORDER_WIDTH+offset,
                (cell[0]-1)*CELL_WIDTH+BORDER_WIDTH+offset];
    } else if (corner == "UR") {
        return [(cell[1])*CELL_WIDTH+BORDER_WIDTH-offset,
                (cell[0]-1)*CELL_WIDTH+BORDER_WIDTH+offset];
    } else if (corner == "DL") {
        return [(cell[1]-1)*CELL_WIDTH+BORDER_WIDTH+offset,
                (cell[0])*CELL_WIDTH+BORDER_WIDTH-offset];
    } else if (corner == "DR") {
        return [(cell[1])*CELL_WIDTH+BORDER_WIDTH-offset,
                (cell[0])*CELL_WIDTH+BORDER_WIDTH-offset];
    }
}

function cell_border(cell, border = "U", offset = 0) {
    if (border == "U") {
        return [(cell[1]-0.5)*CELL_WIDTH+BORDER_WIDTH+offset,
                (cell[0]-1)*CELL_WIDTH+BORDER_WIDTH+offset];
    } else if (border == "D") {
        return [(cell[1]-0.5)*CELL_WIDTH+BORDER_WIDTH-offset,
                (cell[0])*CELL_WIDTH+BORDER_WIDTH+offset];
    } else if (border == "L") {
        return [(cell[1]-1)*CELL_WIDTH+BORDER_WIDTH+offset,
                (cell[0]-0.5)*CELL_WIDTH+BORDER_WIDTH-offset];
    } else if (border == "R") {
        return [(cell[1])*CELL_WIDTH+BORDER_WIDTH-offset,
                (cell[0]-0.5)*CELL_WIDTH+BORDER_WIDTH-offset];
    }
}


function leftmost_of_top_row(cells) {
    let output_cell = cells[0];
    for (let c of cells) {
        if (c[0] < output_cell[0]) {
            if (c[1] < output_cell[0]) {
                output_cell = c;
            }
        }
    }
    return output_cell;
}

function draw_text(cell, text_value, color = 0, size = 0.75*CELL_WIDTH) {
    let [pos_x, pos_y] = cell_center(cell);
    fill(color);
    textSize(size);
    noStroke();
    text(text_value, pos_x, pos_y);
}

function draw_line(start_cell, end_cell, arrow = false) {
    let [start_x, start_y] = cell_center(start_cell);
    let [end_x, end_y] = cell_center(end_cell);
    line(start_x, start_y, end_x, end_y);
    if (arrow) {
        let angle = Math.atan2(end_y - start_y, end_x - start_x);
        line(end_x, end_y, end_x - ARROW_HEAD_LENGH * Math.cos(angle - Math.PI / 4), end_y - ARROW_HEAD_LENGH * Math.sin(angle - Math.PI / 4));
        line(end_x, end_y, end_x - ARROW_HEAD_LENGH * Math.cos(angle + Math.PI / 4), end_y - ARROW_HEAD_LENGH * Math.sin(angle + Math.PI / 4));
    }
}

function draw_lines(json, width = LINE_BASE_WIDTH/4, arrow = false) {
    strokeWeight(width);
    for (l of json.lines) {
        let cells = [];
        for (let cell of l) {
            cells.push(cell_RC(cell));
        }
        start_cell = cells[0];
        for (p of cells.slice(1,-1)) {
            end_cell = p;
            draw_line(start_cell, end_cell);
            start_cell = end_cell;
        }
        end_cell = cells.slice(-1)[0];
        draw_line(start_cell, end_cell, arrow);
    }
}

function draw_little_arrow(cell, direction) {
    stroke(0);
    strokeWeight(1);
    let [start_x, start_y] = cell_center(cell);
    let [end_x, end_y] = cell_corner(cell, direction, CELL_WIDTH/10);
    let angle = Math.atan2(end_y - start_y, end_x - start_x);
    line(end_x - 0.3*CELL_WIDTH * Math.cos(angle), end_y - 0.3*CELL_WIDTH * Math.sin(angle), end_x, end_y);
    line(end_x, end_y, end_x - 0.2*CELL_WIDTH * Math.cos(angle - Math.PI / 4), end_y - 0.2*CELL_WIDTH * Math.sin(angle - Math.PI / 4));
    line(end_x, end_y, end_x - 0.2*CELL_WIDTH * Math.cos(angle + Math.PI / 4), end_y - 0.2*CELL_WIDTH * Math.sin(angle + Math.PI / 4));
}

function draw_shape(cell, type, position = "center", size = ODD_EVEN_DIAMETER, stroke_color = 0, fill_color = 255, value = "", font_color = 0) {
    if (position == "center") {
        [pos_x, pos_y] = cell_center(cell);
    }
    strokeWeight(1);
    stroke(stroke_color);
    fill(fill_color);

    if (type == "circle") circle(pos_x, pos_y, size);
    if (type == "ellipse") ellipse(pos_x, pos_y, size[0], size[1]);
    if (type == "square") {
        rectMode(CENTER);
        rect(pos_x, pos_y, size);
        rectMode(CORNER);
    }
    if (value != "") {
        noStroke();
        fill(font_color);
        textSize(floor(KROPKI_DIAMETER));
        text(value, pos_x, pos_y);
    }
}

function draw_bubble(cells) {
    stroke(GREY);
    strokeWeight(3);
    fill(255);
    for (let c of cells) {
        circle(cell_center(c)[0], cell_center(c)[1], BUBBLE_DIAMETER);
    }
    rectMode(CENTER);
    if (cells.length > 1) {
        let pairs = cells.flatMap(
            (v, i) => cells.slice(i+1).map(w => [v, w])
        );
        for (let p of pairs) {
            if (p[0][0] == p[1][0]) {
                if (Math.abs(p[0][1] - p[1][1]) == 1) {
                    rect(min(p[0][1], p[1][1])*CELL_WIDTH+BORDER_WIDTH, cell_center(p[0])[1], CELL_WIDTH, BUBBLE_DIAMETER);
                }
            } else if (p[0][1] == p[1][1]) {
                if (Math.abs(p[0][0] - p[1][0]) == 1) {
                    rect(cell_center(p[0])[0], min(p[0][0], p[1][0])*CELL_WIDTH+BORDER_WIDTH, BUBBLE_DIAMETER, CELL_WIDTH);
                }
            }
        }
    }
    for (let c of cells) {
        noStroke();
        circle(cell_center(c)[0], cell_center(c)[1], BUBBLE_DIAMETER-2);
    }
}

function arrow(json) {
    draw_lines(json, LINE_BASE_WIDTH/4, true);
    if (json.cells) {
        let cells = [];
        for (let cell of json.cells) {
            cells.push(cell_RC(cell));
        }
        draw_bubble(cells);
    }
}

function quadruple(json) {
    let cells = [];
    for (let cell of json.cells) {
        cells.push(cell_RC(cell));
    }
    top_left_cell = leftmost_of_top_row(cells);
    pos_x = BORDER_WIDTH + CELL_WIDTH*top_left_cell[1];
    pos_y = BORDER_WIDTH + CELL_WIDTH*top_left_cell[0];
    stroke(0);
    strokeWeight(1);
    fill(255);
    circle(pos_x, pos_y, QUADRUPLE_DIAMETER);

    if (json.values) {
        quad_text = json.values[0];
        if (json.values[1]) quad_text += " " + json.values[1];
        if (json.values[2]) quad_text += "\n" + json.values[2];
        if (json.values[3]) quad_text += " " + json.values[3];
        fill(0);
        textSize(floor(CELL_WIDTH/4));
        noStroke();
        text(quad_text, pos_x, pos_y);
    }
}

function ratio(json) {
    let [r1, c1] = cell_RC(json.cells[0]);
    let [r2, c2] = cell_RC(json.cells[1]);
    kropki(r1, c1, r2, c2, "ratio", json.value);
}

function difference(json) {
    let [r1, c1] = cell_RC(json.cells[0]);
    let [r2, c2] = cell_RC(json.cells[1]);
    kropki(r1, c1, r2, c2, "difference", json.value);
}

function xv(json) {
    let [r1, c1] = cell_RC(json.cells[0]);
    let [r2, c2] = cell_RC(json.cells[1]);
    kropki(r1, c1, r2, c2, "xv", json.value);
}

function kropki(r1, c1, r2, c2, type, val) {
    strokeWeight(1);
    if (r1 == r2) {
        pos_x = BORDER_WIDTH + (max(c1, c2)-1)*CELL_WIDTH;
        pos_y = BORDER_WIDTH + (r1-1)*CELL_WIDTH + CELL_WIDTH/2;
    } else if (c1 == c2) {
        pos_x = BORDER_WIDTH + (c1-1)*CELL_WIDTH + CELL_WIDTH/2;
        pos_y = BORDER_WIDTH + (max(r1, r2)-1)*CELL_WIDTH;
    }

    if (type == "ratio") {
        stroke(0);
        fill(0);
    } else if (type == "difference") {
        stroke(0);
        fill(255);
    } else if (type == "xv") {
        noStroke();
        fill(255);
    }
    circle(pos_x, pos_y, KROPKI_DIAMETER);
    
    textSize(floor(KROPKI_DIAMETER));
    if (type == "ratio") {
        fill(255);
    } else if (type == "difference") {
        fill(0);
    } else if (type == "xv") {
        fill(0);
    }
    noStroke();
    if (val) text(val, pos_x, pos_y);
}

function cage(json) {
    let cells = [];
    for (let cell of json.cells) {
        cells.push(cell_RC(cell));
    }
    
    // top lines
    cells_with_top_lines = [];
    cells_with_bottom_lines = [];
    cells_with_left_lines = [];
    cells_with_right_lines = [];
    for (let c of cells) {
        let include_top = true;
        let include_bottom = true;
        let include_left = true;
        let include_right = true;
        for (let other of cells) {
            if (other[1] == c[1]) { //same column
                if (other[0] == c[0]-1) { include_top = false; }
                if (other[0] == c[0]+1) { include_bottom = false; }
            }
            if (other[0] == c[0]) { //same row
                if (other[1] == c[1]-1) { include_left = false; }
                if (other[1] == c[1]+1) { include_right = false; }
            }
        }
        if (include_top) { cells_with_top_lines.push(c); }
        if (include_bottom) { cells_with_bottom_lines.push(c); }
        if (include_left) { cells_with_left_lines.push(c); }
        if (include_right) { cells_with_right_lines.push(c); }
    }
    for (let c of cells_with_top_lines) {
        pos_x1 = BORDER_WIDTH+CELL_WIDTH*(c[1]-1)+KILLER_OFFSET;
        pos_x2 = BORDER_WIDTH+CELL_WIDTH*(c[1])-KILLER_OFFSET;
        pos_y = BORDER_WIDTH+CELL_WIDTH*(c[0]-1)+KILLER_OFFSET;
        stroke(0);
        strokeWeight(1);
        drawingContext.setLineDash([CELL_WIDTH/10, CELL_WIDTH/10]);
        line(pos_x1, pos_y, pos_x2, pos_y);
        drawingContext.setLineDash([]);
    }
    for (let c of cells_with_bottom_lines) {
        pos_x1 = BORDER_WIDTH+CELL_WIDTH*(c[1]-1)+KILLER_OFFSET;
        pos_x2 = BORDER_WIDTH+CELL_WIDTH*(c[1])-KILLER_OFFSET;
        pos_y = BORDER_WIDTH+CELL_WIDTH*(c[0])-KILLER_OFFSET;
        stroke(0);
        strokeWeight(1);
        drawingContext.setLineDash([CELL_WIDTH/10, CELL_WIDTH/10]);
        line(pos_x1, pos_y, pos_x2, pos_y);
        drawingContext.setLineDash([]);
    }
    for (let c of cells_with_left_lines) {
        pos_x = BORDER_WIDTH+CELL_WIDTH*(c[1]-1)+KILLER_OFFSET;
        pos_y1 = BORDER_WIDTH+CELL_WIDTH*(c[0]-1)+KILLER_OFFSET;
        pos_y2 = BORDER_WIDTH+CELL_WIDTH*(c[0])-KILLER_OFFSET;
        stroke(0);
        strokeWeight(1);
        drawingContext.setLineDash([CELL_WIDTH/10, CELL_WIDTH/10]);
        line(pos_x, pos_y1, pos_x, pos_y2);
        drawingContext.setLineDash([]);
    }
    for (let c of cells_with_right_lines) {
        pos_x = BORDER_WIDTH+CELL_WIDTH*(c[1])-KILLER_OFFSET;
        pos_y1 = BORDER_WIDTH+CELL_WIDTH*(c[0]-1)+KILLER_OFFSET;
        pos_y2 = BORDER_WIDTH+CELL_WIDTH*(c[0])-KILLER_OFFSET;
        stroke(0);
        strokeWeight(1);
        drawingContext.setLineDash([CELL_WIDTH/10, CELL_WIDTH/10]);
        line(pos_x, pos_y1, pos_x, pos_y2);
        drawingContext.setLineDash([]);
    }
}

function killer_digit(json) {
    let cells = [];
    for (let cell of json.cells) {
        cells.push(cell_RC(cell));
    }
    cell_with_value = leftmost_of_top_row(cells);
    if (json.value) {
        pos_x = BORDER_WIDTH+CELL_WIDTH*(cell_with_value[1]-1)+CELL_WIDTH/5;
        pos_y = BORDER_WIDTH+CELL_WIDTH*(cell_with_value[0]-1)+CELL_WIDTH/5;
        fill(255);
        noStroke();
        circle(pos_x, pos_y, CELL_WIDTH/3);
        fill(0);
        textSize(CELL_WIDTH/5);
        noStroke();
        text(json.value, pos_x, pos_y);
    }
}

function setup() {
    textAlign(CENTER, CENTER);
    textFont("Verdana");
    let coded_string = get_fpuzzle_string_from_CTC_short(test_puzzle_url)
    .then((t) => {
        let decompressed = PuzzleLoader.decompressPuzzleId(t);
        console.log(decompressed);
        let json = JSON.parse(decompressed);
        console.log(json);
        const grid_size_x = json.grid.length;
        const grid_size_y = json.grid[0].length;
        createCanvas(2*BORDER_WIDTH+grid_size_x*CELL_WIDTH, 2*BORDER_WIDTH+grid_size_y*CELL_WIDTH);
        background(220);
        strokeWeight(1);
        rectMode(CORNER);
        for (let i = 0; i < json.grid.length; i++) {
            for (let j = 0; j < json.grid[i].length; j++) {
                let color = json.grid[i][j].c;
                if (color) {
                    fill(color);
                } else {
                    fill(255);
                }
                let pos_y = BORDER_WIDTH+CELL_WIDTH*i;
                let pos_x = BORDER_WIDTH+CELL_WIDTH*j;
                rect(pos_x, pos_y,
                    CELL_WIDTH, CELL_WIDTH);
            }
        }

        if (json["diagonal+"]) {
            stroke("#5fb8e1");
            strokeWeight(2);
            line(BORDER_WIDTH, BORDER_WIDTH+grid_size_x*CELL_WIDTH, BORDER_WIDTH+grid_size_x*CELL_WIDTH, BORDER_WIDTH);
        }
        if (json["diagonal-"]) {
            stroke("#5fb8e1");
            strokeWeight(2);
            line(BORDER_WIDTH, BORDER_WIDTH, BORDER_WIDTH+grid_size_x*CELL_WIDTH, BORDER_WIDTH+grid_size_x*CELL_WIDTH);
        }

        
        if (json.odd) {
            for (let o of json.odd) {
                noStroke();
                fill(GREY);
                draw_shape(cell_RC(o.cell), "circle");
            } 
        }
        if (json.even) {
            for (let e of json.even) {
                noStroke();
                fill(GREY);
                draw_shape(cell_RC(e.cell), "square");
            }
        }
        if (json.line) {
            for (let l of json.line) {
                stroke(l.outlineC ? l.outlineC : GREY);
                line_width = ((l.width) ? floor(LINE_BASE_WIDTH*l.width) : LINE_BASE_WIDTH/4);
                draw_lines(l, line_width);
            }
        }
        if (json.whispers) {
            stroke(WHISPER_COLOR);
            for (let l of json.whispers) {
                line_width = ((l.width) ? floor(LINE_BASE_WIDTH*l.width) : LINE_BASE_WIDTH/2);
                draw_lines(l, line_width);
            }
        }
        if (json.palindrome) {
            stroke(PALINDROME_COLOR);
            for (let l of json.palindrome) {
                line_width = ((l.width) ? floor(LINE_BASE_WIDTH*l.width) : LINE_BASE_WIDTH/2);
                draw_lines(l, line_width);
            }
        }
        if (json.thermometer) {
            for (let t of json.thermometer) {
                noStroke();
                fill(GREY);
                draw_shape(cell_RC(t.lines[0][0]), "circle", "center", BUBBLE_DIAMETER, GREY, GREY);
                line_width = ((t.width) ? floor(LINE_BASE_WIDTH*t.width) : LINE_BASE_WIDTH*0.75);
                draw_lines(t, line_width);
            }
        }
        if (json.doublearrow) {
            for (let b of json.doublearrow) {
                stroke(GREY);
                fill(255);
                line_width = ((b.width) ? floor(LINE_BASE_WIDTH*b.width) : LINE_BASE_WIDTH*0.1);
                draw_lines(b, line_width);
                draw_shape(cell_RC(b.lines[0][0]), "circle", "center", BUBBLE_DIAMETER, GREY);
                draw_shape(cell_RC(b.lines[0].slice(-1)[0]), "circle", "center", BUBBLE_DIAMETER, GREY);
            }
        }
        if (json.betweenline) {
            for (let b of json.betweenline) {
                stroke(GREY);
                fill(255);
                line_width = ((b.width) ? floor(LINE_BASE_WIDTH*b.width) : LINE_BASE_WIDTH*0.1);
                draw_lines(b, line_width);
                draw_shape(cell_RC(b.lines[0][0]), "circle", "center", BUBBLE_DIAMETER, GREY);
                draw_shape(cell_RC(b.lines[0].slice(-1)[0]), "circle", "center", BUBBLE_DIAMETER, GREY);
            }
        }
        if (json.maximum) {
            for (let m of json.maximum) {

            }
        }
        if (json.minimum) {
            for (let m of json.minimum) {

            }
        }
        if (json.littlekillersum) {
            for (let clues of json.littlekillersum) {
                draw_text(cell_RC(clues.cell), clues.value, 0, 0.33*CELL_WIDTH);
                draw_little_arrow(cell_RC(clues.cell), clues.direction);
            }
        }
        let no_fog_cages = [];
        if (json.cage) { 
            for (let c of json.cage) {
                if (c.value == 'FOGLIGHT') {
                    for (cell of c.cells) {
                        no_fog_cages.push(cell_RC(cell));
                    }
                } else {
                    cage(c);
                }
            }
        }
        if (json.killercage) {
            for (let k of json.killercage) {
                cage(k);
                killer_digit(k);
            }
        }
        if (json.arrow) {
            for (let a of json.arrow) arrow(a);
        }
        if (json.ratio) {
            for (let r of json.ratio) ratio(r);
        }
        if (json.difference) {
            for (let d of json.difference) difference(d);
        }
        if (json.xv) {
            for (let d of json.xv) xv(d);
        }
        if (json.quadruple) {
            for (let k of json.quadruple) quadruple(k);
        }
        if (json.circle) {
            for (let c of json.circle) {
                if (c.cells.length == 1) {
                    draw_shape(cell_RC(c.cells[0]), "ellipse", "center", [c.width, c.height],
                                       ((c.outlineC) ? c.outlineC : 0),
                                       ((c.baseC) ? c.baseC : 0),
                                       ((c.value) ? c.value : ""),
                                       ((c.fontC) ? c.baseC : 0));
                } else if (c.cells.length == 2) {
                    let cell1 = cell_RC(c.cells[0]);
                    let cell2 = cell_RC(c.cells[1]);
                    let cell = [(cell1[0] + cell2[0])/2, (cell1[1] + cell2[1])/2]
                    draw_shape(cell, "ellipse", "center", [c.width*CELL_WIDTH, c.height*CELL_WIDTH],
                                       ((c.outlineC) ? c.outlineC : 0),
                                       ((c.baseC) ? c.baseC : 0),
                                       ((c.value) ? c.value : ""),
                                       ((c.fontC) ? c.fontC : 0));
                }
            }
        }
        if (json.text) {
            for (let t of json.text) {
                for (let cell of t.cells) {
                    draw_text(cell_RC(cell), t.value, t.fontC, t.size*CELL_WIDTH);
                }
            }
        }
        for (let i = 0; i < json.grid.length; i++) {
            for (let j = 0; j < json.grid[i].length; j++) {
                let val = json.grid[i][j].value;
                if (val) {
                    draw_text([i+1, j+1], val);
                }
                let center_pencilmarks = json.grid[i][j].centerPencilMarks;
                if (center_pencilmarks && !val) {
                    draw_text([i+1, j+1], center_pencilmarks.join(''), 0, 0.3*CELL_WIDTH);
                }
            }
        }
        if (json.foglight) {
            for (cell of json.foglight) {
                no_fog_cages.push(cell_RC(cell));
            }
        }
        if (no_fog_cages.length > 0) {
            stroke(0);
            fill(FOG_COLOR);
            for (let i = 0; i < json.grid.length; i++) {
                for (let j = 0; j < json.grid[i].length; j++) {
                    skip = false;
                    for (let elem of no_fog_cages) {
                        if (elem[0]-1 == i && elem[1]-1 == j) {
                            skip = true;
                        }
                    }
                    if (!skip) {
                        let pos_y = BORDER_WIDTH+CELL_WIDTH*i;
                        let pos_x = BORDER_WIDTH+CELL_WIDTH*j;
                        rect(pos_x, pos_y, CELL_WIDTH, CELL_WIDTH);
                    }
                }
            }
        }

        noFill();
        stroke(0);
        strokeWeight(3);
        rect(BORDER_WIDTH, BORDER_WIDTH,
            CELL_WIDTH*grid_size_x, CELL_WIDTH*grid_size_y);
        if (json.size == 9) {
            line(BORDER_WIDTH+3*CELL_WIDTH, BORDER_WIDTH,
                BORDER_WIDTH+3*CELL_WIDTH, BORDER_WIDTH+9*CELL_WIDTH);
            line(BORDER_WIDTH+6*CELL_WIDTH, BORDER_WIDTH,
                BORDER_WIDTH+6*CELL_WIDTH, BORDER_WIDTH+9*CELL_WIDTH);
            line(BORDER_WIDTH, BORDER_WIDTH+3*CELL_WIDTH,
                BORDER_WIDTH+9*CELL_WIDTH, BORDER_WIDTH+3*CELL_WIDTH);
            line(BORDER_WIDTH, BORDER_WIDTH+6*CELL_WIDTH,
                BORDER_WIDTH+9*CELL_WIDTH, BORDER_WIDTH+6*CELL_WIDTH);
        } else if (json.size == 6) {
            line(BORDER_WIDTH+3*CELL_WIDTH, BORDER_WIDTH,
                BORDER_WIDTH+3*CELL_WIDTH, BORDER_WIDTH+6*CELL_WIDTH);
            line(BORDER_WIDTH, BORDER_WIDTH+2*CELL_WIDTH,
                BORDER_WIDTH+6*CELL_WIDTH, BORDER_WIDTH+2*CELL_WIDTH);
            line(BORDER_WIDTH, BORDER_WIDTH+4*CELL_WIDTH,
                BORDER_WIDTH+6*CELL_WIDTH, BORDER_WIDTH+4*CELL_WIDTH);
        }
    });
}
