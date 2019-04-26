# Adding and creating parts
This document explains how a part can be added to `RocketScience`.
To add and create a new part, one must create two sprites, one json file and one javascript file. Furthermore, the language file(s) must be edited.

## Part Types
There are four part types, in which parts are categorized. The types are listed below:
- Input
- Output
- Logic
- Power

## Sprites
Two sprites have to be created:
- The first sprite is the part icon, which appears in the part-picker window on the left. This sprite's dimensions are 32x32 px. The location is `src/assets/gui/parts`.
- The second is the sprite for the in-game part. The dimensions of the in-game sprite can be calculated: take the width and height of the part on the PCB, and multiply both by 6 (as one PCB point is 6x6 px). The location is `arc/assets/sprites/parts`.

## Json
The json file is the configuration of the part. The files are located in `src/assets/parts/<PARTTYPE>`.

It holds the following information:
- label (key in the language files, which holds the label name)
- description (key in the language files, which hold the description)
- icon (name of the icon file without extension)
- object (object name in javascript)
- configurations (one or more different configuration(s) for the part)

A configuration holds the following information:
- footprint
    - points
    - air
- io
- sprites
    - internal
    - external


## Javascript
- add js file to src/app/part/parts
- add object to src/app/part/objects.js