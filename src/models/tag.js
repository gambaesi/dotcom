const Sequelize = require('sequelize');

class Tag extends Sequelize.Model {
    static initiate(sequelize) {
        Tag.init({
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
                comment: 'PK (tag_id)'
            },
            name: {
                type: Sequelize.STRING(50),
                allowNull: false,
                unique: true,
                comment: '태그 이름 (유니크)',
            }
        }, {
            sequelize,
            timestamps: true,
            underscored: true,
            paranoid: true,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
            tableName: 'tags',
        })
    }

    static associate(db) {
        // N:N (다대다)
        db.Tag.belongsToMany(db.Post, { through: db.PostTag, foreignKey: 'tag_id', otherKey: 'post_id' });
    }
}

module.exports = Tag;