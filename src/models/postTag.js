const Sequelize = require('sequelize');

class PostTag extends Sequelize.Model {
    static initiate(sequelize) {
        PostTag.init({
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true, 
                autoIncrement: true,
                allowNull: false,
                comment: '중간 테이블 PK (posts 테이블과 tags 테이블)',
            },
            postId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'posts',
                    key: 'id',
                },
                field: 'post_id',
                comment: '게시글 ID (FK)',
            },
            tagId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'tags',
                    key: 'id',
                },
                field: 'tag_id',
                comment: '태그 ID (FK)',
            },
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
        db.PostTag.belongsToMany(db.Tag, { through: db.PostTag, foreignKey: 'tag_id', otherKey: 'post_id' });
        db.PostTag.belongsToMany(db.Post, { through: db.PostTag, foreignKey: 'post_id', otherKey: 'tag_id' });
    }
}

module.exports = PostTag;