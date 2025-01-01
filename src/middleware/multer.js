const multer = require('multer');
const fs = require('fs');
const path = require('path');
const dayjs = require('dayjs');
const { v4: uuidv4 } = require('uuid');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const userDir = path.join(__dirname, '../uploads/images/posts', req.body.authorId);
        if (!fs.existsSync(userDir)) {
            fs.mkdirSync(userDir, { recursive: true });
        };
        cb(null, userDir);
    },
    filename: (req, file, cb) => {
        const formattedDate = dayjs().format('YYYYMMDDHHmmss');
        const uniqueId = uuidv4();
        const fileName = `${req.body.authorId}_${formattedDate}_${uniqueId}${path.extname(file.originalname)}`;
        cb(null, fileName);

        /*
            1)
            public
                ㄴ images
                    ㄴ profile
                        ㄴ 1(userId)_20241023150000
                        ㄴ 2(userId)_20241023150000
                    ㄴ posts

            2)
            public
                ㄴ images
                    ㄴ 1 (userId)
                        ㄴ profile_20241023150000
                        ㄴ post_1(postId)_202410231500
                    ㄴ 2 (userId)
        */

    }
})

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpeg' &&  file.mimetype !== 'image/jpg') {
            return cb(new Error('PNG 또는 JPEG 또는 JPG 형식의 파일만 업로드할 수 있습니다.'));
        }
        cb(null, true);
    }
});

module.exports = upload;