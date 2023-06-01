class Model{

    constructor(main){
        this.numIterations = 100;
        
        this.numEpisodes = 10;
        this.maxTimeSteps = 5;
        this.finishLine = -3000; // The position of the finish line

        this.maxTimeSteps = 100;
        this.environment = {}
        this.rewards = [];
        this.environment.getOffset = () => {
            return main.car.offsets;
        }
        this.environment.reset = () => {
            main.reset();
        }
        this.environment.sensors = this.environment.getOffset()
       

        this.environment.getMaxNumActions  = () => {
            return 8;
        }

        this.main = main;

        this.environment.getNumStates = () => {
            return this.main.car.sensor.rayCount;
        }
        let spec = { alpha: 0.01 }

        this.agent = new RL.DQNAgent(this.environment, spec);
        
    }
    keyPress(pred){
        var key;
        var event;
        switch(parseInt(pred)){
            case 0:
                key = "ArrowUp";
                break;
            case 1:
                key = "ArrowDown";
                break;
            case 2:
                key = "ArrowRight";
                break;
            case 3:
                key = "ArrowLeft";
                break;
            case 4:
                key = "ArrowUp";
                break;
            case 5:
                key = "ArrowDown";
                break;
            case 6:
                key = "ArrowRight";
                break;
            case 7:
                key = "ArrowLeft";
                break;
            default:
                key = "Enter";
        }
        if (parseInt(pred) < 4){
            event = new KeyboardEvent('keydown', {
                key: key, // Specify the key you want to trigger
            });
        }
        else{
            event = new KeyboardEvent('keyup', {
                key: key, // Specify the key you want to trigger
            });
        }
        document.dispatchEvent(event);
    }

    calculateReward(){
        console.log("this.environment.getOffset() ", this.environment.getOffset())
        let sum_offsets = this.environment.getOffset().reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        let dist_from_goal = Math.abs(this.main.car.y)  - Math.abs(this.finishLine);
        let max_dist_from_goal = (Math.abs(this.finishLine) - 100);

        let normalized_dist_from_goal = dist_from_goal / max_dist_from_goal;

        return sum_offsets + normalized_dist_from_goal;

    }

    async trainAgentPerFrame() {
        const intervalId = setInterval(() => {
            console.log("Frame Captured");
        
            // Get the current state from the this.environment
            const state = this.environment.sensors;
            console.log(this.environment);
        
            // Choose an action using the this.agent's policy
            const action = this.agent.act(state);
            console.log(state)
        
            // Apply the action to the this.environment
            // Update the sensor data and get the new offset
            this.keyPress(action);
            this.environment.sensors = this.environment.getOffset(); // Update the sensor data based on the chosen action
            // const offset = this.environment.getOffset();
        
            // Calculate the reward based on the offset
            // const reward = 1 - Math.abs(offset - this.finishLine) / Math.abs(this.finishLine);
            const reward = this.calculateReward()
            this.rewards.push(reward);
            console.log("reward ", reward);
        
            // Get the new state from the this.environment
            const nextState = this.environment.sensors;
        
            // Let the this.agent learn from the transition
            this.agent.learn(reward, nextState);
        
            // End the step if the car crashes into an obstacle
            if (this.main.car.damaged) {
                console.log('Crashed into an obstacle!');
                clearInterval(intervalId);
            }
            else if (Math.abs(this.main.car.y) > Math.abs(this.finishLine)){
                console.log("Finished!");
                clearInterval(intervalId);

            }
      }, 900)
    }
      
    
    // Train the this.agent
    async trainAgent(){
        const startTime = Date.now();
        const endTime = startTime + 30000; // 30 seconds
         for (let iteration = 0; iteration < this.numIterations; iteration++) {
            
            for (let episode = 0; episode < this.numEpisodes; episode++) {
                // Reset the environment for a new episode
                this.environment.reset();
          
                await new Promise((resolve) => {
                  const executeAgent = async () => {
                    await this.trainAgentPerFrame();
          
                    // Check if 30 seconds have passed
                    if (Date.now() >= endTime) {
                      resolve(); // Resolve the promise to exit the loop
                    }
                  };
          
                  // Run trainAgentPerFrame immediately
                  executeAgent();
          
                  // Execute trainAgentPerFrame every 900 milliseconds until 30 seconds have passed
                  const intervalId = setInterval(async () => {
                    executeAgent();
          
                    // End the interval if 30 seconds have passed
                    if (Date.now() >= endTime) {
                      clearInterval(intervalId); // Stop the setInterval function
                      resolve(); // Resolve the promise to exit the loop
                    }
                  }, 900);
                });
              }

        // Log the progress
        console.log(`Iteration ${iteration + 1}/${this.numIterations} completed.`);
        }
        console.log(this.rewards);
        const model = this.agent.toJSON();
        const jsonString = JSON.stringify(model);
        this.downloadModel(jsonString, 'model.json');
    }   

    

    downloadModel(jsonString, filename) {
        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(jsonString));
        element.setAttribute('download', filename);
    
        element.style.display = 'none';
        document.body.appendChild(element);
    
        element.click();
    
        document.body.removeChild(element);
    }
    
    // Save the jsonString to a file
    
    

    // Test the trained this.agent
    testAgent(){
        for (let episode = 0; episode < this.numEpisodes; episode++) {
        // Reset the this.environment for a new episode
            this.environment.reset();

            for (let timeStep = 0; timeStep < this.maxTimeSteps; timeStep++) {
                // Get the current state from the this.environment
                const state = this.environment.sensors;

                // Choose an action using the this.agent's policy
                const action = this.agent.act(state);

                // Apply the action to the this.environment
                // Update the sensor data and get the new offset
                this.keyPress(action)
                this.environment.sensors = this.environment.getOffset(); // Update the sensor data based on the chosen action
                const offset = this.environment.getOffset();

                // End the episode if the car crashes into an obstacle
                if (this.main.car.damaged) {
                    console.log('Crashed into an obstacle!');
                    break;
                }
            }
        }
    }
}