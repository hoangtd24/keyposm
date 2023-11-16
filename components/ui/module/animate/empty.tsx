import Script from "next/script";
export default function EmptyAnimation() {
    return (
        <>
            <Script
                src="https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js"
                strategy="lazyOnload"
            />
            <div dangerouslySetInnerHTML={
                {
                    __html: `
                            <lottie-player 
                                src="/assets/lottie/empty.json" 
                                background="transparent" 
                                speed="1" 
                                style={{width: 160, height: 160}}
                                direction="1" 
                                mode="normal" 
                                loop 
                                autoplay>
                            </lottie-player>
                    `
                }
            } />
        </>
    )
} 