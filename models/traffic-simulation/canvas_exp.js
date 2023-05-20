/** IGNORE FOR NOW */

const topA = -10000;
const bottom = 10000;
const left = 310;
const right = 490;

const topLeft={x:left,y:topA};
const topRight={x:right,y:topA};
const bottomLeft={x:left,y:bottom};
const bottomRight={x:right,y:bottom};

var borders;
function draw(ctx){

    // ctx.beginPath();
    // ctx.moveTo(20, 20);           // Create a starting point
    // ctx.lineTo(100, 20); 
    // ctx.arcTo(150, 20, 150, 30, 50); // Create an arc
    // ctx.lineTo(150, 120);         // Continue with vertical line
    // ctx.stroke();                // Draw it
    let coords_left = getNewXYCoordsAfterBend(left, 300, "LEFT", "LEFT");
    let coords_right = getNewXYCoordsAfterBend(right, 300, "LEFT", "LEFT",  60, 511.7692);
    // let coords_right = getNewXYCoordsAfterBend(right, 300, "LEFT",  60, 200 );


    console.log(coords_left)
    console.log(coords_right)


    borders=[
        [topLeft,bottomLeft],
        [{x:left,y:300},{x:coords_left.x,y:coords_left.y}],
        [{x:right,y:300},{x:coords_right.x,y:coords_right.y}],

        [topRight,bottomRight]
    ];
    borders.forEach(border=>{
        ctx.beginPath();
        ctx.moveTo(border[0].x,border[0].y);
        ctx.lineTo(border[1].x,border[1].y);
        ctx.stroke();
    });

    
}

function compensateForShorterLength(steepness, distance_of_bend, width_of_road){
    let angle_knownSide = 90 + steepness;
    let angle_opposite = 180 - angle_knownSide;
    let y1 = width_of_road * Math.cos((angle_opposite * Math.PI/180));
    let length_dottedLine = Math.sqrt((width_of_road - y1)**2);
    let y2 = length_dottedLine/Math.tan((angle_opposite * Math.PI/180));
    console.table(y1,y2, length_dottedLine)
    return distance_of_bend + y1 + y2
}



function getNewXYCoordsAfterBend(initial_x , initial_y,dir_bend, side_bend, steepness = 60, distance_of_bend = 200){
    let adjusted_steepness;// Getting adjusted angle, because measurement starts from a particular point

    if (side_bend != dir_bend){
        distance_of_bend = compensateForShorterLength(steepness, distance_of_bend, right-left)
    }

    if (dir_bend == "LEFT"){
        adjusted_steepness = steepness * 2 + (180-steepness);
    }
    else if (dir_bend == "RIGHT"){
        adjusted_steepness = 180 - steepness;

    }
    else{
        console.error("INVALID DIR_BEND")
        adjusted_steepness = steepness;
    }

    let rad_steepness = adjusted_steepness * (Math.PI/180)
    // console.log(rad_steepness)
    // console.log(initial_x +parseFloat((Math.sin(rad_steepness) * distance_of_bend).toFixed(8)));
    // console.log(initial_y +parseFloat((Math.cos(rad_steepness) * distance_of_bend).toFixed(8)));
    return {x: initial_x +parseFloat((Math.sin(rad_steepness) * distance_of_bend).toFixed(8)), y: initial_y + parseFloat((Math.cos(rad_steepness) * distance_of_bend).toFixed(8))}
}
draw(ctx) 