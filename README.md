# Rocket Science :rocket:
A game where you engineer your way through problems and challenges.

The game is written in **ES6**, **HTML5** and **CSS3**. Real time graphics are rendered using [Myr.js](https://github.com/jobtalle/myr.js).

## Dependencies
The following dependencies are required for building rocket science:

* [Node.js](https://www.nodejs.org)
* [Python 3](https://www.python.org) for build automation
* [Aseprite](https://github.com/aseprite/aseprite) for editing and building sprite atlases 
(please make sure that Aseprite is included in your system path, as the build tools expect it to be available)

The build process only uses the command line interface of Aseprite.

## Building
Building should be possible in both Linux and Windows environments, provided the aforementioned dependencies are installed.
First, run ``npm install`` in the repository root.
This command will install all required NPM packages.

To build the assets, run ``prepare_assets.py``. This must be done before the game is built.
Atlas files for both the GUI and in-game sprites will be generated, in addition to the part data file.

To compile the program, execute ``npm run pack-dev``
(or ``pack-prod`` for production builds) from the root of the repository.
The resulting files will be written to ``dist``.

## Compatibility
The game is built to be compatible with _at least_ Firefox and Chrome.
Compatibility issues with these browsers are bugs.
Accidental compatibility with another browser is considered a happy accident.

## Authors
Job Talle,
Luc van den Brand.
