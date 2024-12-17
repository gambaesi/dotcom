const Sequelize = require('sequelize');

class PostTag extends Sequelize.Model {
    static initiate(sequelize) {
        // 모델 정보, 테이블 정보 입력

        PostTag.init({
            tagId: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                allowNull: false,
                field: 'tag_id',
                comment: '태그 ID',
            },
            postId: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                allowNull: false,
                field: 'post_id',
                comment: '게시글 ID',
            }
        }, {
            sequelize,
            timestamps: false,
            underscored: true,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
            tableName: 'post_tags',
            createdAt: false,
            updatedAt: false,
            deletedAt: false
        })
    }

    static associate(db) {
        db.PostTag.belongsToMany(db.Tag, { through: 'post_tags', foreignKey: 'tag_id', otherKey: 'post_id' });
        db.PostTag.belongsToMany(db.Post, { through: 'post_tags', foreignKey: 'post_id', otherKey: 'tag_id' });
    }
}

module.exports = PostTag;