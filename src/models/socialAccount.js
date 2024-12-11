const Sequelize = require('sequelize');

class SocialAccount extends Sequelize.Model {
    static initiate(sequelize) {
        // 모델 정보, 테이블 정보 입력

        SocialAccount.init({
            socialId: {
                type: Sequelize.STRING(50),
                allowNull: false,
                unique: true,
                field: 'social_id',
            },
            provider: {
                type: Sequelize.ENUM('kakao', 'google', 'facebook'),
                allowNull: false,
            },
            accessToken: {
                type: Sequelize.STRING(255),
                allowNull: false,
                field: 'access_token',
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