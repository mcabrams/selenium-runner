var async = require('async');
var browse = require('./browse');

/**
 * This function launch an array of `tests` in every `browsers` connected to a selenium grid
 * described by `remoteCfg`
 * Each test gets `testCb` called with err, context (url, browser)
 * Each browser will launch opt.concurrency tests in parallel
*/
module.exports = function seleniumRunner (opt, tests, testCb, endCb) {
    filterBrowsers(opt.browsers, opt.remoteCfg, browsersFound);

    function browsersFound (err, browsers) {
        if (err !== null) {
            return endCb(err);
        }

        async.forEach(browsers, launchTestsForDesiredBrowser, endCb);
    }

    function launchTestsForDesiredBrowser (desired, cb) {
        var queue = async.queue(launchTest, opt.concurrency);

        tests.forEach(function(test) {
            var task = {
                url: test.url,
                desired: desired,
                remoteCfg: opt.remoteCfg,
                exec: test.exec
            };
            queue.push(task, testCb);
        });

        queue.drain = cb;
    }
}

function launchTest (opt, cb) {
    browse(opt.url, opt.desired, opt.remoteCfg, function(err, driver) {
        opt.exec(driver, function(err) {
            var context = {
                url: opt.url,
                browser: opt.desired
            };

            driver.quit(function() {
                cb(err, context);
            });
        });
    })
}

function filterBrowsers (browsers, remoteCfg, cb) {
        cb(null, browsers);
}
