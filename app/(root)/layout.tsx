import LeftSidebar from "@/components/LeftSidebar";
import MobileNavigation from "@/components/MobileNavigation";
import RightSidebar from "@/components/RightSidebar";
import Image from "next/image";
import { Toaster } from "@/components/ui/toaster"
import PodcastPlayer from "@/components/PodcastPlayer";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative flex flex-col">
        <main className="relative flex bg-black-3">
            <LeftSidebar />
            <section className="flex min-h-screen flex-1 flex-col px-6 sm:px-10 lg:px-14">
              <div className="mx-auto flex w-full max-w-6xl flex-col max-sm:px-4">
                <div className="flex h-16 items-center justify-between md:hidden">
                  <div className='flex items-center gap-2'>
                    <div className='flex items-center justify-center w-8 h-8 rounded-lg bg-purple-1'>
                      <Image src="/icons/rhetro.png" width={18} height={18} alt="logo" className='brightness-200'/>
                    </div>
                    <span className='text-[20px] font-bold text-white-1'>Rhetro</span>
                  </div>
                  <MobileNavigation />
                </div>
                <div className="flex flex-col pb-20 md:pb-14">
                  <Toaster />
                  {children}
                </div>
              </div>
            </section>
            <RightSidebar />
        </main>
        <PodcastPlayer />
    </div>
  );
}
