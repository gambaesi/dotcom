const Sequelize = require('sequelize');

class SocialAccount extends Sequelize.Model {
    static initiate(sequelize) {
        SocialAccount.init({
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
                comment: 'PK'
            },
            socialId: {
                type: Sequelize.STRING(50),
                allowNull: false,
                unique: true,
                field: 'social_id',
                comment: '소셜 로그인 ID'
            },
            provider: {
                type: Sequelize.ENUM('kakao', 'google'),
                allowNull: false,
                comment: '소셜 로그인 제공자 (카카오, 구글)'
            },
            accessToken: {
                type: Sequelize.STRING(255),
                allowNull: true,
                field: 'access_token',
                comment: '소셜 로그인 액세스 토큰'
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
            }
        }, {
            sequelize,
            timestamps: true,
            underscored: true,
            paranoid: true,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
            tableName: 'social_accounts',
        })
    }

    static associate(db) {
        // N:1 (단방향 관계)
        db.SocialAccount.belongsTo(db.User, { foreignKey: 'user_id', targetKey: 'id' });
    }
}

module.exports = SocialAccount;