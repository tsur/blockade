# Blockade

Inspired by the classical blockade game, thereafter known as snake game, developed and published by Gremlin Industries back in 1976 and written in ES6. A demo is available [here](http://tsur.github.io/blockade). You may also control it from another client by using WebRTC on those mobile devices supporting it [here](http://tsur.github.io/blockade/peer.html). You may also download the project in zip format, then extract it and open the index.html file located on dist folder.

# Setting up

To deploy it on your local machine, just follow the steps below:

```bash
git clone https://github.com/Tsur/blockade.git 
cd blockade && npm run deploy:local
```
Open your browser on localhost:8080 to start developing. You may now modify the source code and the browser will refresh automatically.

** NOTE: You will need LiveReload Plugin from chrome-store to enable live reloading

To deploy it remotely, make sure you commit and/or push all your changes to the develop branch. Once your done, just run either or both of:

```bash
# Heroku app (first time you need to create the heroku app: heroku create)
npm run deploy:heroku
# Github Pages (first time you need to create it: git checkout -b gh-pages develop)
npm run deploy:gh-pages
```

# Building

```bash
# for websockets support
npm run ws
# for webrtc support
npm run webrtc
```

After then, set the start script on package.json to some of the following: start:ws or start:webrtc

# Testing

```bash
npm run test
```
