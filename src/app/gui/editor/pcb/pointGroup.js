/**
 * A group of points.
 * @param {Myr.Vector} first The first point in this group.
 * @constructor
 */
export function PointGroup(first) {
    this.locked = false;
    this.points = [first];
    this.left = first.x - 1;
    this.top = first.y - 1;
    this.right = first.x + 1;
    this.bottom = first.y + 1;

    /**
     * Check whether a point is in this group.
     * @param {Myr.Vector} point The point to look for.
     * @returns {Boolean} A boolean indicating whether the given point exists in this group.
     */
    this.contains = point => {
        if (point.x < this.left || point.y < this.top || point.x > this.right || point.y > this.bottom)
            return false;

        for (let i = this.points.length; i-- > 0;) {
            const comparePoint = this.points[i];

            if (
                (comparePoint.x === point.x && comparePoint.y === point.y - 1) ||
                (comparePoint.y === point.y && comparePoint.x === point.x - 1))
                return true;
        }

        return false;
    };

    /**
     * Add a point to the group.
     * @param {Myr.Vector} point A point to add to this group.
     */
    this.push = point => {
        if (point.x === this.left)
            this.left = point.x - 1;
        else if (point.x === this.right)
            this.right = point.x + 1;

        if (point.y === this.top)
            this.top = point.y - 1;
        else if (point.y === this.bottom)
            this.bottom = point.y + 1;

        this.points.push(point);
    };

    /**
     * Concatenate this group with another one.
     * @param {PointGroup} group Another group.
     */
    this.concat = group => {
        this.left = Math.min(this.left, group.left);
        this.top = Math.min(this.top, group.top);
        this.right = Math.max(this.right, group.right);
        this.bottom = Math.max(this.bottom, group.bottom);

        this.points = this.points.concat(group.points);
    };
}