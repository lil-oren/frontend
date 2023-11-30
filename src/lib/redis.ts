import CONSTANTS from '@/constants/constants';
import { createClient } from 'redis';

export const redisClient = createClient({
  url: CONSTANTS.REDIS_URL,
});
