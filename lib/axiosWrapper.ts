import axios from "axios";
import * as enums from "@/lib/enums";
import { NEXT_PUBLIC_API_REFRESH_TOKEN } from "@/config/api";
import { SERVICE_URI } from "@/config";

const access_token: any = process.env.NEXT_PUBLIC_STORAGE_ACCESS_TOKEN;
const refresh_token: any = process.env.NEXT_PUBLIC_STORAGE_REFRESH_TOKEN;

let axiosInstance = axios.create({
    baseURL: SERVICE_URI,
});

const getAccessToken = () => {
    let accessToken: any = localStorage.getItem(access_token);
    if (accessToken) {
        return accessToken;
    }

    return null;
};

const getRefreshToken = () => {
    let refreshToken: any = localStorage.getItem(refresh_token);
    if (refreshToken) {
        return refreshToken;
    }

    return null;
};

const refreshToken = async () => {
    const refreshTokenString = getRefreshToken();

    if (refreshTokenString) {
        let request = {
            url: NEXT_PUBLIC_API_REFRESH_TOKEN,
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            data: JSON.stringify({
                refreshToken: refreshTokenString,
            }),
        };
        return new Promise((resolve, reject) => {
            axiosInstance(request)
                .then(async (response) => {
                    if (
                        response &&
                        response.data &&
                        response.data.status === enums.STATUS_RESPONSE_FORBIDDEN
                    ) {
                        localStorage.removeItem(access_token);
                        localStorage.removeItem(refresh_token);
                        window.location.href = "/login";
                    }
                    return resolve(response.data);
                })
                .catch((e) => {
                    //  console.log(e);
                    return reject(e);
                });
        });
    }

    window.location.href = "/login";
};

axiosInstance.interceptors.response.use(
    async (response: any) => {
        // console.log(response)

        return response;
    },
    (error: any) => {
        console.log(error);
        if (
            error &&
            error.response &&
            error.response.status === enums.STATUS_RESPONSE_UNAUTHORIZED
        ) {
            console.log(error.response.status);

            return refreshToken().then(async (res: any) => {
                if (
                    res &&
                    res.data &&
                    res.data.status === enums.STATUS_RESPONSE_FORBIDDEN
                ) {
                    // localStorage.removeItem("persist:auth");
                    localStorage.removeItem(access_token);
                    localStorage.removeItem(refresh_token);
                    window.location.href = "/login";
                }

                let config = res.config;
                const { accesstoken, refreshtoken } = res.data;
                config.headers["Content-Type"] = "application/json";
                config.headers["Authorization"] = accesstoken;
                let accessToken = localStorage.getItem(access_token);
                if (accessToken) {
                    localStorage.setItem(access_token, accesstoken);
                }

                let refreshToken = localStorage.getItem(refresh_token);
                if (refreshToken) {
                    localStorage.setItem(refresh_token, refreshtoken);
                }

                return new Promise((resolve, reject) => {
                    axios
                        .request(config)
                        .then((res) => resolve(res))
                        .catch((e) => reject(e));
                });
            });
        }
        return Promise.reject(error);
    }
);

export async function axiosWithHeadersNoToken(
    verb: string,
    url: string | undefined,
    data: any
) {
    let request: any = {
        url: url,
        method: verb,
        headers: {
            "Content-Type": "application/json",
        },
        data: JSON.stringify(data),
    };

    if (verb.toLowerCase() === "post") {
        if (data) {
            request.data = JSON.stringify(data);
        }
    }

    // console.log(request);

    if (verb.toLowerCase() === "get") {
        if (data) request.params = data;
    }
    // console.log(request);
    return await axiosInstance(request);
}

export async function axiosWithHeaders(verb: string, url: string, data: any) {
    let token = getAccessToken();
    // console.log(token);

    // if (!token) {
    //     window.location.href = "/login";
    //     return;
    // }

    let request: any = {
        url: url,
        method: verb,
        headers: {
            "Content-Type": "application/json",
            Authorization: token,
        },
    };

    if (verb.toLowerCase() === "post") {
        if (data) {
            request.data = JSON.stringify(data);
        }
    }

    if (verb.toLowerCase() === "get") {
        if (data) request.params = data;
    }

    // console.log(request);
    return await axiosInstance(request);
}

export async function axiosWithHeadersUploadFile(
    verb: string,
    url: string | undefined,
    data: any
) {
    // axiosInstance.defaults.headers.common['Content-Type'] = '';

    let request: any = {
        url: url,
        method: verb,
        headers: {
            "Content-Type": "multipart/form-data",
        },
        data: data,
    };

    return await axiosInstance(request);
}
