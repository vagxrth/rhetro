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


const useGeneratePodcast = ({setAudio, voiceType, voicePrompt, setAudioStorageId}: GeneratePodcastProps) => {

    const [generating, setGenerating] = useState(false);

    const { toast } = useToast()

    const generateUploadURL = useMutation(api.files.generateUploadURL);

    const { startUpload } = useUploadFiles(generateUploadURL);

    const getPodcastAudio = useAction(api.openai.generateAudio);

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
            const response = await getPodcastAudio({voice: voiceType, input: voicePrompt})

            const blob = new Blob([response], { type: 'audio/mpeg' });
            const fileName = `podcast-${uuidv4()}.mp3`;
            const file = new File([blob], fileName, { type: 'audio/mpeg' });

            const uploaded = await startUpload([file]);
            const storageId = (uploaded[0].response as any).storageId;

            setAudioStorageId(storageId);

            const audioURL = await getAudioURL({storageId});
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
        <div>
            <div className='flex flex-col gap-2.5'>
                <Label className='text-16 font-bold text-white-1'>
                    Prompt to generate podcast
                </Label>
                <Textarea className='input-class font-light focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-1 focus-visible:ring-offset-0' placeholder='Enter text to generate podcast' rows={5} value={props.voicePrompt} onChange={(e) => props.setVoicePrompt(e.target.value)} />
            </div>
            <div className='mt-5 w-full max-w-[200px]'>
                <Button type="submit" className="text-16 bg-orange-1 py-4 font-bold text-white-1" onClick={generatePodcast}>
                    {generating ? (
                        <>
                            Generating
                            <Loader size={20} className="animate-spin ml-2" />
                        </>
                    ) : (
                        'Generate Podcast'
                    )}
                </Button>
            </div>
            {props.audio && (
                <audio controls src={props.audio} autoPlay className='mt-5' onLoadedMetadata={(e) => props.setAudioDuration(e.currentTarget.duration)}></audio>
            )}
        </div>
    )
}

export default GeneratePodcast