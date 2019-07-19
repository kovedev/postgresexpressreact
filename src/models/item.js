const item = (sequelize, DataTypes) => {
    const Item = sequelize.define('item', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        date: {
            type: DataTypes.DATE,
            defaultValue: Date.now(),
        },
    });

    return Item;
}

export default item;