/**
 * Convex Polygon.
 * If the given set of points does not define a convex polygon,
 * an exception is thrown.
 * @param {Myr.Vector[]} points The points of the polygon.
 * @constructor
 */
function Polygon(points) {
    const getDirection = (from, to) => {
        return Math.atan2(from.y - to.y, from.x - to.x);
    };

    const getAngle = (fromDirection, toDirection) => {
        let angle = fromDirection - toDirection;
        while (angle > Math.PI)
            angle -= 2 * Math.PI;
        while (angle < -Math.PI)
            angle += 2 * Math.PI;
        return angle;
    };

    const isConvex = points => {
        if (points.length < 3)
            return false;

        let oldPoint = points[points.length - 2];
        let curPoint = points[points.length - 1];
        let curDirection = getDirection(curPoint, oldPoint);
        let orientation = 0;
        let sumAngles = 0;
        for (let index = 0; index < points.length; index++) {
            oldPoint = curPoint;
            curPoint = points[index];

            if (oldPoint.equals(curPoint))
                return false;

            let oldDirection = curDirection;
            curDirection = getDirection(curPoint, oldPoint);

            let angle = getAngle(curDirection, oldDirection);

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

    this.containsPoint = testPoint => {
        let curPoint = points[points.length - 1];
        let curDirection = getDirection(curPoint, testPoint);
        let sumAngles = 0;
        for (let index = 0; index < points.length; index++) {
            let oldDirection = curDirection;
            curPoint = points[index];
            curDirection = getDirection(curPoint, testPoint);
            sumAngles += getAngle(curDirection, oldDirection);
        }

        return Math.abs(Math.round(sumAngles)) >= Math.PI;
    };
    
    if (!isConvex(points))
        throw Polygon.NOT_CONVEX;
}

Polygon.NOT_CONVEX = 'This polygon is not convex.';

export default Polygon;