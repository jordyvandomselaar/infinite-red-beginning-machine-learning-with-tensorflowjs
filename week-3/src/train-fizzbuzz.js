import * as tf from "@tensorflow/tfjs"
import { fizzBuzzEncoder, numberToBinaryTensor } from "./helpers";

const tbody = document.getElementById("tbody");

const [stackedX, stackedY] = tf.tidy(() => {
  let xs = [];
  let ys = [];

  for (let i = 1; i < 1000; i++) {
    xs.push(numberToBinaryTensor(i));
    ys.push(fizzBuzzEncoder(i));
  }

  return [tf.stack(xs), tf.stack(ys)];
})

const model = tf.sequential();

model.add(
  tf.layers.dense({
    inputShape: 10,
    units: 64,
    activation: 'relu'
  })
);

model.add(
  tf.layers.dense({
    units: 8,
    activation: 'relu'
  })
);

model.add(
  tf.layers.dense({
    units: 4,
    activation: 'softmax'
  })
);

const learningRate = 0.005;

model.compile({
  optimizer: tf.train.adam(learningRate),
  loss: 'categoricalCrossentropy',
  metrics: ['accuracy']
});

model.fit(stackedX, stackedY, {
  epochs: 100,
  shuffle: true,
  batchSize: 32,
  callbacks: {
    onEpochEnd: (epoch, log) => {
      tbody.innerHTML = `
     ${tbody.innerHTML}
     <tr>
        <td>${epoch}</td>
        <td>${log.loss * 100}</td>
        <td>${log.acc * 100}</td>
     </tr>
`;
      document.querySelector('html').scrollBy({
        top: 50
      })
    },
  }
}).then(history => {
  model.save("downloads://fizzbuzz-model");

  model.dispose();
  stackedX.dispose();
  stackedY.dispose();
})
