class Car{
    constructor(x,y,width,height,  maxSpeed, acceleration, controlType, friction, maxGear, selfdrive = false){
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;

        this.speed=0;
        this.acceleration =  acceleration / 2 / 3.6;
        this.maxSpeedInMS = (maxSpeed  / 3.6) / 2 ; 
        // this.maxSpeed= (maxSpeed  / 3.6) / 2 ; 
        this.friction=friction;
        this.angle=0;
        this.damaged=false;

        
        // if (scenario == "parking"){
        //     this.maxSpeed = this.maxSpeed * 0.4
        // }
        this.controls=new Controls(controlType, maxGear, selfdrive);
        if(controlType!="DUMMY"){
            this.sensor=new Sensor(this);
            this.controls.gear = 5;
            
        }
        else if (controlType == "DUMMY"){
            this.controls.gear = 4;
        }
    }

    update(roadBorders,traffic){
        if(!this.damaged){
            this.#move();
            this.#changeGear(5);
            this.polygon=this.#createPolygon();
            this.damaged=this.#assessDamage(roadBorders,traffic);
        }
        if(this.sensor){
            document.getElementById("gearCount").innerHTML = "Current Gear: " + this.controls.gear;
            document.getElementById("speedDisplay").innerHTML = "Current Speed: " + Math.abs((Math.round(this.speed * 2 * 3.6))) + "km/h";
            this.offsets = this.sensor.readings.map(s => s==null?1:s.offset);

            this.sensor.update(roadBorders,traffic);
        }
        
    }

    #changeGear(maxGear){
        this.maxSpeed = (this.maxSpeedInMS / maxGear) * this.controls.gear;
    }

    #assessDamage(roadBorders,traffic){
        for(let i=0;i<roadBorders.length;i++){
            if(polysIntersect(this.polygon,roadBorders[i])){
                return true;
            }
        }
        for(let i=0;i<traffic.length;i++){
            if(polysIntersect(this.polygon,traffic[i].polygon)){
                return true;
            }
        }
        return false;
    }

    #createPolygon(){
        const points=[];
        const rad=Math.hypot(this.width,this.height)/2;
        const alpha=Math.atan2(this.width,this.height);
        points.push({
            x:this.x-Math.sin(this.angle-alpha)*rad,
            y:this.y-Math.cos(this.angle-alpha)*rad
        });
        points.push({
            x:this.x-Math.sin(this.angle+alpha)*rad,
            y:this.y-Math.cos(this.angle+alpha)*rad
        });
        points.push({
            x:this.x-Math.sin(Math.PI+this.angle-alpha)*rad,
            y:this.y-Math.cos(Math.PI+this.angle-alpha)*rad
        });
        points.push({
            x:this.x-Math.sin(Math.PI+this.angle+alpha)*rad,
            y:this.y-Math.cos(Math.PI+this.angle+alpha)*rad
        });
        return points;
    }

    #move(){
        if(this.controls.forward){
            this.speed+=this.acceleration;
        }
        if(this.controls.reverse){
            this.speed-=this.acceleration;
        }

        if(this.speed>this.maxSpeed){
            this.speed -= (this.acceleration + this.friction)
            // this.speed=this.maxSpeed;
        }
        if(this.speed<-this.maxSpeed/2){
            this.speed=-this.maxSpeed/2;
        }

        if(this.speed>0){
            this.speed-=this.friction;
        }
        if(this.speed<0 ){
            this.speed+=this.friction;
        }
        if(Math.abs(this.speed)<this.friction){
            this.speed=0;
        }

        if(this.speed!=0 ){
            const flip=this.speed>0?1:-1;
            if(this.controls.left){
                this.angle+=0.0075*flip;
            }
            if(this.controls.right){
                this.angle-=0.0075*flip;
            }
        }

        this.x-=Math.sin(this.angle)*this.speed;
        this.y-=Math.cos(this.angle)*this.speed;
    }

    isDone(){
        const goalDistanceTravelled = -10000;
        return (this.y < goalDistanceTravelled);
    }

    draw(ctx,color){
        if(this.damaged){
            ctx.fillStyle="gray";
        }else{
            ctx.fillStyle=color;
        }
        ctx.beginPath();
        ctx.moveTo(this.polygon[0].x,this.polygon[0].y);
        for(let i=1;i<this.polygon.length;i++){
            ctx.lineTo(this.polygon[i].x,this.polygon[i].y);
        }
        ctx.fill();

        if(this.sensor){
            this.sensor.draw(ctx);
        }
    }
}