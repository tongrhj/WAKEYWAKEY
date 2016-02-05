# WAKEYWAKEY
### If you don't get out of bed in time, WAKEYWAKEY posts your sleeping face to the world.
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-green.svg?style=flat-square)](https://github.com/feross/standard)

![screenshot](https://wakey2.herokuapp.com/img/screenshot.png "WAKEYWAKEY Screenshot")

## Installation
```
npm install
```

## Development
```
npm run dev
```
## What WAKEYWAKEY Does
* Facebook Login
* Starts alarm countdown, can be cancelled
* Use WebRTC to capture a photo of you sleeping after 5 second (demo-only)/ 8 hours
* Converts image to Base64 and posts it to MongoLabs and IMGUR
* Shares IMGUR image on Facebook feed
* Displays all incriminating images from MongoLabs

## Tools and Frameworks
* [Express](http://expressjs.com/)
* [Auth0](https://auth0.com)
* [WebRTC](https://github.com/mdn/samples-server/tree/master/s/webrtc-capturestill)
* [Fetch API](https://github.com/github/fetch)
* [MongoLab](https://mongolab.com/)
* [IMGUR API](https://api.imgur.com)
* [Facebook Feed Dialog](https://developers.facebook.com/docs/sharing/reference/feed-dialog/v2.5)

## Product Roadmap
* UX Design
* Testing
* ~~Countdown Timer with Alarm Clock Sound~~
* ~~Switch image db to Cloudinary~~
