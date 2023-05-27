const canvas=document.getElementById("myCanvas");
canvas.width=250;

const roadWidth = 200

const friction = 0.05;

const ctx = canvas.getContext("2d");
const road=new Road(roadWidth/2,roadWidth*0.9);

const car= new Car(road.getLaneCenter(1),100,30,50, 50, 1.2, 'KEYS',friction, "default");
const traffic = [
    new Car(road.getLaneCenter(1),-100,30,50, 40, 1.2, 'DUMMY',friction, "default")
]

animate();

function generateTraffic(car, traffic){
    for(let i=0;i<traffic.length;i++){
        traffic[i].update(road.borders,[]);
    }
    car.update(road.borders,traffic);
}

function drawCars(car, traffic){
    if (traffic != undefined){
        for(let i=0;i<traffic.length;i++){
            traffic[i].draw(ctx,"red");
        }
    }
    car.draw(ctx,"black");
}

function animate(){
    
    generateTraffic(car, traffic);

    canvas.height=window.innerHeight;



    ctx.save();
    ctx.translate(0,-car.y+canvas.height*0.7);
    road.draw(ctx);

    drawCars(car, traffic);

    

    ctx.restore();
    requestAnimationFrame(animate);

}