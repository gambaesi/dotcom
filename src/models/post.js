const Sequelize = require('sequelize');

class Post extends Sequelize.Model {
    static initiate(sequelize) {
        // 모델 정보, 테이블 정보 입력

        Post.init({
            title: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            content: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            authorId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                field: 'author_id',
                comment: '작성자 ID',
            },
            isPublished: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
                field: 'is_published',
                comment: '게시글 공개 여부',
            },
            views: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
                comment: '게시글 조회수',
            }
            // categoryId: {
            //     type: Sequelize.INTEGER,
            //     allowNull: true,
            //     field: 'category_id',
            // }
        }, {
            sequelize,
            timestamps: true,
            underscored: true,
            paranoid: true,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
            tableName: 'posts',
        })
    }

    static associate(db) {
        // 1:N
        db.Post.hasMany(db.Comment, { foreignKey: 'post_id', sourceKey: 'id' });
        db.Post.hasMany(db.Like, { foreignKey: 'post_id', sourceKey: 'id' });
        // N:1 (단방향 관계)
        db.Post.belongsTo(db.User, { foreignKey: 'author_id', targetKey: 'id' });
        //db.Post.belongsTo(db.Category, { foreignKey: 'category_id', targetKey: 'id' });
        // N:N (다대다)
        db.Post.belongsToMany(db.Tag, { through: 'PostTags', foreignKey: 'post_id', otherKey: 'tag_id' });
    }
}

module.exports = Post;