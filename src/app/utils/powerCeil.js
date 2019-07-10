/**
 * Rounds up the number to the nearest power of 2.
 * @param {Number} val
 * @returns {Number} a power of 2.
 */
export function powerCeil(val) {
    if (val <= 1)
        return 1;

    let power = 2;
    val--;

    while (val >>= 1)
        power <<= 1;

    return power;
}