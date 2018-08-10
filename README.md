# Rocket Science :rocket:
A game where you connect parts to build large contraptions to solve problems.

The game is written in **ES6**, **HTML5** and **CSS3**. Most graphics are rendered using [Myr.js](https://github.com/jobtalle/myr.js).

## Dependencies
The following dependencies are required for building rocket science:

* [Node.js](https://www.nodejs.org)
* [Python](https://www.python.org) for build automation
* [Aseprite](https://github.com/aseprite/aseprite) for editing and building sprite atlases
* Several libraries which are installed and managed by NPM

The build process only uses the command line interface of Aseprite.

## Building
Before you do anything, run ``npm install`` in the repository root. 
This command will install all required dependencies managed by NPM.

To package all sprites, execute ``npm run pack-sprites``. A sprite atlas must be built before the game is packaged.
The resulting sprite atlas will be stored in ``dist`` where it is used by the game.

To generate a packaged file, execute ``npm run pack-dev``
(or ``pack-prod`` for production builds) from the root of the repository.
The file will be stored in ``dist``.

## Authors
Job Talle,
Luc van den Brand.
