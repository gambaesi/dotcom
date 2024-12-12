const Sequelize = require('sequelize');

class User extends Sequelize.Model {
    static initiate(sequelize) {
        // 모델 정보, 테이블 정보 입력

        User.init({
            email: {
                type: Sequelize.STRING(255),
                allowNull: false, // null허용 X
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
            gender: {
                type: Sequelize.ENUM('M', 'F', 'O'), // 남성, 여성, 기타/비공개
                defaultValue: 'O'
            },
            birthDate: {
                type: Sequelize.DATEONLY,
                allowNull: true,
                field: 'birth_date'
            },
            phoneNumber: {
                type: Sequelize.STRING(15),
                allowNull: true,
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
        db.User.hasMany(db.Post, { foreignKey: 'author_id', sourceKey: 'id' });
        db.User.hasMany(db.Comment, { foreignKey: 'user_id', sourceKey: 'id' });
        db.User.hasMany(db.Notification, { foreignKey: 'user_id', sourceKey: 'id' });
    }
}

module.exports = User;