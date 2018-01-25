# GameMakerDiscord Home Page
This repo contains the organization home page. The site is a clean single-page repository listing for all repositories in the organization.

## Installation
```
$ git clone https://github.com/GameMakerDiscord/GameMakerDiscord.github.io.git
$ cd GameMakerDiscord.github.io
$ npm install
```

## Development
This project uses [parcel](https://github.com/parcel-bundler/parcel) for the build process, which is fairly automated. A shortcut for running development and builds are provided as `npm start` and `npm run build` respectively.

The source of the website can be found entirely under the `src` folder. The web assets found in the root of the directory should **not** be modified, as they are put there during the build process by parcel.

## API Usage
Organization info is fetched from a custom API that relays organization info from the GitHub API. The server is based on [this](https://github.com/christopherwk210/gh-organization-indexer) project.

## License
MIT

Written by Chris "Topherlicious" Anselmo
