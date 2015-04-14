var webdriver = require('browserstack-webdriver');

var async = require('async');

module.exports = browse;
function browse(url, desired, remoteCfg, cb) {
    if (typeof remoteCfg === 'function') {
        cb = remoteCfg;
        remoteCfg = undefined;
    }

    var driver = new webdriver.Builder().
      usingServer('http://hub.browserstack.com/wd/hub').
      withCapabilities(desired).
      build();

      async.series([
        function(callback) {
          driver.get("http://www.google.com").then(callback());
        },
        function(callback) {
          driver.isElementPresent({id: "foo"}).then(callback());
        },
        function(callback) {
          driver.takeScreenshot().then(callback());
        }
      ], function(err) {
        cb(err, driver);
      });
}

function logStatus(info) {
    console.log('\x1b[36m%s\x1b[0m', info);
}

function logCommand(meth, path) {
    console.log(' > \x1b[33m%s\x1b[0m: %s', meth, path);
}

function wait4(ms) {
    return wait.bind(null, ms);
}

function wait(ms, cb) {
    setTimeout(cb, ms);
}
