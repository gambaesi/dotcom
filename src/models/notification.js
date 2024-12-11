// 게시글에 댓글이 달리거나, 좋아요가 눌리는 등의 이벤트에 대해 알림을 보내고 이를 기록하는 테이블입니다.

const Sequelize = require('sequelize');

class Notification extends Sequelize.Model {
    static initiate(sequelize) {
        // 모델 정보, 테이블 정보 입력

        Notification.init({
            type: {
                type: Sequelize.ENUM('comment', 'like', 'follow'),
                allowNull: false,
            },
            message: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            link: {
                type: Sequelize.STRING(500),
                allowNull: true,
            },
            isRead: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
                field: 'is_read',
            },
        }, {
            sequelize,
            timestamps: true,
            underscored: true,
            paranoid: true,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
            tableName: 'notifications',
        })
    }

    static associate(db) {
        // N:1 (단방향 관계)
        db.Notification.belongsTo(db.User, { foreignKey: 'user_id', targetKey: 'id' });
    }
}

module.exports = Notification;