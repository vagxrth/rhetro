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
                        <Image
                            src={item.podcast[0]?.imageURL || item.imageURL}
                            alt='card'
                            fill
                            className='absolute size-full object-cover transition-transform duration-500 group-hover:scale-105'
                        />
                        {/* Gradient overlay */}
                        <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent' />

                        {/* Content */}
                        <div className='relative z-10 flex flex-col p-4'>
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
