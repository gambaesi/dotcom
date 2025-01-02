const multer = require('multer');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { v4: uuidv4 } = require('uuid');
const dayjs = require('dayjs');
const path = require('path');

// AWS S3 설정
const s3 = new S3Client({
    region: process.env.S3_REGION,
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
    }
});

// multer를 이용해서 Request로 들어온 파일을 처리하는 미들웨어
// diskStorage: 파일을 디스크에 저장하고, 그 경로를 req.files에 포함(저장)시킴
// memoryStorage: 파일을 메모리에 저장하고, 그 버퍼를 req.files에 포함(저장)시킴
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpeg' &&  file.mimetype !== 'image/jpg') {
            return cb(new Error('PNG 또는 JPEG 또는 JPG 형식의 파일만 업로드할 수 있습니다.'));
        }
        cb(null, true);
    }
})

const uploadToS3 = async (files, folderName, userId) => {
    try {
        const promises = files.map(async (file) => {
            const formattedDate = dayjs().format('YYYYMMDDHHmmss');
            const uniqueId = uuidv4();
            const fileName = `${folderName}/${userId}_${formattedDate}_${uniqueId}${path.extname(file.originalname)}`;
    
            const params = {
                Bucket: process.env.S3_BUCKET_NAME,
                Key: fileName,
                Body: file.buffer,
                ContentType: file.mimetype,
            }
    
            await s3.send(new PutObjectCommand(params));
            return `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.S3_REGION}.amazonaws.com/${fileName}`;
        });
    
        return Promise.all(promises); // 모든 파일 업로드 후 url 변환
    } catch (error) {
        throw error;
    }
}

const uploadToS3Handler = async (req, res, next) => {
    try {
        const userId = req.body.authorId;
        const folderName = `posts/${userId}`; // 작성자 ID로 폴더 생성
        const imageUrls = await uploadToS3(req.files, folderName, userId);
        req.body.imageUrls = imageUrls;
        next();
    } catch (error) {
        next(error);
    }
}

module.exports = { upload, uploadToS3, uploadToS3Handler };