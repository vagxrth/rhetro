"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { set, useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import GeneratePodcast from "@/components/GeneratePodcast"
import GenerateThumbnail from "@/components/GenerateThumbnail"
import { Loader } from "lucide-react"
import { Id } from "@/convex/_generated/dataModel"
import { useToast } from "@/components/ui/use-toast"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useRouter } from "next/navigation"

const voiceCategories = ['Alloy', 'Echo', 'Fable', 'Nova', 'Onyx', 'Shimmer'];


const formSchema = z.object({
  podcastTitle: z.string().min(2),
  podcastDescription: z.string().min(2),
})

const CreatePodcast = () => {
  const router = useRouter();

  const [imagePrompt, setImagePrompt] = useState('');
  const [imageURL, setImageURL] = useState('');
  const [imageStorageId, setImageStorageId] = useState<Id<"_storage"> | null>(null);

  const [audioStorageId, setAudioStorageId] = useState<Id<"_storage"> | null>(null);
  const [audioURL, setAudioURL] = useState('');
  const [audioDuration, setAudioDuration] = useState(0);

  const [voiceType, setVoiceType] = useState<string | null>(null);
  const [voicePrompt, setVoicePrompt] = useState('');

  const [submitting, setSubmitting] = useState(false);

  const { toast } = useToast();

  const createPodcast = useMutation(api.podcasts.createPodcast);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      podcastTitle: "",
      podcastDescription: "",
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      setSubmitting(true);
      if (!audioURL || !imageURL || !voiceType) {
        // toast({
        //   title: "Please provide audio and image",
        // })
        setSubmitting(false);
        throw new Error("Please provide audio and image");
      }

      const podcast = await createPodcast({
        podcastTitle: data.podcastTitle,
        podcastDescription: data.podcastDescription,
        audioURL,
        imageURL,
        imagePrompt,
        voiceType,
        voicePrompt,
        views: 0,
        audioDuration,
        audioStorageId: audioStorageId!,
        imageStorageId: imageStorageId!,
      })

      toast({
        title: "Podcast created successfully",
      })
      setSubmitting(false);
      router.push('/');

    } catch (error) {
      // console.log("Error creating the podcast", error);
      // toast({
      //   title: "Error creating the podcast",
      //   variant: 'destructive'
      // })
      setSubmitting(false);
    }
  }

  return (
    <section className="mt-10 flex flex-col">
      <h1 className='text-20 font-bold text-white-1'>Create Podcast</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-12 flex w-full flex-col">
          <div className="flex flex-col gap-[30px] border-b border-black-5 pb-10">
            <FormField
              control={form.control}
              name="podcastTitle"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2.5 ">
                  <FormLabel className="text-16 font-bold text-white-1">Title</FormLabel>
                  <FormControl>
                    <Input className="input-class focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-1 focus-visible:ring-offset-0" placeholder="What's your podcast name?" {...field} />
                  </FormControl>
                  <FormMessage className="text-white-1" />
                </FormItem>
              )}
            />
            <div className="flex flex-col gap-2.5">
              <Label className="text-16 font-bold text-white-1">
                Select your podcast&apos;s voice
              </Label>
              <Select onValueChange={(value) => setVoiceType(value.toLowerCase())}>
                <SelectTrigger className={cn('text-16 w-full border-none bg-black-1 text-gray-1 focus:ring-orange-1 focus:outline-none focus:ring-offset-0 focus:ring-2')}>
                  <SelectValue placeholder="No voice selected" />
                </SelectTrigger>
                <SelectContent className="text-16 border-none bg-black-1 font-bold text-white-1">
                  {voiceCategories.map((voice) => (
                    <SelectItem key={voice} value={voice} className="capitalize focus:bg-orange-1">
                      {voice}
                    </SelectItem>
                  ))}
                </SelectContent>
                {voiceType && (
                  <audio src={`/${voiceType}.mp3`} autoPlay className="hidden"></audio>
                )}
              </Select>
            </div>
            <FormField
              control={form.control}
              name="podcastDescription"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2.5 ">
                  <FormLabel className="text-16 font-bold text-white-1">Description</FormLabel>
                  <FormControl>
                    <Textarea className="input-class focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-1 focus-visible:ring-offset-0" placeholder="What's your podcast about?" {...field} />
                  </FormControl>
                  <FormMessage className="text-white-1" />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col pt-10">
            <GeneratePodcast
              setAudioStorageId={setAudioStorageId}
              setAudio={setAudioURL}
              voiceType={voiceType!}
              audio={audioURL}
              voicePrompt={voicePrompt}
              setVoicePrompt={setVoicePrompt}
              setAudioDuration={setAudioDuration}
            />


            <GenerateThumbnail
              setImage={setImageURL}
              setImageStorageId={setImageStorageId}
              image={imageURL}
              imagePrompt={imagePrompt}
              setImagePrompt={setImagePrompt}
            />


            <div className="mt-10 w-full">
              <Button type="submit" className="text-16 w-full bg-orange-1 py-4 font-extrabold text-white-1 transition-all duration-500 hover:bg-black-1">
                {submitting ? (
                  <>
                    Submitting
                    <Loader size={20} className="animate-spin ml-2" />
                  </>
                ) : (
                  'Submit'
                )}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </section>
  )
}

export default CreatePodcast