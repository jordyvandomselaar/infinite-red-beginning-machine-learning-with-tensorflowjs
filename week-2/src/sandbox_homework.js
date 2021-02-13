import * as DogsNCats from "dogs-n-cats";
import * as tf from "@tensorflow/tfjs"

DogsNCats.load().then(dnc => {
    const [dogTensors] = dnc.dogs.get(15);
    document.getElementById("app").innerHTML = `
  <h1>${tf.version.tfjs}</h1>
  <canvas id="printCanvas" />
`;

    const printCanvas = document.getElementById("printCanvas");
    tf.browser.toPixels(tf.concat(dogTensors.unstack(), 1), printCanvas);

    dogTensors.dispose();
});
