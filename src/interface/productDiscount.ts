export interface IProductDiscountResponse {
  variant_group: {
    variant_group_1: {
      name: string;
      variant_types: string[];
    };
    variant_group_2: {
      name: string;
      variant_types: string[];
    };
  };
  variants: {
    variant_type1: string;
    variant_type2: string;
    discount: number;
  }[];
}
