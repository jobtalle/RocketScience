import os
import json

PARTS_DIR = 'src\\assets\\parts'
OUT_FILE = 'src\\assets\\parts.json'

def merge_two_dicts(copyDict, updateDict):
    mergeDict = copyDict.copy() 
    mergeDict.update(updateDict)
    return mergeDict

def get_category_names():
    categories = next(os.walk(PARTS_DIR))[1]
    return categories

def get_category_parts(name):
    PART_EXTENSION = 'json'

    categoryParts = {}
    categoryPartsDir = os.path.join(PARTS_DIR, name)
    for fileName in os.listdir(categoryPartsDir):
        if not fileName.endswith(PART_EXTENSION):
            continue
        
        filePath = os.path.join(categoryPartsDir, fileName)
        print("- '" + filePath + "'")
        with open(filePath, encoding='utf-8') as file:
            partData = json.loads(file.read())
            categoryParts = merge_two_dicts(categoryParts, partData)
    return categoryParts

def make_catagory(name):
    PREFIX = 'CATEGORY_'
    LABEL_KEY = 'label'
    PARTS_KEY = 'parts'
    
    category = {}
    category[LABEL_KEY] = PREFIX + name.upper()
    category[PARTS_KEY] = get_category_parts(name)
    
    return category

def merge_parts():
    parts = {}
    for catagoryName in get_category_names():
        parts[catagoryName] = make_catagory(catagoryName)
    return parts

def pack_parts():
    print("Packing parts into '" + OUT_FILE + "' from:")

    parts = merge_parts()
    with open(OUT_FILE, 'w') as file:
        file.write(json.dumps(parts))
