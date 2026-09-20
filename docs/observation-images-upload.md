# Uploading observation images

Context: observation images used to be uploaded directly from the mobile app
to a DigitalOcean Spaces bucket, using an AWS-style access key/secret
embedded in the app (`src/config.js`: `ACCESS_KEY` / `ACCESS_SECRET`). DO
Spaces is being retired in favor of AWS S3, and the new S3 bucket has no
client-facing credentials — only the API server can write to it. This
endpoint replaces the old direct-to-bucket upload: **the app uploads the
image bytes to the API, and the API writes to S3.**

The mobile app is not using this yet — this doc is for whoever wires it up.

## Endpoint

```
POST /observations/:id/images
Authorization: Bearer <access token>
Content-Type: multipart/form-data
```

- `:id` — the Mongo `_id` of an existing observation (create/update the
  observation first with the existing observation endpoints, then upload
  images against its id).
- Body: one or more files under the field name **`images`** (repeat the
  field for multiple files). Field name matters — anything else is ignored
  by multer.
- Auth: same Bearer JWT as the rest of `/observations`. The endpoint also
  checks that the observation's `user` matches the authenticated user —
  you can only upload images to your own observations.

### Limits

- Allowed types: `image/jpeg`, `image/png`, `image/webp`, `image/heic`.
  Anything else is rejected.
- Max 10MB per file, max 10 files per request.

### Response

**201 Created**
```json
{
  "directoryId": "6706e4a1f2c1b2a0d4e5f678",
  "images": ["a1b2c3d4-....jpg", "e5f6a7b8-....heic"]
}
```
`images` is the observation's *full* image list (previously-uploaded
filenames plus the ones just added), not just the new ones.

`directoryId` is assigned by the server the first time images are uploaded
(it's just the observation's own `_id` — the app doesn't need to generate
or send one). If the observation already has a `directoryId` from a
previous upload, it's reused.

**Error responses**

| Status | When |
|---|---|
| 400 | No `:id` in the URL, or no files in the request |
| 401 / 403 | Missing/invalid token, or the observation belongs to a different user |
| 204 | No observation with that id |
| 500 | Upload to S3 or the DB save failed |

## Displaying images afterwards

Images are served through CloudFront, not directly from S3. Build the URL
as:

```
https://assets.atesmaps.org/observations/images/<directoryId>/<filename>
```

using the `directoryId` and `images[]` already on the observation (same
fields as before — only the base URL changed). Today the app builds this
with `PULIC_BUCKET_URL` in `src/config.js`, which still points at the old
DigitalOcean Spaces URL — **that constant needs to be updated to
`https://assets.atesmaps.org/observations/images`** as part of this work,
independently of when the upload flow itself gets migrated, since existing
images have already been copied to S3 under that path.

## What to change in the app

1. Update `PULIC_BUCKET_URL` (see above) so existing images keep loading.
2. Remove the direct-to-bucket upload in `ObservationDetail.js`
   (`uploadFile`, the `PutObjectCommand` call) and the AWS S3 client setup
   (`src/aws/s3.js`, `ACCESS_KEY`/`ACCESS_SECRET`/`ENDPOINT` in
   `src/config.js`) — none of that is needed anymore.
3. After creating or updating an observation (existing flow, unchanged),
   send its selected local images to `POST /observations/:id/images` as
   `multipart/form-data`, one request (can include multiple files) is
   enough per save. No need to generate a `directoryId` client-side anymore.

### Example (React Native `fetch`)

```js
const formData = new FormData();
images.forEach((image) => {
  formData.append('images', {
    uri: image.path,
    name: image.filename,
    type: image.mime,
  });
});

const response = await fetch(`${BASE_URL}/observations/${observationId}/images`, {
  method: 'POST',
  headers: { Authorization: `Bearer ${accessToken}` },
  body: formData,
});

const { directoryId, images: uploadedImages } = await response.json();
```

## Implementation reference

- Route: `routes/api/observations.js`
- Controller: `uploadObservationImages` in `controllers/observationsController.js`
- Upload middleware (multer config, allowed types): `middleware/upload.js`
- S3 write: `services/assetsService.js` — uses the API server's AWS
  credentials (EC2 instance role in production), never the client's.
