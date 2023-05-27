class Controls{
    constructor(type, maxGear){
        this.forward=false;
        this.left=false;
        this.right=false;
        this.reverse=false;
        this.gear = 0;
        this.maxGear = maxGear;
        this.changeGear = false;
        this.arrowButtons = document.querySelectorAll('.arrow-keypad button');


        switch(type){
            case "KEYS":
                this.#addKeyboardListeners();
                break;
            case "DUMMY":
                this.forward=true;
                break;
        }
    }

    #addKeyboardListeners(){
        document.onkeydown=(event)=>{
            document.getElementById(event.key).classList.add('active');
            switch(event.key){
                case "ArrowLeft":
                    this.left=true;
                    break;
                case "ArrowRight":
                    this.right=true;
                    break;
                case "ArrowUp":
                    this.forward=true;
                    break;
                case "ArrowDown":
                    this.reverse=true;
                    break;
                case "w":
                    this.changeGear = true;
                    if (this.gear < this.maxGear) this.gear += 1;
                    break;
                case "s":
                    this.changeGear = true;
                    if (this.gear > 0) this.gear -= 1;
                    break;
            }
        }
        document.onkeyup=(event)=>{
            document.getElementById(event.key).classList.remove('active');


            switch(event.key){
                case "ArrowLeft":
                    this.left=false;
                    break;
                case "ArrowRight":
                    this.right=false;
                    break;
                case "ArrowUp":
                    this.forward=false;
                    break;
                case "ArrowDown":
                    this.reverse=false;
                    break;
               
            }
        }
    }
}