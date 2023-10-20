import AWS from 'aws-sdk'

export async function uploadToS3(file: File, onProgress: (percentage: number) => void) {
    try {
        AWS.config.update({
            accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID,
            secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY
        });
        const s3 = new AWS.S3({
            params: {
                Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
            },
            region: 'eu-west-2'
        });

        const file_key = 'uploads/' + Date.now().toString() + file.name.replace(' ', '-');

        const params = {
            Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
            Key: file_key,
            Body: file
        };

        const upload = s3.putObject(params).on('httpUploadProgress', evt => {
            const percentage = parseInt(((evt.loaded * 100) / evt.total).toString());
            onProgress(percentage);
        }).promise();

        await upload.then(data => {
            console.log('successfully uploaded to S3', file_key);
        });

        return Promise.resolve({
            file_key,
            file_name: file.name
        });

    } catch (error) { }
}

export function getS3Url(file_key: string) {
    return `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.eu-west-2.amazonaws.com/${file_key}`
}

export async function viewS3Files(): Promise<string[]> {
    try {
        AWS.config.update({
            accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID,
            secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY,
        });
        const s3 = new AWS.S3({
            params: {
                Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
            },
            region: 'eu-west-2',
        });
        const params = {
            Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
            Prefix: 'uploads/',
        };

        const objects: string[] = [];
        const data = await s3.listObjectsV2(params).promise();

        if (data.Contents) {
            for (const object of data.Contents) {
                if (object.Key) {
                    const objectKey = object.Key.replace('uploads/', '');
                    objects.push(objectKey);
                }
            }
        }

        return objects;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export async function countS3Files(): Promise<number> {
    try {
        AWS.config.update({
            accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID,
            secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY,
        });
        const s3 = new AWS.S3({
            params: {
                Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
            },
            region: 'eu-west-2',
        });
        const params = {
            Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
            Prefix: 'uploads/',
        };

        const data = await s3.listObjectsV2(params).promise();

        if (data.Contents) {
            return data.Contents.length;
        }

        return 0;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export async function deleteS3File(file_key: string) {
    try {
        AWS.config.update({
            accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID,
            secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY,
        });

        const s3 = new AWS.S3({
            params: {
                Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
            },
            region: 'eu-west-2',
        });

        const params = {
            Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
            Key: `uploads/${file_key}`,
        };

        await s3.deleteObject(params).promise();

    } catch (err) {
        console.error(err);
        throw err;
    }
}

