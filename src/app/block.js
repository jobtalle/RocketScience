/**
 * An entity with one or more inputs or outputs.
 * @constructor
 */
export default function Block() {
    const _inputs = [];
    const _outputs = [];

    /**
     * Add an input to this block.
     * @param {Object} inputSocket The input.
     */
    this.addInput = inputSocket => {
        _inputs.push(inputSocket);
    };

    /**
     * Add an output to this block.
     * @param  {Object} outputSocket The output.
     */
    this.addOutput = outputSocket => {
        _outputs.push(outputSocket);
    };
};