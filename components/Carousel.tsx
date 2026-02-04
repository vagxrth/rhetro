import React, { useCallback } from 'react'
import { EmblaOptionsType, EmblaCarouselType } from 'embla-carousel'
import { DotButton, useDotButton } from './EmblaCarouselDotButton'
import Autoplay from 'embla-carousel-autoplay'
import useEmblaCarousel from 'embla-carousel-react'
import { CarouselProps } from '@/types'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import LoaderSpinner from './LoaderSpinner'

const EmblaCarousel = ({ podcasters }: CarouselProps) => {
    const router = useRouter();

    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay()])

    const onNavButtonClick = useCallback((emblaApi: EmblaCarouselType) => {
        const autoplay = emblaApi?.plugins()?.autoplay
        if (!autoplay || !("stopOnInteraction" in autoplay.options)) return

        const resetOrStop =
            autoplay.options.stopOnInteraction === false
                ? (autoplay.reset as () => void)
                : (autoplay.stop as () => void)

        resetOrStop()
    }, [])

    const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(
        emblaApi,
        onNavButtonClick
    )

    const slides = podcasters && podcasters?.filter((item: any) => item.totalPodcasts > 0)

    if (!slides) return <LoaderSpinner />

    return (
        <section className="flex w-full flex-col gap-4 overflow-hidden" ref={emblaRef}>
            <div className='flex'>
                {slides.slice(0, 5).map((item) => (
                    <figure
                        key={item._id}
                        className='carousel_box group'
                        onClick={() => router.push(`/podcasts/${item.podcast[0]?.podcastId}`)}
                    >
                        {/* Thumbnail */}
                        <div className='relative w-full aspect-square overflow-hidden'>
                            <Image
                                src={item.podcast[0]?.imageURL || item.imageURL}
                                alt='card'
                                fill
                                className='absolute size-full object-cover'
                            />
                            {/* Gradient fade at bottom */}
                            <div className='absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#1a1a1c] to-transparent' />
                        </div>

                        {/* Content */}
                        <div className='bg-[#1a1a1c] px-4 pb-4 flex flex-col'>
                            <h2 className='text-[14px] font-semibold text-white-1 truncate'>
                                {item.podcast[0]?.podcastTitle}
                            </h2>
                            <p className='text-[12px] text-gray-1'>
                                {item.name}
                            </p>
                        </div>
                    </figure>
                ))}
            </div>

            {/* Pagination dots */}
            <div className="flex justify-center gap-2">
                {scrollSnaps.map((_, index) => (
                    <DotButton
                        key={index}
                        onClick={() => onDotButtonClick(index)}
                        selected={index === selectedIndex}
                    />
                ))}
            </div>
        </section>
    )
}

export default EmblaCarousel
