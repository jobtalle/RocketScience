# Rocket Science :rocket:
A game where you connect blocks to build large contraptions.

The game is written in **ES6**, **HTML5** and **CSS3**. Most graphics are rendered using [Myr.js](https://github.com/jobtalle/myr.js).

## Building
Before you do anything, run ``npm install`` in the repository root. 
This command will install all required dependencies.

To package all sprites, execute ``npm run pack-sprites``.
The resulting spriteatlas and its map will be stored in ``dists``.

To generate a packaged file, execute ``npm run pack-dev`` 
(or ``pack-prod`` for production builds) from the root of the repository. 
The file will be stored in ``dist``.

## Documentation
Documentation can be generated using ``npm run doc``.

## Testing
Unit tests can be performed using ``npm run test``.

## Authors
Job Talle,
Luc van den Brand.
