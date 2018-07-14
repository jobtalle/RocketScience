/**
 * A profile specifying zoom behavior.
 * @param {Number} type The zoom profile type.
 * @param {Number} factor The rate of change when zooming.
 * @param {Number} zoom The initial zoom value.
 * @param {Number} min The minimum zoom value.
 * @param {Number} max The maximum zoom value.
 * @constructor
 */
export function ZoomProfile(type, factor, zoom, min, max) {
    const limitZoom = () => {
        if (zoom > max)
            zoom = max;
        else if (zoom < min)
            zoom = min;
    };

    const applyZoom = delta => {
        if (type === ZoomProfile.TYPE_ROUND) {
            if (delta < 0)
                delta = Math.min(-1, Math.round(delta));
            else
                delta = Math.max(1, Math.round(delta));
        }

        zoom += delta;

        limitZoom();
    };

    /**
     * Zoom in.
     */
    this.zoomIn = () => applyZoom(zoom * (1 + factor) - zoom);

    /**
     * Zoom out.
     */
    this.zoomOut = () => applyZoom(zoom * (1 - factor) - zoom);

    /**
     * Get the zoom level.
     * @returns {Number} The zoom level.
     */
    this.getZoom = () => zoom;

    /**
     * Set the zoom level.
     * @param {Number} newZoom The new zoom level.
     */
    this.setZoom = newZoom => zoom = newZoom;

    if (type === ZoomProfile.TYPE_ROUND) {
        zoom = Math.round(zoom);
        min = Math.max(1, Math.round(min));
        max = Math.max(min, Math.round(max));
    }

    limitZoom();
}

ZoomProfile.TYPE_CONTINUOUS = 0;
ZoomProfile.TYPE_ROUND = 1;