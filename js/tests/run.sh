#!/bin/sh
case "$1" in
    unit)
        phantomjs unit/run-qunit.js http://localhost/js/tests/unit/index.html
    ;;
    functional)
        casperjs test functional/*.js
    ;;
    *)
        phantomjs unit/run-qunit.js http://localhost/js/tests/unit/index.html
        casperjs test functional/*.js
    ;;
esac