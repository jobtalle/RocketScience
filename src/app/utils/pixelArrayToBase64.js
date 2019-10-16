/**
 * Convert a pixel array to a base64 encoded PNG.
 * @param {Uint8ClampedArray} array The pixel array.
 * @param {Number} width Width of the image.
 * @param {Number} height Height of the image.
 * @returns {String} Base64 encoded PNG.
 */
export function pixelArrayToBase64(array, width, height) {
    const imgData = new ImageData(array, width, height);
    const canvas = document.createElement('canvas');

    canvas.width = width;
    canvas.height = height;
    canvas.getContext('2d').putImageData(imgData, 0, 0);

    return canvas.toDataURL();
}