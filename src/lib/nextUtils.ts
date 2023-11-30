import CONSTANTS from '@/constants/constants';

export function withBasePath(path: string) {
  if (path.startsWith('/')) {
    path = path.slice(1);
  }

  return `${CONSTANTS.BASE_PATH}/${path}`;
}
