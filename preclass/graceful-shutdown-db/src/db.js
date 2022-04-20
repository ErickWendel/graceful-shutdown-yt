import Sequelize from 'sequelize'
const sequelize = new Sequelize(
    `postgres://${process.env.POSTGRES_HOST}/heroes`, {
        logging: false
    }
);

async function getHeroModel() {
    await sequelize.authenticate();
    console.log("postgres is running");

    const Hero = sequelize.define("hero", {
        name: Sequelize.STRING,
        power: Sequelize.STRING,
    });

    await Hero.sync({
        force: true
    });

    return Hero
}

export {
    getHeroModel,
    sequelize
}