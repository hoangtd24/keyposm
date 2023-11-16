import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Head from "next/head";
import Script from "next/script";
import Link from "next/link";
import dynamic from 'next/dynamic';
// import L from 'leaflet';

const MapContainer = dynamic(
    () => import('react-leaflet').then((mod) => mod.MapContainer),
    { ssr: false }
)

const Popup = dynamic(
    () => import('react-leaflet').then((mod) => mod.Popup),
    { ssr: false }
);

const Marker = dynamic(
    () => import('react-leaflet/Marker').then((mod) => mod.Marker),
    { ssr: false }
);

const TileLayer = dynamic(
    () => import('react-leaflet').then((mod) => mod.TileLayer),
    { ssr: false }
);

export default function PageIntro() {
    return (
        <>
            <Head>
                <title>Keycom - Giới thiệu phần mềm</title>
            </Head>
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
                <div className="w-full h-screen pt-10 lg:pt-14 px-3 lg:px-24 relative z-30">
                    <MapContainer className="w-full h-full" center={[10.7579789,106.6905602]} zoom={25}>
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={[10.7579789,106.6905602]}>
                            <Popup className="w-80">
                                <picture>
                                    <img src="/assets/logo/key-logo2.png" alt="logo" className="h-7 object-contain mr-4" />
                                    <img src="/assets/logo/key-logo2.png" alt="logo" className="h-7 object-contain mr-4" />
                                    <img src="/assets/logo/key-logo2.png" alt="logo" className="h-7 object-contain mr-4" />
                                    <img src="/assets/logo/key-logo2.png" alt="logo" className="h-7 object-contain mr-4" />
                                </picture>
                            </Popup>
                        </Marker>
                        <Marker position={[10.758477943187994, 106.69068774485444]}>
                            <Popup>
                                A pretty CSS3 popup. <br /> Easily customizable.
                            </Popup>
                        </Marker>
                        <Marker position={[10.757506514490446, 106.69219647386223]}>
                            <Popup>
                                A pretty CSS3 popup. <br /> Easily customizable.
                            </Popup>
                        </Marker>
                        <Marker position={[10.758990587005734, 106.68960869349225]}>
                            <Popup>
                                A pretty CSS3 popup. <br /> Easily customizable.
                            </Popup>
                        </Marker>
                        <Marker position={[10.757423574635528, 106.69047923661405]}>
                            <Popup>
                                A pretty CSS3 popup. <br /> Easily customizable.
                            </Popup>
                        </Marker>
                    </MapContainer>,
                </div>
            </main>
        </>
    )
}

