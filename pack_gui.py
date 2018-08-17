import json
import os
from pack_aseprites import PackAseprites

def make_class_single(name, frame, source):
    result = ".sprite-" + name + "{"
    
    result += "background:url(" + source + ");"
    result += "background-position:"
    result += "-" + str(frame["frame"]["x"]) + "px "
    result += "-" + str(frame["frame"]["y"]) + "px;"
    result += "width:" + str(frame["frame"]["w"]) + "px;"
    result += "height:" + str(frame["frame"]["h"]) + "px;"
    
    return result + "}"

def make_class_multiple(name, frames):
    pass

def pack_gui():
    atlas_file = "atlas-gui.json"
    css_file = "src\\styles\\gui.css"
    source = "gui.png"
    
    packer = PackAseprites("src\\assets\\gui");
    packer.pack(atlas_file, "dist\\" + source)
    
    css = open(css_file, "w")
    
    atlas = open(atlas_file)
    data = json.load(atlas)

    for frame in data["frames"]:
        name = frame.partition("_")[0]

        if frame.endswith("_"):
            css.write(make_class_single(name, data["frames"][frame], source))
               
    atlas.close()
    css.close()
    
    os.remove(atlas_file)
