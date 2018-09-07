/**
 * A contact listener triggers callbacks when physics objects collide.
 * @param {Function} [beginContact] A function to call when contact is made.
 * @param {Function} [endContact] A function to call when contact is lost.
 * @constructor
 */
export function ContactListener(beginContact, endContact) {
    this.beginContact = () => {
        if (beginContact)
            beginContact();
    };

    this.endContact = () => {
        if (endContact)
            endContact();
    };
}