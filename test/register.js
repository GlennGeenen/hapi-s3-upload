'use strict';

const Assert = require('assert');
const Hapi = require('hapi');
const Lab = require('lab');
const lab = exports.lab = Lab.script();

lab.experiment('Register plugin', () => {

  const getServer = function getServer() {

    const server = new Hapi.Server();
    server.connection({
      port: 8080
    });
    return server;
  };

  lab.test('should require s3AccessKey', (done) => {

    const callback = function (err) {

      Assert(err);
      done();
    };

    getServer().register({
      register: require('../index'),
      options: {
        s3SecretKey: 'test',
        s3Region: 'test',
        s3Bucket: 'test'
      }
    }, callback);
  });

  lab.test('should require s3Bucket', (done) => {

    const callback = function (err) {

      Assert(err);
      done();
    };

    getServer().register({
      register: require('../index'),
      options: {
        s3AccessKey: 'test',
        s3SecretKey: 'test',
        s3Region: 'test'
      }
    }, callback);
  });

  lab.test('should require s3SecretKey', (done) => {

    const callback = function (err) {

      Assert(err);
      done();
    };

    getServer().register({
      register: require('../index'),
      options: {
        s3AccessKey: 'test',
        s3Region: 'test',
        s3Bucket: 'test'
      }
    }, callback);
  });

  lab.test('should require s3Region', (done) => {

    const callback = function (err) {

      Assert(err);
      done();
    };

    getServer().register({
      register: require('../index'),
      options: {
        s3AccessKey: 'test',
        s3SecretKey: 'test',
        s3Bucket: 'test'
      }
    }, callback);
  });

  lab.test('should register', (done) => {

    getServer().register({
      register: require('../index'),
      options: {
        s3AccessKey: 'test',
        s3SecretKey: 'test',
        s3Region: 'test',
        s3Bucket: 'test'
      }
    }, done);
  });

  lab.test('should register with contentTypes', (done) => {

    getServer().register({
      register: require('../index'),
      options: {
        s3AccessKey: 'test',
        s3SecretKey: 'test',
        s3Region: 'test',
        s3Bucket: 'test',
        contentTypes: ['image/jpeg']
      }
    }, done);
  });

  lab.test('should register with maxBytes', (done) => {

    getServer().register({
      register: require('../index'),
      options: {
        s3AccessKey: 'test',
        s3SecretKey: 'test',
        s3Region: 'test',
        s3Bucket: 'test',
        maxBytes: 1000000
      }
    }, done);
  });

});
