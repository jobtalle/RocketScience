import os
import shutil

def pack_mods():
    output_path = "dist/mods/"

    print("Zipping mods:")

    if not os.path.isdir(output_path):
        os.makedirs(output_path)

    for dir in os.listdir("mods"):
        dir_path = os.path.join("mods", dir)
        if os.path.isdir(dir_path):
            shutil.make_archive(os.path.join(output_path, dir), 'zip', dir_path)
            print("-" + dir +".zip")

if __name__ == "__main__":
    pack_mods()