# Onko metro rikki?

Check if the metro in Helsinki area is broken at the moment

## What is this?

A really stupid prototype app that shows whether the metro in Helsinki is broken currently.

The information is based on the [Service Alerts API](https://digitransit.fi/en/developers/apis/4-realtime-api/service-alerts/).

Follow [@onkometrorikki](https://twitter.com/onkometrorikki) for notifications when there are disruptions in the metro.

## Try it

Head to [onkometrorikki.now.sh](https://onkometrorikki.now.sh/)

## Development

Install dependencies: `yarn`

Start the backend: `npm start`

Start the frontend: `npm run dev`

## Deployments

Backend is deployed in Heroku: `git push heroku master`

Deploy frontend to now.sh: `npm run release:now`

## Credits, Thanks, Inspiration

- Inspired by [fpapado/proto](https://github.com/fpapado/proto)
- This project is sponsored by [Futurice's](https://futurice.com/) [Open Source Sponsorship program](http://spiceprogram.org/oss-sponsorship)
- The elm app is heavily inspired by [elm-quicks](https://github.com/ohanhi/elm-quicks/) by [ohanhi](https://github.com/ohanhi/)
- The UI is built using Elm, and it is based on [create-elm-app](https://github.com/halfzebra/create-elm-app)
