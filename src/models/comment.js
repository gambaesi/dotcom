const Sequelize = require('sequelize');

class Comment extends Sequelize.Model {
    static initiate(sequelize) {
        Comment.init({
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
                comment: 'PK (comment_id)'
            },
            content: {
                type: Sequelize.TEXT,
                allowNull: false,
                comment: '댓글 내용'
            },
            userId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id',
                },
                field: 'user_id',
                comment: '사용자 ID (FK)'
            },
            postId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'posts',
                    key: 'id',
                },
                field: 'post_id',
                comment: '게시글 ID (FK)'
            }
        }, {
            sequelize,
            timestamps: true,
            underscored: true,
            paranoid: true,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
            tableName: 'comments',
        })
    }

    static associate(db) {
        // N:1 (단방향 관계)
        db.Comment.belongsTo(db.User, { foreignKey: 'user_id', targetKey: 'id' });
        db.Comment.belongsTo(db.Post, { foreignKey: 'post_id', targetKey: 'id' });
    }
}

module.exports = Comment;