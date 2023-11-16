/*api*/
import { SERVICE_URI } from "@/config";

export const NEXT_PUBLIC_API_LOGIN = `${SERVICE_URI}/login`;
export const NEXT_PUBLIC_API_REFRESH_TOKEN = `${SERVICE_URI}/refresh-token`;

/*user*/
export const NEXT_PUBLIC_LIST_USER_API = `${SERVICE_URI}/user/list`;
export const NEXT_PUBLIC_CREATE_USER_API = `${SERVICE_URI}/user/register`;
export const NEXT_PUBLIC_UPDATE_USER_API = `${SERVICE_URI}/user/update`;
export const NEXT_PUBLIC_CHANGE_PASSWORD_USER_API = `${SERVICE_URI}/user/changepassword`;

export const NEXT_PUBLIC_API_ADMIN_DETAIL_USER = `${SERVICE_URI}/user/detailuser`;
export const NEXT_PUBLIC_API_ADMIN_UPDATE_USER = `${SERVICE_URI}/user/adminupdate`;
export const NEXT_PUBLIC_API_ADMIN_DELETE_USER = `${SERVICE_URI}/user/del`;
export const NEXT_PUBLIC_API_ADMIN_RESET_PASSWORD = `${SERVICE_URI}/user/resetpassword`;

/*campaign*/
export const NEXT_PUBLIC_LIST_CAMPAIGN_API = `${SERVICE_URI}/campaign/list`;
export const NEXT_PUBLIC_CAMPAIGN_TYPE_API = `${SERVICE_URI}/campaign/list-type`;
export const NEXT_PUBLIC_LIST_CAMPAIGN_DROPDOWN_API = `${SERVICE_URI}/campaign/listfull`;
export const NEXT_PUBLIC_CREATE_CAMPAIGN_API = `${SERVICE_URI}/campaign/create`;
export const NEXT_PUBLIC_DETAIL_CAMPAIGN_API = `${SERVICE_URI}/campaign/detail`;
export const NEXT_PUBLIC_UPDATE_CAMPAIGN_API = `${SERVICE_URI}/campaign/update`;
export const NEXT_PUBLIC_DEL_CAMPAIGN_API = `${SERVICE_URI}/campaign/del`;

export const NEXT_PUBLIC_OVERVIEW_CAMPAIGN_API = `${SERVICE_URI}/campaign/overview`;

/*brand*/
export const NEXT_PUBLIC_LIST_BRAND_API = `${SERVICE_URI}/brand/list`;
export const NEXT_PUBLIC_CREATE_BRAND_API = `${SERVICE_URI}/brand/create`;
export const NEXT_PUBLIC_API_DETAIL_BRAND = `${SERVICE_URI}/brand/detail`;
export const NEXT_PUBLIC_API_UPDATE_BRAND = `${SERVICE_URI}/brand/update`;
export const NEXT_PUBLIC_API_DELETE_BRAND = `${SERVICE_URI}/brand/del`;

export const NEXT_PUBLIC_API_DROPDOWN_BRAND = `${SERVICE_URI}/brand/listfull`;

/*location*/
export const NEXT_PUBLIC_LIST_LOCATION_API = `${SERVICE_URI}/location/list`;
export const NEXT_PUBLIC_DETAIL_LOCATION_API = `${SERVICE_URI}/location/detail`;
export const NEXT_PUBLIC_CREATE_LOCATION_API = `${SERVICE_URI}/location/create`;
export const NEXT_PUBLIC_DELETE_LOCATION_API = `${SERVICE_URI}/location/del`;
export const NEXT_PUBLIC_DELETE_MULTIPLE_LOCATION_API = `${SERVICE_URI}/location/delmultiple`;
export const NEXT_PUBLIC_HISTORY_POSM_LOCATION_API = `${SERVICE_URI}/location/history`;
export const NEXT_PUBLIC_OVERVIEW_LOCATION_IN_CAMPAIGN_API = `${SERVICE_URI}/location/overview`;

export const NEXT_PUBLIC_LIST_LOCATION_ASSIGN_API = `${SERVICE_URI}/location/list-assign`;
export const NEXT_PUBLIC_USER_LOCATION_API = `${SERVICE_URI}/userlocation/list`;


export const NEXT_PUBLIC_LIST_PROVINCE_API = `${SERVICE_URI}/location/listprovince`;
export const NEXT_PUBLIC_LIST_LOCATION_IN_COMPAIGN_API = `${SERVICE_URI}/location/listincampaign`;

/*channel*/
export const NEXT_PUBLIC_CREATE_CHANNEL_API = `${SERVICE_URI}/channel/create`;
export const NEXT_PUBLIC_UPDATE_CHANNEL_API = `${SERVICE_URI}/channel/update`;
export const NEXT_PUBLIC_DELETE_CHANNEL_API = `${SERVICE_URI}/channel/del`;
export const LIST_CHANNEL_API = `${SERVICE_URI}/channel/list`;
export const RESTORE_CHANNEL_API = `${SERVICE_URI}/channel/restore`;
export const NEXT_PUBLIC_API_DROPDOWN_CHANNEL_BRAND = `${SERVICE_URI}/channel/listinbrand`;
export const NEXT_PUBLIC_API_DROPDOWN_CHANNEL_CAMPAIGN = `${SERVICE_URI}/channel/listincampaign`;

/*area*/
// export const NEXT_PUBLIC_LIST_AREA_API = `${SERVICE_URI}/area/list`
export const NEXT_PUBLIC_CREATE_AREA_API = `${SERVICE_URI}/area/create`;
export const NEXT_PUBLIC_UPDATE_AREA_API = `${SERVICE_URI}/area/update`;
export const NEXT_PUBLIC_DELETE_AREA_API = `${SERVICE_URI}/area/del`;
export const NEXT_PUBLIC_LIST_AREA_API = `${SERVICE_URI}/area/list`;
export const NEXT_PUBLIC_DETAIL_AREA_API = `${SERVICE_URI}/area/detail`;
export const RESTORE_AREA_API = `${SERVICE_URI}/area/restore`;
export const NEXT_PUBLIC_API_DROPDOWN_AREA_BRAND = `${SERVICE_URI}/area/listinbrand`;
export const NEXT_PUBLIC_API_DROPDOWN_AREA_CAMPAIGN = `${SERVICE_URI}/area/listincampaign`;

/*address(province, district)*/
export const NEXT_PUBLIC_LIST_ADDRESS_API = `${SERVICE_URI}/location/listprovince`;

/*campaign location*/
export const NEXT_PUBLIC_LIST_CAMPAIGN_LOCATION_API = `${SERVICE_URI}/location/list-in-campaign`;
export const NEXT_PUBLIC_SUMMARY_CAMPAIGN_LOCATION_API = `${SERVICE_URI}/location/list-in-campaign-summary`;

export const NEXT_PUBLIC_LOCATION_ASSIGN_CAMPAIGN_API = `${SERVICE_URI}/location/assignincampaign`;
export const NEXT_PUBLIC__DEL_LOCATION_ASSIGN_CAMPAIGN_API = `${SERVICE_URI}/location/delincampaign`;

/**user campaign */
export const NEXT_PUBLIC_LIST_USER_CAMPAIGN_API = `${SERVICE_URI}/usercampaign/list`;
export const NEXT_PUBLIC_LIST_USER_NOT_ASSIGN_CAMPAIGN_API = `${SERVICE_URI}/usercampaign/list-user`;
export const NEXT_PUBLIC_DEL_USER_CAMPAIGN_API = `${SERVICE_URI}/usercampaign/del`;
export const NEXT_PUBLIC_ASSIGN_USER_CAMPAIGN_API = `${SERVICE_URI}/usercampaign/create`;

/**QR CODE */
export const LIST_QRCODE_API = `${SERVICE_URI}/qrcode/list`;
export const DOWNLOAD_QRCODE_API = `${SERVICE_URI}/qrcode/generatelist`;
export const DETAIL_QRCODE_API = `${SERVICE_URI}/qrcode/detail`;
export const UPDATE_QRCODE_API = `${SERVICE_URI}/qrcode/update`;
export const CHECK_INFO_QRCODE_API = `${SERVICE_URI}/qrcode/checkinfo`;

/*role*/
export const NEXT_PUBLIC_API_DROPDOWN_ROLE = `${SERVICE_URI}/role/list`;

/*ticket*/
export const NEXT_PUBLIC_LIST_TICKET_API = `${SERVICE_URI}/ticket/list`;
export const LIST_TICKET_INCAMPAIGN_API = `${SERVICE_URI}/ticket/list-in-campaign`;
export const NEXT_PUBLIC_DETAIL_TICKET_API = `${SERVICE_URI}/ticket/detail`;
export const NEXT_PUBLIC_HISTORY_TICKET_API = `${SERVICE_URI}/tickethistory/list`;
export const NEXT_PUBLIC_DETAIL_HISTORY_TICKET_API = `${SERVICE_URI}/tickethistory/detail`;
export const NEXT_PUBLIC_DELETE_TICKET_API = `${SERVICE_URI}/ticket/del`;
export const NEXT_PUBLIC_CREATE_TICKET_API = `${SERVICE_URI}/ticket/create`;
export const NEXT_PUBLIC_LIST_STATUS_API = `${SERVICE_URI}/ticket/liststatus`;
export const NEXT_PUBLIC_UPDATE_TICKET_API = `${SERVICE_URI}/ticket/update`;

/*deploy*/
export const LIST_DEPLOY_API = `${SERVICE_URI}/deploy/list`;
export const CREATE_DEPLOY_API = `${SERVICE_URI}/deploy/create`;
export const SALE_CREATE_DEPLOY_API = `${SERVICE_URI}/deploy/saledeploy`;
export const SALE_UPDATE_DEPLOY_API = `${SERVICE_URI}/deploy/saleupdate`;
export const UPDATE_DEPLOY_API = `${SERVICE_URI}/deploy/update`;
export const DELETE_DEPLOY_API = `${SERVICE_URI}/deploy/del`;
export const LIST_DEPLOY_INCAMPAIGN_API = `${SERVICE_URI}/deploy/listincampaign`;
export const LIST_DEPLOY_INPOSM_API = `${SERVICE_URI}/deploy/listinposm`;
export const NEXT_PUBLIC_DETAIL_DEPLOY_API = `${SERVICE_URI}/deploy/detail`;
export const NEXT_PUBLIC_HISTORY_DEPLOY_API = `${SERVICE_URI}/deployhistory/list`;
export const NEXT_PUBLIC_HISTORY_DEPLOY_ACCEPT_API = `${SERVICE_URI}/deployhistory/accept`;
export const NEXT_PUBLIC_DETAIL_HISTORY_DEPLOY_API = `${SERVICE_URI}/deployhistory/detail`;

/*upload*/
export const NEXT_PUBLIC_UPLOAD_API = `${SERVICE_URI}/single`;
export const NEXT_PUBLIC_UPLOAD_MULTIPLE_API = `${SERVICE_URI}/multiple`;

/*storage(local storage/session storage)*/
export const NEXT_PUBLIC_STORAGE_ACCESS_TOKEN = `access-token`;
export const NEXT_PUBLIC_STORAGE_REFRESH_TOKEN = `refresh-token`;

// typePosm
export const NEXT_PUBLIC_LIST_TYPEPOSM_API = `${SERVICE_URI}/typeposm/list`;
export const NEXT_PUBLIC_LIST_TYPEPOSM_API_PAGE = `${SERVICE_URI}/typedefault/listpage`;
export const NEXT_PUBLIC_ADD_TYPEPOSM = `${SERVICE_URI}/typedefault/create`;
export const NEXT_PUBLIC_LIST_TYPE_POSM_DROPDOWN = `${SERVICE_URI}/typedefault/list`;

/*download*/
export const NEXT_PUBLIC_DOWNLOAD_TEMPLATE_LOCATION = `${SERVICE_URI}/report/template-location`;
export const NEXT_PUBLIC_DOWNLOAD_TEMPLATE_PROVINCES_DISTRICTS = `${SERVICE_URI}/report/template-province-district`;
export const NEXT_PUBLIC_DOWNLOAD_LOCATION = `${SERVICE_URI}/report/download-location`;
export const NEXT_PUBLIC_IMPORT_LOCATION = `${SERVICE_URI}/location/import`;

//location-campaign
export const NEXT_PUBLIC_CREATE_LIST_LOCATION_CAMPAIGN = `${SERVICE_URI}/locationcampaign/createMultiple`;

// map-location
export const NEXT_PUBLIC_MAPS_CAMPAIGN = `${SERVICE_URI}/location/overviewmap`;

