'use strict';

const AWS = require('aws-sdk');
const Boom = require('boom');
const Utils = require('./utils');

exports.register = function (plugin, options, next) {

  if (!options.s3AccessKey ||
      !options.s3SecretKey ||
      !options.s3Region ||
      !options.s3Bucket) {
    return next(new Error('Not all required S3 options are provided.'));
  }

  // We create an S3 Instance
  const s3 = new AWS.S3({
    accessKeyId: options.s3AccessKey,
    secretAccessKey: options.s3SecretKey,
    region: options.s3Region
  });
  const contentTypes = options.contentTypes || ['application/pdf', 'image/jpeg', 'image/png'];

  // We add the upload route
  plugin.route({
    method: 'POST',
    path: options.path || '/upload',
    config: {
      cors: options.cors,
      tags: ['api', 'upload'],
      auth: options.auth,
      payload: {
        output: 'stream',
        parse: true,
        allow: 'multipart/form-data',
        maxBytes: options.maxBytes || 10485760 // 10MB
      }
    },
    handler: function (request, reply) {

      const file = request.payload.file;
      if (!file) {
        return reply(Boom.badData('Failed to read file'));
      }

      const contentType = file.hapi.headers['content-type'];
      if (contentTypes.indexOf(contentType) === -1) {
        return reply(Boom.unsupportedMediaType('Content-type not allowed'));
      }

      const fileKey = Utils.getFileName(file.hapi.filename, options.prependDate || false);

      s3.upload({
        Bucket: options.s3Bucket,
        Key: fileKey,
        Body: file,
        ContentType: contentType
      }, (err, data) => {

        if (err) {
          request.log(['error', 'upload'], err);
          return reply(err);
        }
        return reply(data);
      });
    }
  });
  next();
};

exports.register.attributes = {
  pkg: require('./package.json')
};
