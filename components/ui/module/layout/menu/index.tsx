import { Bug, Users, BookCopy, Trello, Store, Cog, Map, Tv, QrCode, BarChart, Bell, Warehouse, LayoutDashboard  } from "lucide-react"
import React from "react";

export type MenuItem = {
    id: number;
    name: string;
    path: string;
    icon?: React.ReactNode;
    children?: MenuItem[];
    paths?: string[];
    roles: number[]
}

export const listMenu: MenuItem[] = [
    {
        id: 1,
        name: "Chiến dịch",
        path: "/campaign",
        icon: <BookCopy />,
        roles: [1, 3],
    },
    {
        id: 2,
        name: "Quét Mã",
        path: "/scanqr",
        icon: <QrCode />,
        roles: [1, 2, 4]
    },
    // {
    //     id: 3,
    //     name: "Sự cố",
    //     path: "/ticket",
    //     icon: <Bug />,
    //     roles: [1, 3, 4]
    // },
    // {
    //     id: 4,
    //     name: "Lắp đặt",
    //     path: "/deploy",
    //     icon: <Cog />,
    //     roles: [1, 2, 3, 4]
    // },
    {
        id: 5,
        name: "Nhân viên",
        path: "/user",
        icon: <Users />,
        roles: [1]
    },
    {
        id: 6,
        name: "Thương hiệu",
        path: "/brand",
        icon: <Trello />,
        roles: [1]
    },
    {
        id: 7,
        name: "Kênh",
        path: "/channel",
        icon: <Tv />,
        roles: [1]
    },
    {
        id: 8,
        name: "Vùng",
        path: "/area",
        icon: <Map />,
        roles: [1]
    },

    {
        id: 9,
        name: "Địa điểm",
        path: "/location",
        icon: <Store />,
        roles: [1, 2]
    },
    {
        id: 10,
        name: "Thông báo",
        path: "/notification",
        icon: <Bell />,
        roles: [1, 2, 3, 4]
    },

]

export const listMenuCampaign = (campaignId: string): MenuItem[] => {
    return [
        {
            id: 0,
            name: "Thống kê",
            path: `/campaign/${campaignId}/dashboard`,
            icon: <LayoutDashboard  />,
            roles: [1, 2],
        },
        {
            id: 1,
            name: "Tổng quan",
            path: `/campaign/${campaignId}/overview`,
            icon: <BarChart />,
            roles: [1, 2, 3],
        },
        {
            id: 2,
            name: "Lắp đặt",
            path: `/campaign/${campaignId}/deploy`,
            icon: <Cog />,
            roles: [1, 2, 3],
        },
        {
            id: 5,
            name: "Sự cố",
            path: `/campaign/${campaignId}/ticket`,
            icon: <Bug />,
            roles: [1, 2, 3],
        },
        {
            id: 3,
            name: "Địa điểm",
            path: `/campaign/${campaignId}/location`,
            icon: <Store />,
            roles: [1, 2, 3],
        },
        {
            id: 3,
            name: "Chỉ định địa điểm",
            path: `/campaign/${campaignId}/location/assign`,
            icon: <Warehouse  />,
            roles: [1, 2],
        },
        {
            id: 4,
            name: "QR Code",
            path: `/campaign/${campaignId}/qrcode`,
            icon: <QrCode />,
            roles: [1],
        },

        {
            id: 6,
            name: "Nhân viên",
            path: `/campaign/${campaignId}/user`,
            icon: <Users />,
            roles: [1],
        },
        
        {
            id: 7,
            name: "Quét Mã",
            path: "/scanqr",
            icon: <QrCode />,
            roles: [4]
        },
        {
            id: 8,
            name: "Sự cố",
            path: "/ticket",
            icon: <Bug />,
            roles: [4]
        },
        {
            id: 9,
            name: "Lắp đặt",
            path: "/deploy",
            icon: <Cog />,
            roles: [4]
        },
        {
            id: 10,
            name: "Thông báo",
            path: "/notification",
            icon: <Bell />,
            roles: [4]
        },
        {
            id: 11,
            name: "Nhân viên bán hàng",
            path: `/campaign/${campaignId}/sales`,
            icon: <Warehouse  />,
            roles: [1, 2],
        },
        
    ]
}

// export const listMenuCampaign: MenuItem[] = [

// ]

export type Page = {
    id: number;
    path: string;
    label: string;
}

export const listPage: Page[] = [
    {
        id: 0,
        path: "campaign",
        label: "Chiến dịch",
    },
    {
        id: 1,
        path: "user",
        label: "Nhân viên",
    },
    {
        id: 2,
        path: "ticket",
        label: "Sự cố",
    },
    {
        id: 3,
        path: "deploy",
        label: "Lắp đặt",
    },
    {
        id: 4,
        path: "overview",
        label: "Tổng quan",
    },
    {
        id: 5,
        path: "location",
        label: "Địa điểm",
    },
    {
        id: 6,
        path: "qrcode",
        label: "QR Code",
    },
    {
        id: 8,
        path: "area",
        label: "Vùng",
    },
    {
        id: 9,
        path: "channel",
        label: "Kênh",
    },
    {
        id: 10,
        path: "brand",
        label: "Thương hiệu",
    },
    {
        id: 11,
        path: "notification",
        label: "Thông báo",
    },
    {
        id: 12,
        path: "scanqr",
        label: "Quét QR",
    },
    {
        id: 12,
        path: "typeposm",
        label: "Loại POSM",
    },
    {
        id: 13,
        path: "assign",
        label: "Chỉ định",
    },
    {
        id: 14,
        path: "sales",
        label: "Nhân viên bán hàng",
    },
    {
        id: 15,
        path: "dashboard",
        label: "Thống kê",
    }
]
