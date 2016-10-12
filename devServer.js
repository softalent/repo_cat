require('babel-register');

const path = require('path');
const express = require('express');
const webpack = require('webpack');
const config = require('./webpack.config');
const ip = require('ip');
const devTools = require('./devTools');

const IPAddress = process.env.EXPRESS_IP || ip.address();
const PORT = JSON.parse(process.env.EXPRESS_PORT || 5000);

const app = express();
const compiler = webpack(config);

app.use(require('webpack-dev-middleware')(compiler, {
  stats: {
    colors: true,
  },
  publicPath: config.output.publicPath,
}));

app.use(require('webpack-hot-middleware')(compiler));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, IPAddress, (err) => {
  if (err) {
    console.log(err); // eslint-disable-line no-console
    return;
  }

  console.log(`Listening at http://${IPAddress}:${PORT}`); // eslint-disable-line no-console
});

devTools.keyPressHookIn(IPAddress, PORT);
