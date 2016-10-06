'use strict';

const Assert = require('assert');
const Hapi = require('hapi');
const Lab = require('lab');
const lab = exports.lab = Lab.script();

const FormData = require('form-data');
const StreamToPromise = require('stream-to-promise');
const Fs = require('fs');
const Nock = require('nock');
const Proxyquire =  require('proxyquire');

lab.experiment('Upload file', () => {

  let server;
  lab.before((done) => {

    // We mock the filename so it's not random
    const mock = Proxyquire('../index', {
      './utils': {
        getFileName: function (filename) {

          return 'test/' + filename;
        }
      }
    });

    server = new Hapi.Server();
    server.connection({
      port: 8080
    });
    server.register({
      register: mock,
      options: {
        s3AccessKey: 'test',
        s3SecretKey: 'test',
        s3Region: 'region',
        s3Bucket: 'bucket',
        prependDate: true
      }
    }, done);
  });

  lab.test('should be formdata', (done) => {

    const options = {
      method: 'POST',
      url: '/upload',
      payload: {
        file: 'IAMJSON'
      }
    };

    server.inject(options, (response) => {

      Assert(response.statusCode === 415);
      done();
    });
  });

  lab.test('should have file', (done) => {

    const formData = new FormData();
    formData.append('stuff', 'random');
    StreamToPromise(formData).then((payload) => {

      const options = {
        method: 'POST',
        url: '/upload',
        headers: formData.getHeaders(),
        payload
      };

      server.inject(options, (response) => {

        Assert(response.statusCode === 422);
        done();
      });
    });
  });

  lab.test('should upload pdf', (done) => {

    // We mock the upload call
    Nock('https://bucket.s3.region.amazonaws.com')
      .log(console.log)
      .put('/test/logo.pdf')
      .reply(200);

    const formData = new FormData();
    formData.append('file', Fs.createReadStream(__dirname + '/logo.pdf'));
    StreamToPromise(formData).then((payload) => {

      const options = {
        method: 'POST',
        url: '/upload',
        headers: formData.getHeaders(),
        payload
      };

      server.inject(options, (response) => {

        Assert(response.statusCode === 200);
        Assert(response.result.Location === 'https://bucket.s3.region.amazonaws.com/test/logo.pdf');
        done();
      });
    });
  });

  lab.test('should fail to upload unsupported file', (done) => {

    const formData = new FormData();
    formData.append('file', Fs.createReadStream(__dirname + '/icon.xcf'));
    StreamToPromise(formData).then((payload) => {

      const options = {
        method: 'POST',
        url: '/upload',
        headers: formData.getHeaders(),
        payload
      };

      server.inject(options, (response) => {

        Assert(response.statusCode === 415);
        done();
      });
    });
  });

  lab.test('should fail to upload pdf', (done) => {

    // We mock the upload call
    Nock('https://bucket.s3.region.amazonaws.com')
      .log(console.log)
      .put('/test/logo.pdf')
      .reply(500);

    const formData = new FormData();
    formData.append('file', Fs.createReadStream(__dirname + '/logo.pdf'));
    StreamToPromise(formData).then((payload) => {

      const options = {
        method: 'POST',
        url: '/upload',
        headers: formData.getHeaders(),
        payload
      };

      server.inject(options, (response) => {

        Assert(response.statusCode === 500);
        done();
      });
    });
  });
});
