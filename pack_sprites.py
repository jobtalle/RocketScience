from pack_aseprites import PackAseprites

def pack_sprites():
    packer = PackAseprites("src\\assets\\sprites");
    packer.pack("src\\assets\\sprites\\atlas.json", "dist\\sprites.png");
