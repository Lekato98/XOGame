import redis from 'async-redis';

export function connectRedis() {
  const client = redis.createClient(process.env.REDIS_URL);

  client.on('error', (error) => {
    console.error(error);
  });

  client.on('ready', () => {
    console.log('Redis Connected Successfully');
  });

  client.flushall();

  return client;
}

export const redisClient = connectRedis();
