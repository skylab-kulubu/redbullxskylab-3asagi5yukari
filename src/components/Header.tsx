import Link from "next/link";

export default function Header() {
    return (
        <header className="w-full py-6 px-8 flex justify-center items-center z-50 relative">
            <div className="flex items-center gap-4 md:gap-8">
                {/* Red Bull Logo */}
                <Link href="/" className="hover:opacity-90 transition-opacity">
                    <img
                        src="/redbull.svg"
                        alt="Red Bull"
                        className="h-8 md:h-10"
                    />
                </Link>
            </div>
        </header>
    );
}
