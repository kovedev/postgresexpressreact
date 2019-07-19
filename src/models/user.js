const user = (sequelize, Datatypes) => {
    
    const User = sequelize.define('user', {
        username: {
            type: Datatypes.STRING,
            unique: true,
            required: true,
            allowNull: false
        },
        email: {
            type: Datatypes.STRING,
            unique: true,
            required: true,
            allowNull: false
        },
        password: {
            type: Datatypes.STRING,
            unique: true,
            required: true,
            allowNull: false
        }
    });

    User.associate = models => {
        User.hasMany(models.Message, { onDelete: 'CASCADE'});
    };

    User.findByLogin = async login => {
        let user = await User.findOne({
            where: { username: login },
        });

        if(!user){
            user = await User.findOne({
                where: { email: login },
            });
        }

        return user;
    }

    return User;
};

export default user;