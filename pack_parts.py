import os
import json

PARTS_DIR = 'src/assets/parts'
OUT_FILE = 'src/assets/parts.json'
ORDER_FILE = 'src/assets/parts/order.json'
CATEGORIES_ARRAY = "categories"

def merge_two_dicts(copyDict, updateDict):
    mergeDict = copyDict.copy()
    mergeDict.update(updateDict)

    return mergeDict

def get_category_names():
    file = open(ORDER_FILE, 'r')
    data = json.loads(file.read())
    file.close()

    return data["categoryOrder"]

def get_category_parts(name):
    PART_EXTENSION = 'json'

    categoryParts = []
    categoryPartsDir = os.path.join(PARTS_DIR, name)

    for fileName in os.listdir(categoryPartsDir):
        if not fileName.endswith(PART_EXTENSION):
            continue

        filePath = os.path.join(categoryPartsDir, fileName)
        print("- '" + filePath + "'")
        with open(filePath) as file:
            partData = json.loads(file.read())
            file.close()
            categoryParts.append(partData)

    return categoryParts

def make_category(name):
    PREFIX = 'CATEGORY_'
    LABEL_KEY = 'label'
    PARTS_KEY = 'parts'

    category = {}
    category[LABEL_KEY] = PREFIX + name.upper()
    category[PARTS_KEY] = get_category_parts(name)

    return category

def merge_parts():
    array = []
    for categoryName in get_category_names():
        array.append(make_category(categoryName))

    return {CATEGORIES_ARRAY: array}

def pack_parts():
    print("Packing parts into '" + OUT_FILE + "' from:")

    parts = merge_parts()
    with open(OUT_FILE, 'w') as file:
        file.write(json.dumps(parts, indent=None, separators=(",", ":")))
