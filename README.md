# Onko metro rikki?

[![Sponsored](https://img.shields.io/badge/chilicorn-sponsored-brightgreen.svg?logo=data%3Aimage%2Fpng%3Bbase64%2CiVBORw0KGgoAAAANSUhEUgAAAA4AAAAPCAMAAADjyg5GAAABqlBMVEUAAAAzmTM3pEn%2FSTGhVSY4ZD43STdOXk5lSGAyhz41iz8xkz2HUCWFFhTFFRUzZDvbIB00Zzoyfj9zlHY0ZzmMfY0ydT0zjj92l3qjeR3dNSkoZp4ykEAzjT8ylUBlgj0yiT0ymECkwKjWqAyjuqcghpUykD%2BUQCKoQyAHb%2BgylkAyl0EynkEzmkA0mUA3mj86oUg7oUo8n0k%2FS%2Bw%2Fo0xBnE5BpU9Br0ZKo1ZLmFZOjEhesGljuzllqW50tH14aS14qm17mX9%2Bx4GAgUCEx02JySqOvpSXvI%2BYvp2orqmpzeGrQh%2Bsr6yssa2ttK6v0bKxMBy01bm4zLu5yry7yb29x77BzMPCxsLEzMXFxsXGx8fI3PLJ08vKysrKy8rL2s3MzczOH8LR0dHW19bX19fZ2dna2trc3Nzd3d3d3t3f39%2FgtZTg4ODi4uLj4%2BPlGxLl5eXm5ubnRzPn5%2Bfo6Ojp6enqfmzq6urr6%2Bvt7e3t7u3uDwvugwbu7u7v6Obv8fDz8%2FP09PT2igP29vb4%2BPj6y376%2Bu%2F7%2Bfv9%2Ff39%2Fv3%2BkAH%2FAwf%2FtwD%2F9wCyh1KfAAAAKXRSTlMABQ4VGykqLjVCTVNgdXuHj5Kaq62vt77ExNPX2%2Bju8vX6%2Bvr7%2FP7%2B%2FiiUMfUAAADTSURBVAjXBcFRTsIwHAfgX%2FtvOyjdYDUsRkFjTIwkPvjiOTyX9%2FAIJt7BF570BopEdHOOstHS%2BX0s439RGwnfuB5gSFOZAgDqjQOBivtGkCc7j%2B2e8XNzefWSu%2BsZUD1QfoTq0y6mZsUSvIkRoGYnHu6Yc63pDCjiSNE2kYLdCUAWVmK4zsxzO%2BQQFxNs5b479NHXopkbWX9U3PAwWAVSY%2FpZf1udQ7rfUpQ1CzurDPpwo16Ff2cMWjuFHX9qCV0Y0Ok4Jvh63IABUNnktl%2B6sgP%2BARIxSrT%2FMhLlAAAAAElFTkSuQmCC)](http://spiceprogram.org/oss-sponsorship)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/olpeh/onkometrorikki/pulls)
[![license](http://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat)](https://github.com/olpeh/onkometrorikki/blob/master/LICENSE)
[![All Contributors](https://img.shields.io/badge/all_contributors-2-orange.svg?style=flat-square)](#contributors)

Check if the metro in Helsinki area is broken at the moment

## What is this?

A really stupid prototype app that shows whether the metro in Helsinki is broken currently.

The information is based on the [Service Alerts API](https://digitransit.fi/en/developers/apis/4-realtime-api/service-alerts/).

Follow [@onkometrorikki](https://twitter.com/onkometrorikki) for notifications when there are disruptions in the metro.

## Try it

Head to [onkometrorikki.fi](https://onkometrorikki.fi/)

## Development

Install dependencies: `yarn`

Start the backend: `npm start`

Start the frontend: `npm run dev`

## Deployments

Deployments are triggered automatically for every commit in master branch.

For manual deployments:

- Backend is deployed in Heroku: `git push heroku master`
- Deploy frontend to now: `npm run release`

## Contributors

If you'd like to contribute, see [CONTRIBUTING.md](CONTRIBUTING.md).

Thanks goes to these wonderful people ([emoji key](https://github.com/kentcdodds/all-contributors#emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
| [<img src="https://avatars1.githubusercontent.com/u/6113341?v=4" width="100px;"/><br /><sub><b>Olavi Haapala</b></sub>](https://olpe.fi/)<br />[💻](https://github.com/olpeh/onkometrorikki/commits?author=olpeh "Code") [📖](https://github.com/olpeh/onkometrorikki/commits?author=olpeh "Documentation") [🐛](https://github.com/olpeh/onkometrorikki/issues?q=author%3Aolpeh "Bug reports") [👀](#review-olpeh "Reviewed Pull Requests") [📢](#talk-olpeh "Talks") | [<img src="https://avatars3.githubusercontent.com/u/3210764?v=4" width="100px;"/><br /><sub><b>Fotis Papadogeorgopoulos</b></sub>](http://fpapado.com)<br />[💻](https://github.com/olpeh/onkometrorikki/commits?author=fpapado "Code") [🎨](#design-fpapado "Design") [👀](#review-fpapado "Reviewed Pull Requests") [🚇](#infra-fpapado "Infrastructure (Hosting, Build-Tools, etc)") |
| :---: | :---: |

<!-- ALL-CONTRIBUTORS-LIST:END -->

## Credits, Thanks, Inspiration

- Inspired by [fpapado/proto](https://github.com/fpapado/proto)
- This project is sponsored by [Futurice's](https://futurice.com/) [Open Source Sponsorship program](http://spiceprogram.org/oss-sponsorship)
- The elm app is heavily inspired by [elm-quicks](https://github.com/ohanhi/elm-quicks/) by [ohanhi](https://github.com/ohanhi/)
- The UI is built using Elm, and it is based on [create-elm-app](https://github.com/halfzebra/create-elm-app)

## Supporters

This project is sponsored by [Futurice's](https://futurice.com/) [Open Source Sponsorship program](http://spiceprogram.org/oss-sponsorship)

[![Supported by the Spice Program](https://github.com/futurice/spiceprogram/raw/gh-pages/assets/img/logo/chilicorn_with_text-180.png)](https://spiceprogram.org)
