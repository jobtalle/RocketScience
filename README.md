# Rocket Science :rocket:
A game where you connect parts to build large contraptions.

The game is written in **ES6**, **HTML5** and **CSS3**. Most graphics are rendered using [Myr.js](https://github.com/jobtalle/myr.js).

## Dependencies
The following dependencies are required for building rocket science:

* Node.js
* Python for build automation
* Aseprite for editing and building sprite atlases
* Several libraries which are installed and managed by NPM

The build process only uses the command line interface of Aseprite.

## Building
Before you do anything, run ``npm install`` in the repository root. 
This command will install all required dependencies managed by NPM.

To package all sprites, execute ``npm run pack-sprites``.
The resulting sprite atlas and its map will be stored in ``dist``.

To generate a packaged file, execute ``npm run pack-dev`` 
(or ``pack-prod`` for production builds) from the root of the repository. 
The file will be stored in ``dist``.

## Authors
Job Talle,
Luc van den Brand.
