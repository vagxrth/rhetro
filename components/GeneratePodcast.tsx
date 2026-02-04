import { GeneratePodcastProps } from '@/types'
import React, { useState } from 'react'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Button } from './ui/button'
import { Loader } from 'lucide-react'
import { useAction, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { v4 as uuidv4 } from 'uuid'
import { useUploadFiles } from '@xixixao/uploadstuff/react'
import { useToast } from "@/components/ui/use-toast"


const useGeneratePodcast = ({ setAudio, voiceType, voicePrompt, setAudioStorageId }: GeneratePodcastProps) => {

    const [generating, setGenerating] = useState(false);

    const { toast } = useToast()

    const generateUploadURL = useMutation(api.files.generateUploadURL);

    const { startUpload } = useUploadFiles(generateUploadURL);

    const getPodcastAudio = useAction(api.elevenlabs.generateAudio);

    const getAudioURL = useMutation(api.podcasts.getURL);

    const generatePodcast = async () => {
        setGenerating(true);
        setAudio('');

        if (!voicePrompt) {
            toast({
                title: "Please provide a prompt to create a podcast",
            })
            return setGenerating(false);
        }

        try {
            const response = await getPodcastAudio({ voice: voiceType, input: voicePrompt })

            const blob = new Blob([response], { type: 'audio/mpeg' });
            const fileName = `podcast-${uuidv4()}.mp3`;
            const file = new File([blob], fileName, { type: 'audio/mpeg' });

            const uploaded = await startUpload([file]);
            const storageId = (uploaded[0].response as any).storageId;

            setAudioStorageId(storageId);

            const audioURL = await getAudioURL({ storageId });
            setAudio(audioURL!);
            setGenerating(false);
            toast({
                title: "Podcast created successfully",
            })
        } catch (error) {
            console.log("Error creating the podcast", error);
            toast({
                title: "Error creating the podcast",
                variant: 'destructive'
            })
            setGenerating(false);
        }
    }

    return {
        generating,
        generatePodcast
    }
}

const GeneratePodcast = (props: GeneratePodcastProps) => {

    const { generating, generatePodcast } = useGeneratePodcast(props);

    return (
        <div className='flex flex-col gap-5'>
            <div className='flex flex-col gap-3'>
                <Label className='text-[15px] font-semibold text-white-1'>
                    Prompt to generate podcast
                </Label>
                <Textarea
                    className='input-class font-normal focus-visible:ring-purple-1 focus-visible:ring-1 focus-visible:ring-offset-0 min-h-[140px]'
                    placeholder='Enter text to generate podcast...'
                    rows={5}
                    value={props.voicePrompt}
                    onChange={(e) => props.setVoicePrompt(e.target.value)}
                />
            </div>
            <div className='w-full max-w-[200px]'>
                <Button
                    type="button"
                    className="bg-purple-1 hover:bg-purple-2 text-white-1 font-semibold rounded-full h-10 px-6 transition-all duration-200 shadow-button text-[14px]"
                    onClick={generatePodcast}
                >
                    {generating ? (
                        <>
                            Generating
                            <Loader size={16} className="animate-spin ml-2" />
                        </>
                    ) : (
                        <>
                            <svg className='w-4 h-4 mr-1.5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z' />
                            </svg>
                            Generate
                        </>
                    )}
                </Button>
            </div>
            {props.audio && (
                <div className='mt-2 p-4 bg-black-2 rounded-apple-lg border border-black-4'>
                    <audio
                        controls
                        src={props.audio}
                        autoPlay
                        className='w-full'
                        onLoadedMetadata={(e) => props.setAudioDuration(e.currentTarget.duration)}
                    />
                </div>
            )}
        </div>
    )
}

export default GeneratePodcast
