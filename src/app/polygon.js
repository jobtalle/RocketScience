/**
 * Convex Polygon.
 * If the given set of points does not define a convex polygon,
 * an exception is thrown.
 * @param {Myr.Vector[]} points The points of the polygon.
 * @constructor
 */
function Polygon(points) {
    const isConvex = points => {
        function getDirection(from, to) {
            return Math.atan2(from.y - to.y, from.x - to.x);
        }

        if (points.length < 3)
            return false;

        let oldPoint = points[points.length - 2];
        let newPoint = points[points.length - 1];
        let newDirection = getDirection(newPoint, oldPoint);
        let orientation = 0;
        let sumAngles = 0;
        for (let index = 0; index < points.length; index++) {
            oldPoint = newPoint;
            newPoint = points[index];

            if (oldPoint.equals(newPoint))
                return false;

            let oldDirection = newDirection;
            newDirection = getDirection(newPoint, oldPoint);

            let angle = newDirection - oldDirection;
            if (angle <= -Math.PI)
                angle += 2 * Math.PI;
            if (angle > Math.PI)
                angle -= 2 * Math.PI;

            if (index === 0) {
                if (angle === 0)
                    return false;
                else if (angle > 0)
                    orientation = 1;
                else
                    orientation = -1;
            } else if (orientation * angle <= 0)
                return false;

            sumAngles += angle;
        }

        return Math.abs(Math.round(sumAngles / (2 * Math.PI))) === 1;
    };

    if (!isConvex(points))
        throw Polygon.NOT_CONVEX;
}

Polygon.NOT_CONVEX = 'This polygon is not convex.';

export default Polygon;