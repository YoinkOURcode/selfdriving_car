const tf = require('@tensorflow/tfjs');

class NeuralNetwork{
    constructor(num_of_inputs, num_of_controls){
        this.num_of_inputs = num_of_inputs;
        this.num_of_controls = num_of_controls;
        this.construct_model();
    }
    construct_model(){
        this.model = tf.sequential();
        this.model.add(tf.layers.dense({ units: num_of_inputs, activation: 'relu', inputShape: [num_of_inputs] }));
        this.model.add(tf.layers.dense({ units: num_of_inputs, activation: 'relu' }));
        this.model.add(tf.layers.dense({ units: num_of_controls, activation: 'softmax' }));
        this.model.compile({ optimizer: 'adam', loss: 'categoricalCrossentropy', metrics: ['accuracy'] });
    }
}