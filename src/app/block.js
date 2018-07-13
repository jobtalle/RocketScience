/**
 * An entity with one or more inputs or outputs.
 * @constructor
 */
export function Block() {
    const _inputs = [];
    const _outputs = [];

    /**
     * Add an input to this block.
     * @param {InputSocket} inputSocket The input.
     */
    this.addInput = inputSocket => {
        _inputs.push(inputSocket);
    };

    /**
     * Add an output to this block.
     * @param  {OutputSocket} outputSocket The output.
     */
    this.addOutput = outputSocket => {
        _outputs.push(outputSocket);
    };
};