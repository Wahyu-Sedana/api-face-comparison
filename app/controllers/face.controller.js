require('dotenv').config()
const AWS = require('../config/config-credentials')

var rekognition = new AWS.Rekognition()
var s3 = new AWS.S3()

const {
    AWS_BUCKET_NAME,
    AWS_BUCKET_FOLDER_NAME
} = process.env


const detectFace = async (req, res) => {
    const image = req.file.buffer

    const s3Params = {
        Bucket: AWS_BUCKET_NAME,
        Prefix: AWS_BUCKET_FOLDER_NAME
    };
    try {
        const data = await s3.listObjects(s3Params).promise();
        const results = await Promise.all(data.Contents.map(async (object) => {
            const rekognitionParams = {
                SourceImage: {
                    S3Object: {
                        Bucket: AWS_BUCKET_NAME,
                        Name: object.Key,
                    },
                },
                TargetImage: {
                    Bytes: image,
                },
                SimilarityThreshold: 80,
            };

            try {
                const data = await rekognition.compareFaces(rekognitionParams).promise();
                if (data.FaceMatches.length > 0) {
                    return object.Key;
                } else {
                    return null;
                }
            } catch (err) {
                console.log(err, err.stack);
                return null;
            }
        }));

        const matchingObjects = results.filter(obj => obj !== null);
        if (matchingObjects.length > 0) {
            const matchingMessage = `gambar yang sama: ${matchingObjects}`;
            console.log(matchingMessage);
            res.json({
                status: true,
                data: matchingObjects,
                message: 'face matches',
            });
        } else {
            console.log(`tidak ada gambar yang sama.`);
            res.json({
                status: true,
                data: [],
                message: 'face unmatches',
            });
        }
    } catch (err) {
        console.log(err, err.stack);
    }
}

module.exports = {
    detectFace
}