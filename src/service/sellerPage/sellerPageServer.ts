export class SellerPageServer {
  static get = async (url: string) => {
    try {
      console.log(url);
      const response = await fetch(url);
      if (!response.ok) {
        if (!response.ok) throw new Error(response.statusText);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
    }
  };
}
