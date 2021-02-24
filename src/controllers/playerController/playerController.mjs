import {redisClient} from '../../utils/redis.mjs';

const playerInfo = async (req, res) => {
  const {playerId} = req.params;
  const userData = JSON.parse(await redisClient.get(playerId));
  res.json(userData);
};

export {
  playerInfo,
};