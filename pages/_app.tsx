import '@/styles/globals.css';
import 'ka-table/style.css';
import "leaflet/dist/leaflet.css";
// import "leaflet/dist/leaflet.css";

import { Provider } from 'react-redux';
import store from '@/lib/store';
import type { AppProps } from 'next/app';
import { Toaster } from "@/components/ui/toaster"
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Loading from '@/components/ui/module/loading';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    router.events.on("routeChangeError", (e) => setLoading(false));
    router.events.on("routeChangeStart", (e) => setLoading(true));
    router.events.on("routeChangeComplete", (e) => setLoading(false));

    return () => {
      router.events.off("routeChangeError", (e) => setLoading(false));
      router.events.off("routeChangeStart", (e) => setLoading(true));
      router.events.off("routeChangeComplete", (e) => setLoading(false));
    };
  }, [router.events]);

  // console.log(loading);

  if (loading) {
    return (
      <div className='flex flex-col w-full min-h-screen items-center justify-center'>
        <Loading />
      </div>
    );
  }

  return (
    <Provider store={store}>
      <Component {...pageProps} />
      <Toaster />
    </Provider>
  )
}
