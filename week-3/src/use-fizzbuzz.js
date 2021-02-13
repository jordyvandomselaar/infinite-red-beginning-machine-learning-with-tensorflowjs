import * as tf from "@tensorflow/tfjs"
import { numberToBinaryTensor } from "./helpers";

const tbody = document.getElementById("tbody");

tf.tidy(() => {
    tf.loadLayersModel("../models/fizzbuzz/fizzbuzz-model.json").then(model => {
        for (let i = 1; i <= 1000; i++) {
            const input = numberToBinaryTensor(i);

            const result = model.predict(tf.stack([input])).dataSync();
            const winner = [i + 1, 'fizz', 'buzz', 'fizzbuzz'][result.indexOf(Math.max(...result))];


            const row = document.createElement("tr");
            const numberTd = document.createElement("td");
            const winnerTd = document.createElement("td");

            numberTd.appendChild(
                document.createTextNode(i)
            )

            winnerTd.appendChild(
                document.createTextNode(winner)
            )


            row.appendChild(numberTd);
            row.appendChild(winnerTd);

            setTimeout(() => { // You need the timeout to render on every iteration, else it just waits 'till the end and then renders.
                tbody.appendChild(row)

                document.querySelector('html').scrollBy({
                    top: 50
                })
            }, 0);
        }
    });
});
