import axiosInstance from '@/lib/axiosInstance';

interface IRequestResetPasswordRequestPayload {
  email: string;
}

interface IResetPasswordRequestPayload {
  reset_code: string;
  password: string;
}

export const authClient = {
  async requestResetPassword(payload: IRequestResetPasswordRequestPayload) {
    return await axiosInstance({
      method: 'POST',
      url: '/auth/reset-password/request',
      data: payload,
    });
  },
  async resetPassword(payload: IResetPasswordRequestPayload) {
    return await axiosInstance({
      method: 'POST',
      url: '/auth/reset-password',
      data: payload,
    });
  },
  async logout() {
    return await axiosInstance({
      method: 'POST',
      url: '/auth/logout',
    });
  },
};
