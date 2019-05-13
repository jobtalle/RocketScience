/**
 * A requestBinary utility. Use this to request loading remote files.
 * @param {String} source A path to a file to load.
 * @param {Function} onLoad A function to execute when the file has been loaded. Its parameter is the loaded string.
 * @param {Function} onError A function te execute when loading failed.
 */
export const requestBinary = (source, onLoad, onError) => {
    const file = new XMLHttpRequest();
    file.responseType = "blob";

    file.overrideMimeType("application/octet-stream");
    file.open("GET", source, true);
    file.onreadystatechange = () => {
        if (file.readyState === 4) {
            if (file.status == "200")
                onLoad(file.response);
            else
                onError();
        }
    };

    file.send(null);
};