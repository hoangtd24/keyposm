"use client";

import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import * as enums from "@/lib/enums"
import { axiosWithHeadersNoToken } from "@/lib/axiosWrapper";
import { useAppSelector, useAppDispatch } from "@/lib/store";
import { setAccessToken, setRefreshToken } from "@/lib/store/slices/authSlice";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/router";
import jwt_decode from "jwt-decode";
import { NEXT_PUBLIC_API_LOGIN } from "@/config/api";

const access_token: any = process.env.NEXT_PUBLIC_STORAGE_ACCESS_TOKEN;
const refresh_token: any = process.env.NEXT_PUBLIC_STORAGE_REFRESH_TOKEN;
const brand_name = process.env.NEXT_PUBLIC_BRAND_NAME;

export default function ClientLogin() {
    const { toast } = useToast()
    const dispatch = useAppDispatch();
    const auth = useAppSelector((state) => state.auth);
    const router = useRouter();

    const [loading, setLoading] = useState(false)

    const formSchema = z.object({
        username: z.string().min(1, {
            message: "Tài khoản không được để trống !",
        }),
        password: z.string().min(1, {
            message: "Mật khẩu không được để trống !",
        }),
    })



    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        setLoading(true);
        await axiosWithHeadersNoToken("post", `${NEXT_PUBLIC_API_LOGIN}`, values)
            .then((response: any) => {
                // console.log(response);
                if (response && response.data && response.status === enums.STATUS_RESPONSE_OK) {
                    //  console.log(response.data);
                    const {
                        status,
                        message,
                        accessToken,
                        refreshToken,
                    } = response.data;
                    if (status === enums.STATUS_RESPONSE_OK) {
                        dispatch(setAccessToken(accessToken));
                        dispatch(setRefreshToken(refreshToken));
                        localStorage.setItem(access_token, accessToken);
                        localStorage.setItem(refresh_token, refreshToken);
                        // console.log(jwt_decode(accessToken));
                        if (accessToken) {
                            let decode: any = jwt_decode(accessToken);
                            let info = decode.data;
                            const {
                                roleId
                            } = info;
                            // console.log(info)
                            if (roleId === 1 || roleId === 2 || roleId === 3) {
                                router.push("/campaign");
                            }

                            if (roleId === 4 || roleId === 5) {
                                router.push("/scanqr");
                            }
                            // console.log(info);
                            setLoading(false);
                        }
                        // 
                    }
                    else {
                        toast({
                            title: "Lỗi",
                            description: message,
                        })
                        setLoading(false);
                    }
                }
            })
            .catch((error: any) => {
                console.log(error);
                setLoading(false);
            })
    }




    return (
        <main className="w-full h-full flex items-center justify-center bg-background md:bg-foreground">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full sm:max-w-[400px] space-y-8 bg-background px-6 py-8 rounded-md mb-6">
                    <div className="w-full py-4 text-center flex justify-center">
                        <picture>
                            <img src="/assets/logo/key-logo2.png" alt="logo" className="h-6 object-contain" />
                        </picture>
                    </div>
                    <div className="w-full text-center">
                        <Label className="text-xl">{brand_name}</Label>
                    </div>
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tài khoản</FormLabel>
                                <FormControl>
                                    <Input placeholder="Tài khoản" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Mật khẩu</FormLabel>
                                <FormControl>
                                    <Input placeholder="Mật khẩu" {...field} type="password" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="w-full text-center py-4 mt-8">
                        <Button type="submit" size={`lg`} disabled={loading}>{
                            loading ? <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg> Đang đăng nhập ...
                            </> : "Đăng nhập"
                        }</Button>
                    </div>
                </form>
            </Form>
        </main>
    )
} 