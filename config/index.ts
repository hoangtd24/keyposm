const api_url = process.env.NEXT_PUBLIC_API_URL as string;
const image_url = process.env.NEXT_PUBLIC_IMAGE_URL as string;

export function GetURL() {
  var environment = 1;
  var baseUrlLink = "http://localhost:4064/api";
  switch (environment) {
    case 0:
      baseUrlLink = "http://localhost:4064/api";
      break;
    case 1:
      baseUrlLink = api_url;
      break;
    case 2:
      baseUrlLink = "https://api-keycheck.tcgh.com.vn/api";
      break;
    default:
      baseUrlLink = "";
      break;
  }
  return baseUrlLink;
}

export const SERVICE_URI = GetURL();
// console.log(SERVICE_URI)
export const IMAGE_URI = image_url;

export const defaultPaging = {
  enabled: true,
  pageIndex: 0,
  pageSize: 50,
  pagesCount: 0,
  pageSizes: [50, 100, 200],
};
