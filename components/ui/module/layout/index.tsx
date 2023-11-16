"use client";
import React, { useState, useEffect, Suspense } from "react";
import { cn } from "@/lib/utils";
import { useAppSelector, useAppDispatch } from "@/lib/store";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { MenuIcon, PanelLeftClose, PanelLeftOpen, Users, Folders, Home } from "lucide-react";
// import { ModeToggle } from "@/components/ui/toggle-darkmode";
import { Button } from "@/components/ui/button";
import Loading from "@/components/ui/module/loading";
import Link from "next/link";
import jwtDecode from "jwt-decode";
import { useRouter } from "next/router";
import { listMenu, listMenuCampaign, MenuItem, listPage } from "./menu";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    IMAGE_URI
} from "@/config";
import Head from "next/head";

import {
    setMenuCollapsed
} from "@/lib/store/slices/menuSlice";
import ChangePassword from "@/components/ui/module/account/change-password";
import UpdateUser from "@/components/ui/module/account/change-info";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

// const brand_name = process.env.NEXT_PUBLIC_BRAND_NAME;
const token_storage: any = process.env.NEXT_PUBLIC_STORAGE_ACCESS_TOKEN as string;

type PageInfo = {
    title?: string;
    description?: string;
}

export default function Layout({
    children,
    pageInfo // will be a page or nested layout
}: {
    children: React.ReactNode;
    pageInfo?: PageInfo;
}) {
    const dispatch = useAppDispatch();

    const { access_token } = useAppSelector((state) => state.auth);

    const [collapsed, setCollapsed] = useState(false);
    // const [level, setLevel] = useState(0);
    const [loading, setLoading] = useState(false);
    const [isDenied, setIsDenied] = useState(false);
    const [listMenuPage, setListMenuPage] = useState<MenuItem[]>([]);
    const [infoUser, setInfoUser] = useState<any>(null);

    //update user
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [showUpdateUser, setShowUpdateUser] = useState(false);
    const [campaignId, setCampaignId] = useState<string>("0");
    const [roleId, setRoleId] = useState<number>(0);

    const router = useRouter();

    useEffect(() => {
        if (router.query.campaignId) {
            setCampaignId(router.query.campaignId as string);
        }
    }, [router.query])

    const getListMenu = (roleId: number, router: any) => {
        setLoading(true);

        let {
            // query: { campaignId },
            pathname,
        } = router;

        // console.log(campaignId, router);

        var promise = new Promise((resolve, reject) => {
            let menus: MenuItem[] = [];
            if (roleId === 1) {
                if (pathname.includes("[campaignId]")) {
                    // console.log("campaignId", campaignId);

                    menus = listMenuCampaign(campaignId).filter((item: MenuItem) => {
                        return item.roles.includes(roleId);
                    })

                    // menus.map((item: any) => {
                    //     item.path = item.path.replace("[campaignId]", campaignId);
                    // });
                    // console.log(menus);
                } else {
                    menus = listMenu.filter((item: MenuItem) => {
                        return item.roles.includes(roleId);
                    })
                }
            }
            if (roleId === 3 || roleId === 4) {
                if (pathname.includes("[campaignId]")) {
                    menus = listMenuCampaign(campaignId).filter((item: MenuItem) => {
                        return item.roles.includes(roleId);
                    })
                    // menus = listMenuCampaign.filter((item: MenuItem) => {
                    //     return item.roles.includes(roleId);
                    // })

                    // menus.map((item: any) => {
                    //     item.path = item.path.replace("[campaignId]", campaignId);
                    // });
                    // console.log(menus);
                } else {
                    menus = listMenu.filter((item: MenuItem) => {
                        return item.roles.includes(roleId);
                    })
                }
            }

            // console.log(menus);

            resolve(menus);
            if (menus.length === 0) {
                reject("error");
            }
        });

        return promise;
    }

    useEffect(() => {
        const token = localStorage.getItem(token_storage) ? localStorage.getItem(token_storage) : access_token;
        // console.log(token)
        if (token) {
            const decoded: any = jwtDecode(token);
            const info: any = decoded.data;

            const roleId = info.roleId;
            setInfoUser(info);
            // console.log(info);
            setRoleId(roleId);

            getListMenu(roleId, router)
                .then((data: any) => {
                    if (data && data.length > 0) {
                        setListMenuPage(data);
                        const page: any = data.find((item: MenuItem) => (item.path.includes(router.asPath) || item.paths?.includes(router.asPath)));
                        if (page && page.roles && !page.roles.includes(roleId)) {
                            setIsDenied(true);
                        } else {
                            setIsDenied(false);
                        }
                    }
                    setLoading(false);
                })
        } else {
            // if(router.pathname!=="[uid]")
            router.push("/login");
        }
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [access_token, router, campaignId])

    useEffect(() => {
        const isCollapse = localStorage.getItem("collapsed")
        if (isCollapse) {
            let collapseMenu = JSON.parse(isCollapse);
            console.log(collapseMenu);
            setCollapsed(collapseMenu);
            dispatch(setMenuCollapsed(collapseMenu));
        }
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])



    const onCollapse = (e: any) => {
        e.preventDefault();
        setCollapsed(!collapsed);
        dispatch(setMenuCollapsed(!collapsed));
        localStorage.setItem("collapsed", JSON.stringify(!collapsed));
    };

    const onLogout = () => {
        localStorage.clear();
        router.push("/login");
    }

    const renderBreadCrumb = (path: string, query: any) => {
        if (path === "/campaign" || path === "/[uid]")
            return null;
        else {
            let html: any = [
                <span key={-1} className="text-black/60">
                    <Home className="w-4 h-4" />
                </span>
            ]

            let arrPath = path.split("/");


            if ((path.includes("[campaignId]") && path.includes("[ticketId]")) || (path.includes("[campaignId]") && path.includes("[deployId]")) || (path.includes("[campaignId]") && path.includes("[locationId]"))) {
                arrPath.map((item: string, index: number) => {
                    let pageName: any = listPage.find((page: any) => page.path === item);
                    if (item === arrPath[arrPath.length - 1]) {
                        html.push(<Label key={index + 1} className="text-black">{pageName?.label}</Label>);
                    }

                    if (item === "campaign") {
                        html.push(<Label key={index} className="text-black/60">/</Label>);
                        html.push(
                            <Link href={`/${item}`} passHref className={
                                cn(
                                    roleId === 4 && "pointer-events-none"
                                )
                            }>
                                <Button variant={`link`} className="px-0 py-0 h-auto">
                                    <Label key={index + 1} className="text-black/60">{pageName?.label}</Label>
                                </Button>
                            </Link>
                        );
                    }
                    if (item === "deploy" || item === "ticket" || item === "location") {
                        html.push(<Label key={index} className="text-black/60">/</Label>);
                        html.push(
                            <Link href={`/campaign/${query.campaignId}/${item}`} passHref className={
                                cn(
                                    roleId === 4 && "pointer-events-none"
                                )
                            }>
                                <Button variant={`link`} className="px-0 py-0 h-auto">
                                    <Label key={index + 1} className="text-black/60">{pageName?.label}</Label>
                                </Button>
                            </Link>
                        );
                    }
                });
            } else {
                arrPath.map((item: string, index: number) => {
                    let pageName: any = listPage.find((page: any) => page.path === item);

                    if (item !== "" && !["[campaignId]", "[ticketId]", "[deployId]"].includes(item)) {
                        html.push(<Label key={index} className="text-black/60">/</Label>);

                        if (item === arrPath[arrPath.length - 1]) {
                            html.push(<Label key={index + 1} className="text-black">{pageName?.label}</Label>);
                        } else {
                            html.push(
                                <Link href={`/${item}`} passHref >
                                    <Button variant={`link`} className="px-0 py-0 h-auto">
                                        <Label key={index + 1} className="text-black/60">{pageName?.label}</Label>
                                    </Button>
                                </Link>
                            );
                        }
                    }

                });
            }



            return (
                <div className="w-full space-x-1 flex items-center my-2 text-sm">{html}</div>
            );
        }
    }

    return (
        <>
            {pageInfo && (
                <Head>
                    {pageInfo.title && <title>{pageInfo.title}</title>}
                    {pageInfo.description && (
                        <meta name="description" content={pageInfo.description} />
                    )}
                </Head>
            )}
            <section className="w-full min-h-screen flex relative bg-background md:bg-muted">
                <aside
                    className={cn(
                        "bg-foreground fixed h-screen w-0 dark:bg-background overflow-hidden z-30",
                        collapsed ? "lg:w-16" : "lg:w-64 "
                        // level === 0 ? "block" : "hidden"
                    )}
                >
                    <nav className="flex flex-col items-center h-full relative truncate">
                        <div className="w-full h-12 flex items-center justify-center text-3xl font-medium text-white ">
                            {collapsed ? (
                                <Button
                                    onClick={onCollapse}
                                    className="bg-foreground text-background border-current border-none hover:bg-foreground focus-visible:bg-foreground"
                                    variant={`outline`}
                                >
                                    <MenuIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:rotate-0 dark:scale-100" />
                                </Button>
                            ) : (
                                <picture>
                                    <img src="/assets/logo/key-logo1.png" alt="logo" className="absolute top-2 left-5 h-8 object-contain" />
                                </picture>
                            )}
                        </div>
                        <ul className="w-full h-[calc(100vh-96px)] py-5 space-y-2">
                            {listMenuPage.map((item: MenuItem, index: number) => {
                                // console.log(item.path, router.asPath)
                                return (
                                    <li key={index} className="w-full relative">
                                        <Link href={item.path} className={
                                            cn(
                                                "px-2 py-0.5 w-full h-full cursor-pointer inline-block group"
                                            )
                                        }>
                                            <div className={
                                                cn(
                                                    "flex items-center pointer-events-none px-3 py-1.5 ",
                                                    router.asPath === item.path ? "bg-background rounded-lg" : "group-hover:bg-muted-foreground group-hover:rounded-lg",
                                                )
                                            }>
                                                <div className={
                                                    cn(
                                                        "text-background group-hover:text-foreground",
                                                        router.asPath === item.path ? "text-foreground" : "text-background group-hover:text-foreground",
                                                        !collapsed && "mr-3",
                                                    )
                                                }>
                                                    <Label title={item.name}>
                                                        {item.icon}
                                                    </Label>
                                                </div>
                                                <Label className={
                                                    cn(
                                                        "text-lg hidden",
                                                        router.asPath === item.path ? "text-foreground" : "text-background group-hover:text-foreground",
                                                        !collapsed && "block",
                                                    )
                                                }>{item.name}</Label>
                                            </div>
                                        </Link>
                                    </li>
                                )
                            })}
                        </ul>
                        <div
                            className={cn(
                                "w-full h-12 flex items-center px-2",
                                collapsed ? "justify-center" : "justify-end"
                            )}
                        >
                            <Button
                                size={`icon`}
                                variant={`outline`}
                                className="bg-foreground text-background border-current border-none hover:bg-background"
                                onClick={onCollapse}
                            >
                                {collapsed ? (
                                    <PanelLeftOpen className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all  duration-200 dark:rotate-0 dark:scale-100" />
                                ) : (
                                    <PanelLeftClose className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100  dark:rotate-0 dark:scale-100" />
                                )}
                            </Button>
                        </div>
                    </nav>
                </aside>
                <div
                    className={cn(
                        "w-full relative",
                        collapsed ? "lg:pl-16" : "lg:pl-64"
                    )}
                >
                    <header className="flex items-center justify-between px-1 lg:px-2 py-0 h-10 lg:h-12 bg-white dark:bg-background relative shadow-sm lg:shadow-none">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="lg:hidden bg-transparent border-0 relative z-10 w-7 h-7 lg:w-9 lg:h-9"
                                >
                                    <MenuIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                                    <MenuIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-full sm:w-96 lg:hidden px-3 py-4">
                                <SheetHeader>
                                    <SheetTitle>
                                        <picture>
                                            <img src="/assets/logo/key-logo2.png" alt="logo" className="ml-3 h-7 object-contain" />
                                        </picture>
                                    </SheetTitle>
                                </SheetHeader>
                                <ul className="w-full h-[calc(100vh-96px)] py-5 space-y-2">
                                    {listMenuPage.map((item: MenuItem, index: number) => {
                                        return (
                                            <li key={index} className={cn(
                                                "w-full relative",
                                                router.asPath === item.path ? "bg-foreground rounded-lg text-background" : "text-foreground",
                                            )}>
                                                <Link href={item.path} className="px-3 py-2 w-full h-full cursor-pointer inline-block">
                                                    <div className="flex items-center pointer-events-none">
                                                        <div className="mr-2">{item.icon}</div>
                                                        <Label className={
                                                            cn(
                                                                "text-lg",
                                                                router.asPath === item.path ? "text-background" : "text-foreground",
                                                            )
                                                        }>{item.name}</Label>
                                                    </div>
                                                </Link>
                                            </li>
                                        )
                                    })}
                                </ul>
                            </SheetContent>
                        </Sheet>
                        <div className="hidden md:flex text-2xl px-2 h-full  items-center">
                            {collapsed && (
                                <div className="flex items-center">
                                    <picture>
                                        <img src="/assets/logo/key-logo2.png" alt="logo" className="h-7 object-contain mr-4" />
                                    </picture>
                                    {/* {campaignId && router.query && listProjectRecent.length > 0 && (
                                        <Select value={campaignId} onValueChange={(value) => { 
                                            let path = router.pathname;
                                            path.replace("[campaignId]", value);
                                            console.log(router.pathname) 
                                            router.push(path)
                                        }}>
                                            <SelectTrigger className="w-[300px] h-8 truncate px-2 border-none">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Chọn chiến dịch</SelectLabel>
                                                {listProjectRecent.map((item:any, index: number)=> {
                                                    return (
                                                        <SelectItem key={index} value={item.id.toString()}>{item.campaignName}</SelectItem>
                                                    )
                                                })}
                                                </SelectGroup>
                                                
                                            </SelectContent>
                                        </Select>
                                    )} */}
                                </div>
                            )}
                        </div>
                        <div className="md:hidden absolute w-full flex justify-center top-0 left-0 h-10 lg:h-12 items-center -z-10- text-xl font-bold pointer-events-none">
                            <picture>
                                <img src="/assets/logo/key-logo2.png" alt="logo" className="h-6 object-contain" />
                            </picture>
                        </div>
                        {loading ? (
                            <Skeleton className="w-7 h-7 lg:w-9 lg:h-9 rounded-full" />
                        ) : (
                            <div className="flex items-center">
                                <Popover>
                                    <PopoverTrigger>
                                        <div>
                                            <Avatar className="w-8 h-8 lg:w-9 lg:h-9">
                                                {infoUser?.avatar && (
                                                    <AvatarImage
                                                        src={`${IMAGE_URI}/${infoUser?.avatar}`}
                                                        alt={infoUser?.name}
                                                    />
                                                )}
                                                <AvatarFallback className="uppercase">{infoUser?.name.substring(0, 1)}</AvatarFallback>
                                            </Avatar>
                                        </div>
                                    </PopoverTrigger>
                                    <PopoverContent className="sm:max-w-[300px]">
                                        <div className="grid grid-cols-1 gap-2">
                                            <div>
                                                Tài khoản: <Label>{infoUser?.name}</Label>
                                            </div>
                                            <div className="mt-6">
                                                <Button onClick={() => setShowUpdateUser(true)} className="w-full" size={`sm`}>Cập nhật thông tin</Button>
                                            </div>
                                            <div>
                                                <Button onClick={() => setShowChangePassword(true)} className="w-full" variant={`ghost`} size={`sm`}>Đổi mật khẩu</Button>
                                            </div>
                                            <div>
                                                <Button onClick={onLogout} className="w-full" variant={`outline`} size={`sm`}>Đăng xuất</Button>
                                            </div>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                                {/* <ModeToggle /> */}

                            </div>
                        )}
                    </header>
                    <Suspense fallback={<Loading />}>
                        {!isDenied ? (
                            <main className='w-full h-[calc(100vh - 48px)] px-2 lg:px-4'>
                                {pageInfo && (
                                    <>
                                        {renderBreadCrumb(router.pathname, router.query)}
                                        <div className="w-full relative px-0 py-1 mb-2">
                                            <div className="space-y-1 flex flex-col">
                                                <Label className="text-lg lg:text-2xl">{pageInfo.title}</Label>
                                                <Label className="font-base text-xs text-black/60">{pageInfo.description}</Label>
                                            </div>
                                        </div>
                                    </>
                                )}
                                {children}
                            </main>) : (
                            <div className="px-4 py-8">Bạn không có quyền truy cập vào trang này.</div>
                        )}</Suspense>
                </div>
                <ChangePassword
                    open={showChangePassword}
                    onLogout={onLogout}
                    onClose={() => setShowChangePassword(false)}
                />

                <UpdateUser
                    info={infoUser}
                    open={showUpdateUser}
                    onLogout={onLogout}
                    onClose={() => setShowUpdateUser(false)}
                />
            </section>
        </>
    );
}
