const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { randomUUID } = require('crypto');

// No explicit credentials: on the atesmaps-prod EC2 instance this picks up
// the instance's IAM role (see platform/aws/atesmaps/assets.tf, policy
// "assets_rw"), which already has s3:PutObject on the assets bucket. For
// local development, configure the "atesmaps" AWS profile / SSO session
// instead of adding keys here.
const s3Client = new S3Client({ region: process.env.AWS_REGION || 'eu-west-1' });

const ASSETS_BUCKET_NAME = process.env.ASSETS_BUCKET_NAME;
const OBSERVATION_IMAGES_PREFIX = 'observations/images';

const uploadObservationImage = async ({ directoryId, buffer, contentType, extension }) => {
    const filename = `${randomUUID()}${extension}`;
    const key = `${OBSERVATION_IMAGES_PREFIX}/${directoryId}/${filename}`;

    await s3Client.send(new PutObjectCommand({
        Bucket: ASSETS_BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: contentType,
    }));

    return filename;
};

module.exports = { uploadObservationImage };
