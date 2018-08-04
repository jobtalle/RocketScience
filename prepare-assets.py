#!/usr/bin/env python3
from os import walk
from subprocess import call
from distutils.dir_util import copy_tree

def pack_sprites(path):
    EXTENSION = ".aseprite"
    ATLAS_DATA_PATH  = "src/assets/atlas.json"
    ATLAS_IMAGE_PATH = "dist/atlas.png"     
    NAMING_FORMAT    = "{title}_{frame}"

    command = ("aseprite -b %s" +
               " --data " + ATLAS_DATA_PATH +
               " --sheet-pack --sheet " + ATLAS_IMAGE_PATH +
               " --filename-format " + NAMING_FORMAT)

    print("Packing sprites into '" + ATLAS_DATA_PATH + "' and '" + ATLAS_IMAGE_PATH + "'...")
	
    files = ""
    
    for (dir_path, dir_names, file_names) in walk(path):
        if (file_names):
            if (len(files) > 1):
                files += " "
            
            files += dir_path + "/*" + EXTENSION
            print("- '" + dir_path + "'")
    
    call(command % files, shell=True)

def copy(from_path, to_path):
    print("- '" + from_path + "' into '" + to_path + "'")
    copy_tree(from_path, to_path)

def copy_assets():
    print("Copying assets...")
    copy("src/assets/icons", "dist/icons")

pack_sprites("src/assets/sprites")
copy_assets()
