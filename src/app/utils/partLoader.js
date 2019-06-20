import JSZip from "jszip";

export function PartLoader(mods, language, onLoad) {
    const zip = new JSZip();
    let counter = 0;

    this.objects = [];
    this.language = {};
    this.parts = {};

    for (const modPath of mods) {
        fetch(modPath)
            .then(response => response.arrayBuffer())
            .then(buffer => zip.loadAsync(buffer))
            .then(zip => zip.folder("parts")
                .forEach((path, file) => {
                    if (path.endsWith(".js")) {
                        counter++;
                        file.async("string").then(text => {
                            try {
                                this.objects.push(new Function('"use strict"; return(' + text + ')')());
                            } catch (e) {
                                console.log(e);
                                console.log("Unable to import following code:");
                                console.log(text);
                            }
                            counter--;
                            if (counter === 0)
                                onLoad();
                        });
                    } else if (path.endsWith(language)) {
                        counter++;
                        file.async("string").then(text => {
                            const json = JSON.parse(text);
                            for (const key of json.keys()) { // (const key in json) ??
                                if (!this.language.hasOwnProperty(key)) {
                                    this.language[key] = json[key];
                                } else {
                                    console.log("Duplicate language entry: " + key + ", " + json[key]);
                                }
                            }
                            counter--;
                            if (counter === 0)
                                onLoad();
                        });
                    } else if (path.endsWith("definition.json")) {
                        counter++;
                        file.async("string").then(text => {
                            const json = JSON.parse(text);
                            for (const key of this.parts.categories)
                            counter--;
                            if (counter === 0)
                                onLoad();
                        });
                    }
                })
            );

    }
}