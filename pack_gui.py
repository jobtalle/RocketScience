import json
import os
from pack_aseprites import PackAseprites

def make_class(name, contents):
    return name + "{" + contents + "}"

def make_class_region(name, x, y, width, height):
    return make_class(".sprite." + name,
        "background-position:" + x + "px " + y + "px;" +
        "width:" + width + "px;" +
        "height:" + height + "px;")

def make_class_single(name, frame, scale):
    return make_class_region(name,
        str(-frame["frame"]["x"] * scale),
        str(-frame["frame"]["y"] * scale),
        str(frame["frame"]["w"] * scale),
        str(frame["frame"]["h"] * scale))

def make_class_multiple(name, frames):
    pass

def pack_gui():
    atlas_file = "atlas-gui.json"
    css_file = "src\\styles\\gui.css"
    source = "gui.png"
    scale = 2
    
    packer = PackAseprites("src\\assets\\gui");
    packer.pack(atlas_file, "dist\\" + source)
    
    atlas = open(atlas_file)
    data = json.load(atlas)

    width = data["meta"]["size"]["w"]
    height = data["meta"]["size"]["h"]
    
    css = open(css_file, "w")
    css.write(make_class(".sprite",
        "background:url(" + source + ");" +
        "background-size:" + str(width * scale) + "px " + str(height * scale) + "px;" +
        "image-rendering:pixelated;"))
    
    for frame in data["frames"]:
        name = frame.partition("_")[0]

        if frame.endswith("_"):
            css.write(make_class_single(name, data["frames"][frame], scale))
               
    atlas.close()
    css.close()
    
    os.remove(atlas_file)
