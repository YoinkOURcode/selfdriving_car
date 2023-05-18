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
    let coords = getNewXYCoordsAfterBend();
    borders=[
        [topLeft,bottomLeft],
        [{x:left,y:300},{x:coords.x,y:coords.y}],
        [topRight,bottomRight]
    ];
    borders.forEach(border=>{
        ctx.beginPath();
        ctx.moveTo(border[0].x,border[0].y);
        ctx.lineTo(border[1].x,border[1].y);
        ctx.stroke();
    });

    
}

function getNewXYCoordsAfterBend(initial_x = left, initial_y = 300, steepness = 60, distance_of_bend = 60){
    let rad_steepness = steepness * (Math.PI/180)
    console.log(rad_steepness)
    console.log(initial_x +parseFloat((Math.sin(rad_steepness) * distance_of_bend).toFixed(8)));
    console.log(initial_y +parseFloat((Math.cos(rad_steepness) * distance_of_bend).toFixed(8)));
    return {x: initial_x +parseFloat((Math.sin(rad_steepness) * distance_of_bend).toFixed(8)), y: initial_y + parseFloat((Math.cos(rad_steepness) * distance_of_bend).toFixed(8))}
}
draw(ctx) 