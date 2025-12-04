import Image from "next/image";

export default function Footer() {
    return (
        <footer className="w-full py-12 px-8 flex flex-wrap justify-center items-center gap-8 md:gap-16 z-50 relative mt-auto bg-redbull-navy text-white">
            {/* Red Bull Logo */}
            <div className="opacity-90 hover:opacity-100 transition-opacity">
                <img
                    src="/redbull.svg"
                    alt="Red Bull"
                    className="h-10 md:h-14 object-contain"
                />
            </div>

            {/* WebLab Logo */}
            <div className="opacity-90 hover:opacity-100 transition-opacity">
                <img
                    src="/weblab.svg"
                    alt="WebLab"
                    className="h-10 md:h-14 object-contain"
                    style={{ filter: 'brightness(0) invert(1)' }}
                />
            </div>

            {/* SkyLab Logo */}
            <div className="opacity-90 hover:opacity-100 transition-opacity">
                <img
                    src="/skylab.png"
                    alt="SkyLab"
                    className="h-10 md:h-14 object-contain"
                />
            </div>

            {/* YTU Logo */}
            <div className="opacity-90 hover:opacity-100 transition-opacity">
                <img
                    src="/ytu.svg"
                    alt="YTU"
                    className="h-12 md:h-16 object-contain"
                    style={{ filter: 'brightness(0) invert(1)' }}
                />
            </div>
        </footer>
    );
}
