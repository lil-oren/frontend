import dayjs from 'dayjs';
import { Theme, ToastContent, TypeOptions, toast } from 'react-toastify';
import CONSTANTS from './constants/constants';
import { ICheckedCart } from './store/cart/useCart';

export class Utils {
  static convertPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    })
      .format(price)
      .slice(0, -3);
  };

  static isEmpty = (data: any) => {
    return data.length === 0 || data === '' || data === 0;
  };

  static notify = <Message extends ToastContent>(
    message: Message,
    type: TypeOptions,
    theme: Theme,
  ) => {
    toast(message, {
      type: type,
      position: toast.POSITION.TOP_RIGHT,
      theme: theme,
    });
  };

  static notifyTokenExp = () => {
    toast(CONSTANTS.TOKEN_HAS_EXPIRED, {
      type: 'info',
      position: toast.POSITION.TOP_RIGHT,
      theme: 'colored',
    });
  };

  static notifyGeneralError = (message: string) => {
    toast(message, {
      type: 'error',
      position: toast.POSITION.TOP_RIGHT,
      theme: 'colored',
    });
  };

  static isAllCartCheck = (isCheckedCarts: ICheckedCart[]) => {
    const check = isCheckedCarts.every((cart) => cart.is_checked === true);
    return check;
  };

  static handleGeneralError = (error: any) => {
    if (typeof error == 'string') {
      toast(error, {
        type: 'error',
        position: toast.POSITION.TOP_RIGHT,
        theme: 'colored',
      });
      return;
    }
    if (error.message) {
      toast(error.message, {
        type: 'error',
        position: toast.POSITION.TOP_RIGHT,
        theme: 'colored',
      });
      return;
    }
    if (error.response && error.response.data && error.response.data.message) {
      toast(error.response.data.message, {
        type: 'error',
        position: toast.POSITION.TOP_RIGHT,
        theme: 'colored',
      });
      return;
    }
    if (error.response && error.response.statusText) {
      toast(error.response.statusText, {
        type: 'error',
        position: toast.POSITION.TOP_RIGHT,
        theme: 'colored',
      });
      return;
    }
    toast('Uh-oh something went wrong!', {
      type: 'error',
      position: toast.POSITION.TOP_RIGHT,
      theme: 'colored',
    });
    return;
  };

  static getDate = (date: string) => {
    const d = new Date(date);
    const day = d.getDay();
    const month = d.getMonth();
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    const year = d.getFullYear();
    return `${day} ${months[month]} ${year}`;
  };

  static formatDateString = (
    dateStr: string,
    layoutFrom: string,
    layoutTo: string,
  ) => {
    const ddate = dayjs(dateStr, layoutFrom);
    return ddate.format(layoutTo);
  };

  static getDDMonthYYYYTime = (d: string) => {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    const date = new Date(d);
    let result: string = '';
    const day = date.getDay().toString();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const time = date.toLocaleTimeString('it-IT').slice(0, -3);
    result += day + ' ' + month + ' ' + year + ', ' + time;
    return result;
  };

  static getDateAndTime = (d: string) => {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    const days = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    const date = new Date(d);

    let result = '';
    const day = days[date.getDay()];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const time = date.toLocaleTimeString('US-id');
    result += day + ' ' + month + ' ' + year + ', ' + time;
    return result;
  };
}
