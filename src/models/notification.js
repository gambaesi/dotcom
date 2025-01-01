// 게시글에 댓글이 달리거나, 좋아요가 눌리는 등의 이벤트에 대해 알림을 보내고 이를 기록하는 테이블입니다.

const Sequelize = require('sequelize');

class Notification extends Sequelize.Model {
    static initiate(sequelize) {
        Notification.init({
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
                comment: 'PK (notification_id)'
            },
            type: {
                type: Sequelize.ENUM('comment', 'like', 'follow'),
                allowNull: false,
                comment: '알림 유형 (comment: 댓글, like: 좋아요, follow: 팔로우)'
            },
            message: {
                type: Sequelize.STRING(255),
                allowNull: false,
                comment: '알림 내용'
            },
            link: {
                type: Sequelize.STRING(500),
                allowNull: true,
                comment: '관련 링크'
            },
            isRead: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
                field: 'is_read',
                comment: '알림 읽음 여부 (기본값: false)'
            },
            userId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id'
                },
                field: 'user_id',
                comment: '알림을 받은 사용자 ID (FK)'
            }
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