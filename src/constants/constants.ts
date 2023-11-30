const CONSTANTS = {
  BASEURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  BASE_PATH: process.env.NEXT_PUBLIC_BASE_PATH,
  CANNOT_ADD_MORE_THAN_STOCK: 'Cannot add quantity more than stock',
  ALREADY_LOGGED_OUT: 'RefreshTokenExpired',
  WALLET_NOT_ACTIVATED: 'Wallet is not activated',
  TOKEN_HAS_EXPIRED: 'Your token has expired, please sign in again',
  RO_BASEURL: 'https://api.rajaongkir.com/starter',
  RO_API_PROVINCE: '/api/rajaongkirprovince',
  RO_API_CITY: '/api/rajaongkir',
  REDIS_URL: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
  CATEGORY_LIST: [
    {
      title: 'Electronic',
      image:
        'https://down-id.img.susercontent.com/file/dcd61dcb7c1448a132f49f938b0cb553_tn',
      href: '/',
    },
    {
      title: 'Computer and Accessories',
      image:
        'https://down-id.img.susercontent.com/file/dcd61dcb7c1448a132f49f938b0cb553_tn',
      href: '/',
    },
    {
      title: 'Handphone and Accessories',
      image:
        'https://down-id.img.susercontent.com/file/dcd61dcb7c1448a132f49f938b0cb553_tn',
      href: '/',
    },
    {
      title: 'Handphone and Accessories',
      image:
        'https://down-id.img.susercontent.com/file/dcd61dcb7c1448a132f49f938b0cb553_tn',
      href: '/',
    },
    {
      title: 'Handphone and Accessories',
      image:
        'https://down-id.img.susercontent.com/file/dcd61dcb7c1448a132f49f938b0cb553_tn',
      href: '/',
    },
    {
      title: 'Handphone and Accessories',
      image:
        'https://down-id.img.susercontent.com/file/dcd61dcb7c1448a132f49f938b0cb553_tn',
      href: '/',
    },
    {
      title: 'Handphone and Accessories',
      image:
        'https://down-id.img.susercontent.com/file/dcd61dcb7c1448a132f49f938b0cb553_tn',
      href: '/',
    },
    {
      title: 'Handphone and Accessories',
      image:
        'https://down-id.img.susercontent.com/file/dcd61dcb7c1448a132f49f938b0cb553_tn',
      href: '/',
    },
    {
      title: 'Handphone and Accessories',
      image:
        'https://down-id.img.susercontent.com/file/dcd61dcb7c1448a132f49f938b0cb553_tn',
      href: '/',
    },
    {
      title: 'Handphone and Accessories',
      image:
        'https://down-id.img.susercontent.com/file/dcd61dcb7c1448a132f49f938b0cb553_tn',
      href: '/',
    },
    {
      title: 'Handphone and Accessories',
      image:
        'https://down-id.img.susercontent.com/file/dcd61dcb7c1448a132f49f938b0cb553_tn',
      href: '/',
    },
    {
      title: 'Handphone and Accessories',
      image:
        'https://down-id.img.susercontent.com/file/dcd61dcb7c1448a132f49f938b0cb553_tn',
      href: '/',
    },
    {
      title: 'Handphone and Accessories',
      image:
        'https://down-id.img.susercontent.com/file/dcd61dcb7c1448a132f49f938b0cb553_tn',
      href: '/',
    },
    {
      title: 'Handphone and Accessories',
      image:
        'https://down-id.img.susercontent.com/file/dcd61dcb7c1448a132f49f938b0cb553_tn',
      href: '/',
    },
    {
      title: 'Handphone and Accessories',
      image:
        'https://down-id.img.susercontent.com/file/dcd61dcb7c1448a132f49f938b0cb553_tn',
      href: '/',
    },
    {
      title: 'Handphone and Accessories',
      image:
        'https://down-id.img.susercontent.com/file/dcd61dcb7c1448a132f49f938b0cb553_tn',
      href: '/',
    },
    {
      title: 'Handphone and Accessories',
      image:
        'https://down-id.img.susercontent.com/file/dcd61dcb7c1448a132f49f938b0cb553_tn',
      href: '/',
    },
    {
      title: 'Handphone and Accessories',
      image:
        'https://down-id.img.susercontent.com/file/dcd61dcb7c1448a132f49f938b0cb553_tn',
      href: '/',
    },
    {
      title: 'Handphone and Accessories',
      image:
        'https://down-id.img.susercontent.com/file/dcd61dcb7c1448a132f49f938b0cb553_tn',
      href: '/',
    },
    {
      title: 'Handphone and Accessories',
      image:
        'https://down-id.img.susercontent.com/file/dcd61dcb7c1448a132f49f938b0cb553_tn',
      href: '/',
    },
    {
      title: 'Handphone and Accessories',
      image:
        'https://down-id.img.susercontent.com/file/dcd61dcb7c1448a132f49f938b0cb553_tn',
      href: '/',
    },
    {
      title: 'Handphone and Accessories',
      image:
        'https://down-id.img.susercontent.com/file/dcd61dcb7c1448a132f49f938b0cb553_tn',
      href: '/',
    },
    {
      title: 'Handphone and Accessories',
      image:
        'https://down-id.img.susercontent.com/file/dcd61dcb7c1448a132f49f938b0cb553_tn',
      href: '/',
    },
    {
      title: 'Handphone and Accessories',
      image:
        'https://down-id.img.susercontent.com/file/dcd61dcb7c1448a132f49f938b0cb553_tn',
      href: '/',
    },
    {
      title: 'Handphone and Accessories',
      image:
        'https://down-id.img.susercontent.com/file/dcd61dcb7c1448a132f49f938b0cb553_tn',
      href: '/',
    },
  ],
  URL_USER_ADDRESS_REGISTRATION: '/profile/addresses',
  URL_MERCHANT: '/merchant',
  GOOGLE_AUTH: `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/oauth/google`,
};

export default CONSTANTS;
