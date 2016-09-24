'use strict';

const Assert = require('assert');
const Hapi = require('hapi');
const Lab = require('lab');
const lab = exports.lab = Lab.script();

lab.experiment('Upload file', () => {

  let server;
  lab.before((done) => {

    server = new Hapi.Server();
    server.connection({
      port: 8080
    });
    server.register({
      register: require('../index'),
      options: {
        s3AccessKey: 'test',
        s3SecretKey: 'test',
        s3Region: 'region',
        s3Bucket: 'bucket',
        path: '/notupload'
      }
    }, done);
  });

  lab.test('should not find upload', (done) => {

    const options = {
      method: 'POST',
      url: '/upload',
      payload: {
        file: 'IAMJSON'
      }
    };

    server.inject(options, (response) => {

      Assert(response.statusCode === 404);
      done();
    });
  });

  lab.test('should be formdata', (done) => {

    const options = {
      method: 'POST',
      url: '/notupload',
      payload: {
        file: 'IAMJSON'
      }
    };

    server.inject(options, (response) => {

      Assert(response.statusCode === 415);
      done();
    });
  });
});
