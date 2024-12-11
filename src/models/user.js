const Sequelize = require('sequelize');

class User extends Sequelize.Model {
    static initiate(sequelize) {
        // 모델 정보, 테이블 정보 입력

        User.init({
            id: {
                type: Sequelize.BIGINT.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            loginId: {
                type: Sequelize.STRING(50),
                allowNull: false, // null허용 X
                unique: true,
                field: 'login_id'
            },
            email: {
                type: Sequelize.STRING(255),
                allowNull: true,
                unique: true,
            },
            password: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            name: {
                type: Sequelize.STRING(50),
                allowNull: false,
            },
            birthDate: {
                type: Sequelize.DATE,
                allowNull: false,
                field: 'birth_date'
            },
            gender: {
                type: Sequelize.ENUM('M', 'F', 'O'), // 남성, 여성, 기타/비공개
                allowNull: false,
            },
            phoneNumber: {
                type: Sequelize.STRING(15),
                allowNull: false,
                field: 'phone_number',
            }
        }, {
            sequelize,
            timestamps: true,
            underscored: true,
            paranoid: true,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
            tableName: 'users',
        })
    }

    static associate(db) {
        // 테이블 관계 입력
        // 1:N
        db.User.hasMany(db.Post, { foreignKey: 'user_id', sourceKey: 'id' });
        db.User.hasMany(db.Comment, { foreignKey: 'user_id', sourceKey: 'id' });
        db.User.hasMany(db.Notification, { foreignKey: 'user_id', sourceKey: 'id' });
    }
}

module.exports = User;