class Road{
    //curvePoints refer to the y values where the car will start to bend at
    //curveAngle refers to angle tetha, use sin to find out new x value, increase
    constructor(x,width,laneCount=2 ){ 
        this.x=x;
        this.width=width;
        this.laneCount=laneCount;

        this.left=x-width/2;
        this.right=x+width/2;

        const infinity=1000000;
        this.top=-infinity;
        this.bottom=infinity;
        
        const topLeft={x:this.left,y:this.top};
        const topRight={x:this.right,y:this.top};
        const bottomLeft={x:this.left,y:this.bottom};
        const bottomRight={x:this.right,y:this.bottom};

       
        
        this.borders=[
            [topLeft,bottomLeft],
            [topRight,bottomRight]
            // [{x:this.right,y:-50},{x:this.right + 50,y:-50}]

        ];
    }

    getBorders(btmPoint, side_x_value,  curvePoints){
        let borderArr = [];
        // let coordinate_arr = [];
        // borderArr.push(btmPoint);

        for(let i = 0; i < curvePoints.length; i++){
            //If there is a curvePoint, we will push
            borderArr.push([{x: side_x_value, y: curvePoints[i]}]);    

        }
    }

    getNewXYCoordsAfterBend(ctx,initial_x, initial_y, steepness, distance_of_bend = 60){
        console.log(initial_x +parseFloat((Math.sin(steepness) * distance_of_bend).toFixed(8)));
        console.log(initial_y +parseFloat((Math.cos(steepness) * distance_of_bend).toFixed(8)));
        // return {x: initial_x +parseFloat((Math.sin(steepness) * distance_of_bend).toFixed(8)), y: initial_y + parseFloat((Math.cos(steepness) * distance_of_bend).toFixed(8))}
        let balls = {x: initial_x +parseFloat((Math.sin(steepness) * distance_of_bend).toFixed(8)), y: initial_y + parseFloat((Math.cos(steepness) * distance_of_bend).toFixed(8))}
        
    }

    getLaneCenter(laneIndex){
        const laneWidth=this.width/this.laneCount;
        return this.left+laneWidth/2+
            Math.min(laneIndex,this.laneCount-1)*laneWidth;
    }

    draw(ctx){
        ctx.lineWidth=5;
        ctx.strokeStyle="white";

        for(let i=1;i<=this.laneCount-1;i++){
            const x=lerp(
                this.left,
                this.right,
                i/this.laneCount
            );
            
            ctx.setLineDash([20,20]);
            ctx.beginPath();
            ctx.moveTo(x,this.top);
            ctx.lineTo(x,this.bottom);
            ctx.stroke();
        }

        ctx.setLineDash([]);
        this.borders.forEach(border=>{
            ctx.beginPath();
            ctx.moveTo(border[0].x,border[0].y);
            ctx.lineTo(border[1].x,border[1].y);
            ctx.stroke();
        });
    }
}