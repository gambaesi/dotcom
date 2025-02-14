const Sequelize = require('sequelize');

class Like extends Sequelize.Model {
    static initiate(sequelize) {
        Like.init({
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
                comment: 'PK (like_id)'
            },
            userId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id'
                },
                field: 'user_id',
                comment: '사용자 ID (FK)'
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
            }
        }, {
            sequelize,
            timestamps: true,
            underscored: true,
            paranoid: true,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
            tableName: 'likes',
        })
    }

    static associate(db) {
        // N:1 (단방향 관계)
        db.Like.belongsTo(db.User, { foreignKey: 'user_id', targetKey: 'id' });
        db.Like.belongsTo(db.Post, { foreignKey: 'post_id', targetKey: 'id' });
    }
}

module.exports = Like;