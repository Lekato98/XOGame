import {redisClient} from "../utils/redis.mjs";

const index = async (req, res) => {
  res.render('index');
}

export {
  index
}