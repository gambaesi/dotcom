const Sequelize = require('sequelize');

class User extends Sequelize.Model {
    static initiate(sequelize) {
        User.init({
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
                comment: 'PK (user_id)'
            },
            email: {
                type: Sequelize.STRING(255),
                allowNull: false, // null허용 X
                unique: true,
                comment: '유저의 고유 이메일 주소'
            },
            password: {
                type: Sequelize.STRING(255),
                allowNull: false,
                comment: '유저의 암호화된 비밀번호'
            },
            name: {
                type: Sequelize.STRING(50),
                allowNull: false,
                comment: '유저의 이름'
            },
            gender: {
                type: Sequelize.ENUM('M', 'F', 'O'),
                allowNull: false,
                defaultValue: 'O',
                comment: '성별 (M: 남성, F: 여성, O: 기타/비공개)'
            },
            birthDate: {
                type: Sequelize.DATEONLY,
                allowNull: true,
                defaultValue: null,
                field: 'birth_date',
                comment: '생년월일 (YYYY-MM-DD)'
            },
            phoneNumber: {
                type: Sequelize.STRING(15),
                allowNull: true,
                defaultValue: null,
                field: 'phone_number',
                comment: '연락처 (000-0000-0000)'
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
        // 1:N
        // Post 모델에 author_id 필드가 존재하고, 이 필드는 User 모델의 id를 참조
        db.User.hasMany(db.Post, { foreignKey: 'author_id', sourceKey: 'id' });
        db.User.hasMany(db.Comment, { foreignKey: 'user_id', sourceKey: 'id' });
        db.User.hasMany(db.Notification, { foreignKey: 'user_id', sourceKey: 'id' });
    }
}

module.exports = User;