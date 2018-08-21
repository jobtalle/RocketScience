import json
import os
from pack_aseprites import PackAseprites

def make_class(name, contents):
    return name + "{" + contents + "}"

def make_class_region(name, x, y, width=None, height=None):
    members = "background-position:" + x + "px " + y + "px;";
    
    if width is not None:
        members += "width:" + width + "px;" + "height:" + height + "px;";
    
    return make_class(".sprite." + name, members)

def make_class_single(name, frame, scale, include_size=True):
    if include_size:
        return make_class_region(name,
            str(-frame["frame"]["x"] * scale),
            str(-frame["frame"]["y"] * scale),
            str(frame["frame"]["w"] * scale),
            str(frame["frame"]["h"] * scale))
    else:
        return make_class_region(name,
            str(-frame["frame"]["x"] * scale),
            str(-frame["frame"]["y"] * scale))

def make_class_multiple(name, frames, scale):
    frame_neutral = name + "_0"
    frame_hover = name + "_1"
    frame_press = name + "_2"
    
    result = make_class_single(name, frames[frame_neutral], scale)
    
    if frame_hover in frames:
        result += make_class_single(name + ":hover", frames[frame_hover], scale, False)
        
        if frame_press in frames:
            result += make_class_single(name + ":active", frames[frame_press], scale, False)
    
    return result

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
        else:
            css.write(make_class_multiple(name, data["frames"], scale))
               
    atlas.close()
    css.close()
    
    os.remove(atlas_file)
