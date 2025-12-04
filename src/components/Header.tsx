import Link from "next/link";

export default function Header() {
    return (
        <header className="w-full py-6 px-8 flex justify-between items-center z-50 relative">
            <div className="flex items-center gap-6">
                {/* Red Bull Logo */}
                <Link href="/" className="hover:opacity-90 transition-opacity">
                    <img
                        src="/redbull.svg"
                        alt="Red Bull"
                        className="h-12 md:h-16"
                    />
                </Link>

                <div className="h-8 w-[1px] bg-redbull-silver/50 hidden md:block"></div>

                {/* WebLab Logo */}
                <div className="flex items-center justify-center group cursor-pointer">
                    <img
                        src="/weblab.svg"
                        alt="WebLab"
                        className="h-10 md:h-14 w-auto"
                        style={{ filter: 'brightness(0) saturate(100%) invert(8%) sepia(10%) saturate(6871%) hue-rotate(203deg) brightness(91%) contrast(113%)' }}
                    />
                </div>
            </div>
        </header>
    );
}
