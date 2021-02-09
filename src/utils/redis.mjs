import redis from 'redis';

export function connectRedis() {
  const client = redis.createClient();

  client.on('error', (error) => {
    console.log('lalu');
    console.error(error);
  });

  client.on('ready', () => {
    console.log('Redis Connected Successfully');
  });

  return client;
}

export const redisClient = connectRedis();
