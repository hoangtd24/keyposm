import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Head from "next/head";
import Script from "next/script";
import Link from "next/link";

export default function PageIntro() {
    return (
        <>
            <Head>
                <title>Keycom - Giới thiệu phần mềm</title>

            </Head>
            <Script
                src="https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js"
                strategy="lazyOnload"
            />
            <main className="w-full h-full relative">
                <header className="flex items-center justify-between px-3 lg:px-12 py-0 h-10 lg:h-14 bg-white dark:bg-background shadow-2xl lg:shadow-none w-full fixed top-0 left-0 z-50">
                    <div className="w-full flex justify-between items-center">
                        <picture>
                            <img src="/assets/logo/key-logo2.png" alt="logo" className="h-7 object-contain mr-4" />
                        </picture>
                        <Link href={`/login`}>
                        <Button className="px-0 md:px-4" variant={`link`}>Đăng nhập ngay !</Button>
                        </Link>
                    </div>
                </header>

                <div className="w-full lg:h-screen pt-10 lg:pt-14 px-3 lg:px-24 relative z-30">
                    <div className="w-full grid grid-cols-1 lg:grid-cols-6">
                        <div className="block lg:hidden lg:col-span-4">
                            <div dangerouslySetInnerHTML={
                                {
                                    __html: `
                                        <lottie-player 
                                            src="/assets/lottie/chart.json" 
                                            background="transparent" 
                                            speed="1" 
                                            style={{width: 100%, height: 100%}}
                                            direction="1" 
                                            mode="normal" 
                                            loop 
                                            autoplay>
                                        </lottie-player>
                                `
                                }
                            } />
                        </div>
                        <div className="w-full lg:col-span-2">
                            <div className="w-full flex flex-col items-start justify-center space-y-5 lg:space-y-16 lg:pt-40 text-center lg:text-left">
                                <div className="w-full text-center lg:text-left">
                                    <Label className="text-3xl lg:text-5xl font-bold text-primary dark:text-white">Giới thiệu phần mềm</Label>
                                </div>
                                <ul>
                                    <li className="h-10 flex items-center text-lg">- Quản lý chiến dịch</li>
                                    <li className="h-10 flex items-center text-lg">- Quét QR</li>
                                    <li className="h-10 flex items-center text-lg">- Quản lý triển khai</li>
                                    <li className="h-10 flex items-center text-lg">- Quản lý báo lỗi</li>
                                </ul>
                            </div>
                            <div className="hidden w-full lg:flex lg:flex-col items-center lg:items-start justify-center mt-10">
                                <input type="image" src="/assets/button/2.png" alt="logo" className="w-[200px] bg-center min-h-[80px] object-contain disabled:opacity-50" disabled />
                                <input type="image" src="/assets/button/1.png" alt="logo" className="w-[200px] bg-center min-h-[80px] object-contain disabled:opacity-50" disabled />
                            </div>
                            <div className="w-full flex lg:hidden items-center lg:items-start justify-center mt-10 lg:-ml-4 space-x-3">
                                <input type="image" src="/assets/button/2.png" alt="logo" className="w-[200px] bg-center min-h-[80px] object-contain disabled:opacity-50" disabled />
                                <input type="image" src="/assets/button/1.png" alt="logo" className="w-[200px] bg-center min-h-[80px] object-contain disabled:opacity-50" disabled />
                            </div>
                        </div>
                        <div className="hidden lg:block lg:col-span-4 lg:pl-32">
                            <div dangerouslySetInnerHTML={
                                {
                                    __html: `
                                            <lottie-player 
                                                src="/assets/lottie/chart.json" 
                                                background="transparent" 
                                                speed="1" 
                                                style={{width: 100%, height: 100%}}
                                                direction="1" 
                                                mode="normal" 
                                                loop 
                                                autoplay>
                                            </lottie-player>
                                    `
                                }
                            } />
                        </div>
                    </div>
                </div>
                <div className="w-full lg:h-screen pt-10 lg:pt-14 px-3 lg:px-24 relative z-30">
                    <div className="w-full grid grid-cols-1 lg:grid-cols-6">
                        <div className="block lg:hidden lg:col-span-4">
                            <div dangerouslySetInnerHTML={
                                {
                                    __html: `
                                        <lottie-player 
                                            src="/assets/lottie/qrscan.json" 
                                            background="transparent" 
                                            speed="1" 
                                            style={{width: 100%, height: 100%}}
                                            direction="1" 
                                            mode="normal" 
                                            loop 
                                            autoplay>
                                        </lottie-player>
                                `
                                }
                            } />
                        </div>
                        <div className="w-full lg:col-span-2">
                            <div className="w-full flex flex-col items-start justify-center space-y-5 lg:space-y-16 lg:pt-40 text-center lg:text-left">
                                <div className="w-full text-center lg:text-left space-y-5">
                                    <Label className="text-3xl lg:text-5xl font-bold text-primary dark:text-white">Quét QR</Label>
                                    <ul>
                                    <li className="h-10 flex items-center text-lg">- Sử dụng dễ dàng</li>
                                    {/* <li className="h-10 flex items-center text-lg">- Quét QR</li>
                                    <li className="h-10 flex items-center text-lg">- Quản lý triển khai</li>
                                    <li className="h-10 flex items-center text-lg">- Quản lý báo lỗi</li> */}
                                </ul>
                                </div>
                                {/* <p className="text-base lg:text-xl font-medium text-primary dark:text-white">Quản lý chiến dịch, nhân viên, sự cố, lắp đặt, tổng quan, địa điểm, QR Code, vùng, kênh, thương hiệu, thông báo</p> */}
                            </div>
                            
                        </div>
                        <div className="hidden lg:block lg:col-span-4 lg:pl-20">
                            <div dangerouslySetInnerHTML={
                                {
                                    __html: `
                                            <lottie-player 
                                                src="/assets/lottie/qrscan.json" 
                                                background="transparent" 
                                                speed="1" 
                                                style={{width: 100%, height: 100%}}
                                                direction="1" 
                                                mode="normal" 
                                                loop 
                                                autoplay>
                                            </lottie-player>
                                    `
                                }
                            } />
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}

export async function getServerSideProps(context: any) {
    const {
        uid,
    } = context.params;

    return {
        props: {
            uid
        }
    }
}

