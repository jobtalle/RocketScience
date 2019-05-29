// TODO: this may cause leaks if the URL is not revoked
export const DownloadBinary = (blob, fileName) => {
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, fileName);
    } else {
        const link = document.createElement("a");

        if (link.download !== undefined) {
            let url = URL.createObjectURL(blob);

            link.setAttribute("href", url);
            link.setAttribute("download", fileName);
            link.style.visibility = "hidden";

            document.body.appendChild(link);

            link.click();
        }
    }
};