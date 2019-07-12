/**
 * A smooth terrain fill.
 * @param {Myr.Color} border A border color.
 * @param {Array} entries An array of Entry objects, in threshold ascending order.
 * @constructor
 */
export function FillSmooth(border, entries) {

}

FillSmooth.Entry = function(color, threshold) {
    this.color = color;
    this.threshold = threshold;
};