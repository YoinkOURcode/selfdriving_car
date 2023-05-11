const canvas=document.getElementById("myCanvas");
canvas.width=200;

const ctx = canvas.getContext("2d");
const friction =  0.5
const road=new Road(canvas.width/2,canvas.width*0.9);
const car= new Car(road.getLaneCenter(1),100,30,50, 50, 1.2, 'KEYS',friction);
const traffic = [
    new Car(road.getLaneCenter(1),-100,30,50, 40, 0.3, 'DUMMY',friction)
    // []
]

animate();

function animate(){
    // for(let i=0;i<traffic.length;i++){
    //     traffic[i].update(road.borders,[]);  j
    // }
    // car.update(road.borders,traffic);
    car.update(road.borders);


    canvas.height=window.innerHeight;

    ctx.save();
    ctx.translate(0,-car.y+canvas.height*0.7);

    road.draw(ctx);
    // for(let i=0;i<traffic.length;i++){
    //     traffic[i].draw(ctx,"red");
    // }
    car.draw(ctx,"blue");

    ctx.restore();
    requestAnimationFrame(animate);
}