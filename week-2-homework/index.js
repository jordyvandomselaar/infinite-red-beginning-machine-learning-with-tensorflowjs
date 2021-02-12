const tf = require('@tensorflow/tfjs');

const areaOfTriangle = (base, height) => {
    const baseTensor = tf.tensor([base]);
    const heightTensor = tf.tensor([height]);

    return tf.mul(baseTensor, heightTensor).div(tf.tensor([2]));
}

const pythagoreanTheorem = (a, b) => {
    const aTensor = tf.tensor([a]);
    const bTensor = tf.tensor([b]);

    return aTensor.square().add(bTensor.square()).sqrt();
}

areaOfTriangle(12, 20).print()
pythagoreanTheorem(3, 4).print();
