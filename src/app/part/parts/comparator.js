export function Comparator(pins) {
    this.initialize = () => {

    };

    this.tick = state => {
        if (state[pins[Comparator.PIN_INDEX_POWER]] === 1) {
            if (state[pins[Comparator.PIN_INDEX_INPUT_2]] > state[pins[Comparator.PIN_INDEX_INPUT_1]])
                state[pins[Comparator.PIN_INDEX_OUTPUT]] = 1;
            else
                state[pins[Comparator.PIN_INDEX_OUTPUT]] = 0;
        }
        else
            state[pins[Comparator.PIN_INDEX_OUTPUT]] = 0;
    };
}

Comparator.PIN_INDEX_POWER = 0;
Comparator.PIN_INDEX_OUTPUT = 1;
Comparator.PIN_INDEX_INPUT_1 = 2;
Comparator.PIN_INDEX_INPUT_2 = 3;