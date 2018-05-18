/**
 * Sends output to an InputSocket.
 * @constructor
 */
export default function OutputSocket() {
    let _connectedInput;

    /**
     * Connect an InputSocket to this Output.
     * @param {Object} inputSocket Socket to receive output.
     */
    this.connect = inputSocket => {
        _connectedInput = inputSocket;
    };

    /**
     * Set a signal value to be send.
     * If no input is connected, nothing is done.
     * @param {Number} value The send value.
     */
    this.send = value => {
        if (_connectedInput != null)
            _connectedInput.receive(value);
    };
};