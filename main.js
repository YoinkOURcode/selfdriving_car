class Main{
    constructor(scenario){
        this.canvas = document.getElementById("myCanvas")
        this.canvas.width=200;
        this.ctx = this.canvas.getContext("2d");
        this.scenario = scenario;

        switch(scenario){
            case "vparking":
                this.roadWidth = 150;
                this.friction = 0.05;
                this.road=new Road(this.roadWidth/2,this.roadWidth*0.9, 2, "default");
                console.log(this.road)
                this.car = new Car(this.road.getLaneCenter(1),100,30,50, 50, 1.2, 'KEYS',this.friction, 5);
                
                this.createTraffic(350)

                break;

            case "pparking":
                this.roadWidth = 150;
                this.friction = 0.05;
                this.road=new Road(this.roadWidth/2,this.roadWidth*0.9, 2, "default");
                console.log(this.road)
                this.car = new Car(this.road.getLaneCenter(1),100,30,50, 50, 1.2, 'KEYS',this.friction, 5);
                
                this.createTraffic(350)

                break;

            default:
                this.roadWidth = this.canvas.width
                this.friction = 0.05;
                this.road=new Road(this.roadWidth/2,this.roadWidth*0.9, 3);
                this.car = new Car(this.road.getLaneCenter(2),100,30,50, 50, 1.2, 'KEYS',this.friction, 5);
                this.createTraffic("RDM")

        }
    }

    createTraffic(y){
        this.traffic = [

        ];
        setInterval(() => {
            
            if (!y == "RDM"){
                this.traffic.push(new Car(this.road.getLaneCenter(Math.floor(Math.random() * 2)),y,30,50, 40, 1.2, 'DUMMY',this.friction, 4))
            }
            else{
                let randomized_y =-(Math.random() * window.innerHeight + (Math.abs(this.car.y) + window.innerHeight));
                this.traffic.push(new Car(this.road.getLaneCenter(Math.floor(Math.random() * 2)),randomized_y,30,50, 40, 1.2, 'DUMMY',this.friction, 4))
            }
        }, Math.floor(Math.random() * 4000) + 1200);
    }

    generateTraffic(){
        for(let i=0;i<this.traffic.length;i++){
            this.traffic[i].update(this.road.borders,[]);
        }
        this.car.update(this.road.borders,this.traffic);
    }

    drawCars(){
        for(let i=0;i<this.traffic.length;i++){
            this.traffic[i].draw(this.ctx,"red");
        }
        this.car.draw(this.ctx,"black");
    }

    animate(){
        this.generateTraffic();

        this.canvas.height=window.innerHeight;
        this.ctx.save();
        this.ctx.translate(0,-this.car.y+this.canvas.height*0.7);
        this.road.draw(this.ctx);

        this.drawCars();

        this.ctx.restore();
        requestAnimationFrame(this.animate.bind(this));
    }
}

const main = new Main();
main.animate()