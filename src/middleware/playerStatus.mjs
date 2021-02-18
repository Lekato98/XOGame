import {redisClient} from "../utils/redis.mjs";

const checkPlayerStatus = async (req, res, next) => {
  try {
    const userExist = await redisClient.exists("kato") === 1;

    if (userExist === true) {
      res.status(400).send('Already in game');
    } else {
      next();
    }
  } catch (err) {
    console.error(err);
  }
}

export {checkPlayerStatus}