# Rocket Science :rocket:
A game where you connect parts to build large contraptions to solve problems.

The game is written in **ES6**, **HTML5** and **CSS3**. Most graphics are rendered using [Myr.js](https://github.com/jobtalle/myr.js).

## Dependencies
The following dependencies are required for building rocket science:

* [Node.js](https://www.nodejs.org)
* [Python](https://www.python.org) for build automation
* [Aseprite](https://github.com/aseprite/aseprite) for editing and building sprite atlases 
(please make sure that Aseprite is included in your system path, as the build tools expect it to be available)
* Several libraries which are installed and managed by NPM

The build process only uses the command line interface of Aseprite.

## Building
Before you do anything, run ``npm install`` in the repository root. 
This command will install all required dependencies managed by NPM.

To prepare the assets, run ``prepare_assets.py``. This must be done before the game is built.
Atlas files for both the GUI and in-game sprites will be generated, in addition to the part data file.

To compile the program, execute ``npm run pack-dev``
(or ``pack-prod`` for production builds) from the root of the repository.
The resulting files will be stored in ``dist``.

## Compatibility
The game is built to be compatible with _at least_ Firefox and Chrome.
Compatibility issues with these browsers are bugs.
Accidental compatibility with another browser is considered a happy accident.

## Authors
Job Talle,
Luc van den Brand.
