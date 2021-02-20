import {redisClient} from '../utils/redis.mjs';

const USER = 'user';
const checkPlayerStatus = async (req, res, next) => {
  try {
    const user = req.headers[USER];
    const userExist = await redisClient.exists(user) === 1;
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