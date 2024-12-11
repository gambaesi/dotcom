const Sequelize = require('sequelize');

class Like extends Sequelize.Model {
    static initiate(sequelize) {
        Like.init({}, {
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