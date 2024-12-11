const Sequelize = require('sequelize');

class Comment extends Sequelize.Model {
    static initiate(sequelize) {
        Comment.init({
            content: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
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