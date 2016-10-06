'use strict';

const Assert = require('assert');
const Lab = require('lab');
const lab = exports.lab = Lab.script();

lab.experiment('Utils', () => {

  const Utils = require('../utils');

  lab.test('getDateString', (done) => {

    // Time bending stuff
    const Lolex = require('lolex');

    let clock = Lolex.install(undefined, new Date('2016-09-24T12:00:00.504Z'));
    const dateString = Utils.getDateString();
    Assert(dateString.length === 10);
    Assert(dateString === '24-09-2016');
    Assert(dateString === Utils.getDateString());

    clock = Lolex.install(undefined, new Date('2016-10-08T12:00:00.504Z'));
    Assert(Utils.getDateString() === '08-10-2016');
    clock.uninstall();
    done();
  });

  lab.test('getRandomString', (done) => {

    const randomString = Utils.getRandomString();
    Assert(randomString.length === 16);
    Assert(randomString !== Utils.getRandomString());
    done();
  });

  lab.test('getFileName', (done) => {

    let fileName = Utils.getFileName('test.jpg', true);
    // Format date/name-random.extension
    Assert(fileName.length === 10 + 2 + 16 + 8);

    fileName = Utils.getFileName('test.jpg', false);
    // Format name-random.extension
    Assert(fileName.length === 1 + 16 + 8);
    done();
  });
});
