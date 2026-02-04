import React, { useRef, useState } from 'react'
import { Button } from './ui/button'
import { cn } from '@/lib/utils';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { GenerateThumbnailProps } from '@/types';
import { Loader } from 'lucide-react';
import { Input } from './ui/input';
import Image from 'next/image';
import { useToast } from './ui/use-toast';
import { useAction, useMutation } from 'convex/react';
import { useUploadFiles } from '@xixixao/uploadstuff/react';
import { api } from '@/convex/_generated/api';
import { v4 as uuidv4 } from 'uuid'

const GenerateThumbnail = ({ setImage, setImageStorageId, image, imagePrompt, setImagePrompt }: GenerateThumbnailProps) => {

  const [aiThumbnail, setAIThumbnail] = useState(false);

  const [imageLoading, setImageLoading] = useState(false);

  const imageRef = useRef<HTMLInputElement>(null);

  const { toast } = useToast();

  const generateUploadURl = useMutation(api.files.generateUploadURL);

  const getImageURL = useMutation(api.podcasts.getURL);

  const { startUpload } = useUploadFiles(generateUploadURl);

  const handleGenerateThumbnail = useAction(api.gemini.generateThumbnail);

  const handleImage = async (blob: Blob, fileName: string) => {
    setImageLoading(true);
    setImage('');
    try {
      const file = new File([blob], fileName, { type: 'image/png' });

      const uploaded = await startUpload([file]);
      const storageId = (uploaded[0].response as any).storageId;

      setImageStorageId(storageId);

      const imageURL = await getImageURL({ storageId });
      setImage(imageURL!);
      setImageLoading(false);
    } catch (error) {
      console.log("Error uploading image", error);
      toast({
        title: "Error uploading image",
        variant: 'destructive'
      })
    }
  }

  const generateImage = async () => {
    setImageLoading(true);
    try {
      const response = await handleGenerateThumbnail({ prompt: imagePrompt });
      const blob = new Blob([response], { type: 'image/png' });
      handleImage(blob, `thumbnail-${uuidv4()}.png`);
      toast({
        title: "Image generated successfully",
      })
    } catch (error) {
      console.log("Error generating thumbnail", error);
      toast({
        title: "Error generating thumbnail",
        variant: 'destructive'
      })
    }

  }

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    try {
      const files = e.target.files;
      if (!files) return;
      const file = files[0];
      const blob = await file.arrayBuffer().then((ab) => new Blob([ab]));
      handleImage(blob, file.name);
      toast({
        title: "Image uploaded successfully",
      })
    } catch (error) {
      console.log("Error uploading image", error);
      toast({
        title: "Error uploading image",
        variant: 'destructive'
      })
    }
  }

  return (
    <>
      <div className='generate_thumbnail'>
        <Button type='button' variant='plain' className={cn('', { 'bg-black-6': aiThumbnail })} onClick={() => setAIThumbnail(true)}>
          Generate an AI thumbnail
        </Button>
        <Button type='button' variant='plain' className={cn('', { 'bg-black-6': !aiThumbnail })} onClick={() => setAIThumbnail(false)}>
          Upload your thumbnail
        </Button>
      </div>
      {aiThumbnail ? (
        <div className='flex flex-col gap-5 mt-5'>
          <div className='flex flex-col gap-2.5'>
            <Label className='text-16 font-bold text-white-1'>
              Prompt to generate podcast
            </Label>
            <Textarea className='input-class font-light focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-1 focus-visible:ring-offset-0' placeholder='Enter text to generate thumbnail' rows={5} value={imagePrompt} onChange={(e) => setImagePrompt(e.target.value)} />
          </div>
          <div className='w-full max-w-[200px]'>
            <Button type="submit" className="text-16 bg-orange-1 py-4 font-bold text-white-1" onClick={generateImage}>
              {imageLoading ? (
                <>
                  Generating
                  <Loader size={20} className="animate-spin ml-2" />
                </>
              ) : (
                'Generate Thumbnail'
              )}
            </Button>
          </div>
        </div>
      ) : (
        <div className='image_div' onClick={() => { imageRef?.current?.click() }}>
          <Input type='file' className='hidden' ref={imageRef} onChange={(e) => uploadImage(e)} />
          {!imageLoading ? (
            <div>
              <Image src='/icons/upload-image.svg' width={40} height={40} alt='upload-image' />
            </div>
          ) : (
            <div className='text-16 flex-center font-medium text-white-1'>
              Uploading
              <Loader size={20} className='animate-spin ml-2' />
            </div>
          )}
          <div className='flex flex-col items-center gap-1'>
            <h2 className='text-12 font-bold text-orange-1'>
              Select an image
            </h2>
            <p className='text-12 font-normal text-gray-1'>
              SVG, PNG, JPG or GIF
            </p>
          </div>
        </div>
      )}
      {image && (
        <div className='flex-center w-full'>
          <Image src={image} width={200} height={200} alt='thumbnail' className='mt-5 ' />
        </div>
      )}
    </>
  )
}

export default GenerateThumbnail