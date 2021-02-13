import { tensor, mul } from '@tensorflow/tfjs';

const areaOfTriangle = tf.tidy((base, height) => {
    const baseTensor = tensor([base]);
    const heightTensor = tensor([height]);

    return mul(baseTensor, heightTensor).div(tensor([2]));
});

const pythagoreanTheorem = tf.tidy((a, b) => {
    const aTensor = tensor([a]);
    const bTensor = tensor([b]);

    return aTensor.square().add(bTensor.square()).sqrt();
});

areaOfTriangle(12, 20).print()
pythagoreanTheorem(3, 4).print();
