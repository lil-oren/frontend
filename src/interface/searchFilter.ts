export interface IProvince {
  label: string;
  value: number;
}

export interface IDistrict {
  label: string;
  value: number;
}

export type SortOptions =
  | 'Lowest price'
  | 'Highest price'
  | 'Latest'
  | 'Oldest';

export interface ICategory {
  label: string;
  value: number;
}
