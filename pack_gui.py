from pack_aseprites import PackAseprites

def pack_gui():
    packer = PackAseprites("src\\assets\\gui");
    packer.pack("src\\assets\\gui\\atlas.json", "dist\\gui.png")
