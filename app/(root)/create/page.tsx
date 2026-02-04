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

const voiceCategories = ['Rachel', 'Antonio', 'Bella', 'Ellis', 'Josh', 'Jean'];


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
      setSubmitting(false);
    }
  }

  return (
    <section className="mt-8 flex flex-col animate-fade-in">
      <h1 className='section-header'>Create Podcast</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-10 flex w-full flex-col">
          <div className="flex flex-col gap-8 border-b border-black-4 pb-10">
            <FormField
              control={form.control}
              name="podcastTitle"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-3">
                  <FormLabel className="text-[15px] font-semibold text-white-1">Title</FormLabel>
                  <FormControl>
                    <Input
                      className="input-class focus-visible:ring-purple-1 focus-visible:ring-1 focus-visible:ring-offset-0"
                      placeholder="What's your podcast name?"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <div className="flex flex-col gap-3">
              <Label className="text-[15px] font-semibold text-white-1">
                Select your podcast&apos;s voice
              </Label>
              <Select onValueChange={(value) => setVoiceType(value.toLowerCase())}>
                <SelectTrigger className={cn('text-[15px] w-full border border-black-4 bg-black-2 text-gray-1 rounded-apple focus:ring-purple-1 focus:border-purple-1 focus:ring-1')}>
                  <SelectValue placeholder="No voice selected" />
                </SelectTrigger>
                <SelectContent className="text-[15px] border border-black-4 bg-black-2 text-white-1 rounded-apple">
                  {voiceCategories.map((voice) => (
                    <SelectItem key={voice} value={voice} className="capitalize focus:bg-purple-1 rounded-lg">
                      {voice}
                    </SelectItem>
                  ))}
                </SelectContent>
                {voiceType && (
                  <audio src={`/audio/${voiceType}.mp3`} autoPlay className="hidden"></audio>
                )}
              </Select>
            </div>

            <FormField
              control={form.control}
              name="podcastDescription"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-3">
                  <FormLabel className="text-[15px] font-semibold text-white-1">Description</FormLabel>
                  <FormControl>
                    <Textarea
                      className="input-class min-h-[120px] focus-visible:ring-purple-1 focus-visible:ring-1 focus-visible:ring-offset-0"
                      placeholder="What's your podcast about?"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col pt-10 gap-8">
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


            <div className="mt-6 w-full">
              <Button
                type="submit"
                className="w-full bg-purple-1 hover:bg-purple-2 text-white-1 font-semibold rounded-full h-12 transition-all duration-200 shadow-button text-[15px]"
              >
                {submitting ? (
                  <>
                    Creating Podcast
                    <Loader size={18} className="animate-spin ml-2" />
                  </>
                ) : (
                  'Create Podcast'
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
