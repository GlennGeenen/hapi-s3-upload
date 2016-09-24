# hapi-s3-upload

[![Build Status](https://travis-ci.org/GlennGeenen/hapi-s3-upload.svg?branch=master)](https://travis-ci.org/GlennGeenen/hapi-s3-upload)

This plugin exposes a route to upload files to S3. You POST multipart/form-data.

## Options

### Optional

- path: default /upload
- cors: default false
- auth: default no auth
- contentTypes: default ['application/pdf', 'image/jpeg', 'image/png']
- maxBytes: default 10485760

### Required

- s3AccessKey
- s3SecretKey
- s3Region
- s3Bucket

## Usage

```
const options = {
  s3AccessKey: process.env.S3_ACCESS_KEY,
  s3SecretKey: process.env.S3_SECRET_KEY,
  s3Region: process.env.S3_REGION,
  s3Bucket: process.env.S3_BUCKET
};

server.register({
  register: require('hapi-s3-upload'),
  options
}, (err) => {

  // Done
});
```
