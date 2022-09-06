export default {
    rotate(vector, alpha) {
        const rotateMatrix = [Math.cos(alpha), 0 - Math.sin(alpha), Math.sin(alpha), Math.cos(alpha)]
        return [
            rotateMatrix[0] * vector[0] + rotateMatrix[1] * vector[1],
            rotateMatrix[2] * vector[0] + rotateMatrix[3] * vector[1],
        ]
    },
}