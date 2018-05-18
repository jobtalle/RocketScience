/**
 * Receives input from an OutputSocket.
 * @constructor
 */
export default function InputSocket() {
    let _currentState = 0;

    /**
     * Set a signal value to be received.
     * @param {Number} value The received value.
     */
    this.receive = value => {
        _currentState = value;
    };
};