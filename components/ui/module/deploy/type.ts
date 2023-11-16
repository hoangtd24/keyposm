export type TypePosm = {
  id: number;
  brandId: number;
  campaignId: number;
  posmTypeName: string;
  posmTypeDescription: string;
  images: [
    {
      path: string;
    }
  ];
  quantity: number;
};

export type Location = {
  locationId: number;
  code: string;
  locationName: string;
  province: string;
  district: string;
  ward: string;
  address: string;
};

export type Province = {
  code: string;
  provinceName: string;
  provinceNameLatin: string;
};

export type Campaign = {
  id: number;
  campaignName: string;
  brandId: number;
};

export type Channel = {
  brandId: number;
  campaignId: number;
  channelCode: string;
  channelDescription: null | string;
  channelId: number;
  channelName: string;
  id: number;
  total: number;
  totalTransaction: number;
};

export type Area = {
  areaCode: string;
  areaDescription: null | string;
  areaId: number;
  areaName: string;
  campaignId: number;
  channelId: number;
  channelName: string;
  id: number;
  total: number;
  totalTransaction: number;
};

export type District = {
  districtName: string;
  districtNameLatin: string;
  provinceCode: string;
  provinceName: string;
};
