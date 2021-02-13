import * as tf from "@tensorflow/tfjs"

export const fizzBuzzEncoder = number => {
    if (number % 15 === 0) {
        return tf.oneHot(3, 4);
    }

    if (number % 5 === 0) {
        return tf.oneHot(2, 4);
    }

    if (number % 3 === 0) {
        return tf.oneHot(1, 4)
    }

    return tf.oneHot(0, 4);
}

export const numberToBinaryTensor = number => tf.tensor(
    number.toString(2)
        .padStart(10, "0")
        .split("")
        .map(Number)
);
