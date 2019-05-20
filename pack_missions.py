import os
import json
import shutil

SOURCE_DIR = 'src/assets/missions'
MISSION_DIR = 'missions'
DEST_DIR = 'dist' + '/' + MISSION_DIR
OUT_FILE = 'src/assets/missions.json'

MISSION_EXTENSION = 'bin'


def pack_missions():
    print("Packing missions:")

    shutil.rmtree(DEST_DIR, True)
    shutil.copytree(SOURCE_DIR, DEST_DIR)

    categoryList = []

    for dirName in os.listdir(DEST_DIR):
        if not os.path.isdir(os.path.join(DEST_DIR, dirName)):
            continue

        fileList = []
        category = {'label': dirName}

        for fileName in os.listdir(os.path.join(DEST_DIR, dirName)):
            if not fileName.endswith(MISSION_EXTENSION):
                continue


            mission = {"title": fileName.split('.')[0],
                "file": os.path.join(MISSION_DIR, dirName, fileName)}

            fileList.append(mission);
            print('- \'' + os.path.join(MISSION_DIR, dirName, fileName) + '\'')

        category['missions'] = fileList

        categoryList.append(category)

    missions = {'categories': categoryList}

    with open(OUT_FILE, 'w') as file:
        file.write(json.dumps(missions, indent=None, separators=(",", ":")))
