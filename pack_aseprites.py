from os import walk
from subprocess import call

class PackAseprites():
    EXTENSION = ".aseprite"
    NAMING_FORMAT = "{title}_{frame}"
    
    @staticmethod
    def make_command(path, output_json, output_image):
        return (
            "aseprite -b " + path +
            " --data " + output_json +
            " --sheet-pack --sheet " + output_image +
            " --filename-format " + PackAseprites.NAMING_FORMAT)
    
    @staticmethod
    def contains_sources(files):
        for file in files:
            if file.endswith(PackAseprites.EXTENSION):
                return True
        
        return False
    
    def __init__(self, directory):
        self._directory = directory
    
    def pack(self, output_json, output_image):
        print("Packing sprites into '" + output_json + "' and '" + output_image + "' from:")
        
        directories = ""
        
        for (dir_path, dir_names, file_names) in walk(self._directory):
            if file_names:
                if not PackAseprites.contains_sources(file_names):
                    continue
                
                if len(directories) > 1:
                    directories += " "
                
                directories += dir_path + "/*" + PackAseprites.EXTENSION
                
                print("- '" + dir_path + "'")
        
        call(PackAseprites.make_command(directories, output_json, output_image), shell=True)
