#!/usr/bin/python

DIR_LANG = "src/assets/text/"
DIR_DIST = "dist/"

import json

from os import walk
from shutil import copyfile
from pack_gui import pack_gui
from pack_sprites import pack_sprites
from pack_parts import pack_parts

def copy_langfiles():
    print("Copying language files:")

    for (dir_path, dir_names, file_names) in walk(DIR_LANG):
        for file in file_names:
            print("- '" + file + "'")

            json_src_file = open(dir_path + file)

            json_dest_file = open(DIR_DIST + file, "w")
            json_dest_file.write(json.dumps(json.load(json_src_file), indent=None, separators=(",", ":")))
            json_dest_file.close()

            json_src_file.close()

pack_sprites()
pack_gui()
pack_parts()
copy_langfiles()