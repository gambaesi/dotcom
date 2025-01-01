const Sequelize = require('sequelize');

class PostImage extends Sequelize.Model {
    static initiate(sequelize) {
        PostImage.init({
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
                comment: 'PK (image_id)'
            },
            postId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'posts',
                    key: 'id'
                },
                field: 'post_id',
                comment: '게시글 ID (FK)'
            },
            imageUrl: {
                type: Sequelize.STRING(200),
                allowNull: true,
                field: 'image_url',
                comment: '이미지 저장 경로'
            },
            originalName: {
                type: Sequelize.STRING,
                allowNull: true,
                field: 'original_name',
                comment: '원본 이미지 파일 이름'
            }
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
            tableName: 'post_images',
        })
    }

    static associate(db) {
        db.PostImage.belongsTo(db.Post, { foreignKey: 'post_id' });
    }
}

module.exports = PostImage;