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
    <div className='flex flex-col gap-5'>
      {/* Toggle Buttons */}
      <div className='generate_thumbnail'>
        <Button
          type='button'
          variant='plain'
          className={cn(
            'flex-1 rounded-apple py-3 text-[14px] font-medium transition-all duration-200',
            aiThumbnail ? 'bg-purple-1 text-white-1' : 'bg-transparent text-gray-1 hover:text-white-1'
          )}
          onClick={() => setAIThumbnail(true)}
        >
          <svg className='w-4 h-4 mr-2' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' />
          </svg>
          AI Generate
        </Button>
        <Button
          type='button'
          variant='plain'
          className={cn(
            'flex-1 rounded-apple py-3 text-[14px] font-medium transition-all duration-200',
            !aiThumbnail ? 'bg-purple-1 text-white-1' : 'bg-transparent text-gray-1 hover:text-white-1'
          )}
          onClick={() => setAIThumbnail(false)}
        >
          <svg className='w-4 h-4 mr-2' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12' />
          </svg>
          Upload Image
        </Button>
      </div>

      {aiThumbnail ? (
        <div className='flex flex-col gap-5'>
          <div className='flex flex-col gap-3'>
            <Label className='text-[15px] font-semibold text-white-1'>
              Prompt to generate thumbnail
            </Label>
            <Textarea
              className='input-class font-normal focus-visible:ring-purple-1 focus-visible:ring-1 focus-visible:ring-offset-0 min-h-[120px]'
              placeholder='Describe the thumbnail you want to create...'
              rows={5}
              value={imagePrompt}
              onChange={(e) => setImagePrompt(e.target.value)}
            />
          </div>
          <div className='w-full max-w-[200px]'>
            <Button
              type="button"
              className="bg-purple-1 hover:bg-purple-2 text-white-1 font-semibold rounded-full h-10 px-6 transition-all duration-200 shadow-button text-[14px]"
              onClick={generateImage}
            >
              {imageLoading ? (
                <>
                  Generating
                  <Loader size={16} className="animate-spin ml-2" />
                </>
              ) : (
                <>
                  <svg className='w-4 h-4 mr-1.5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' />
                  </svg>
                  Generate
                </>
              )}
            </Button>
          </div>
        </div>
      ) : (
        <div
          className='image_div cursor-pointer'
          onClick={() => { imageRef?.current?.click() }}
        >
          <Input type='file' className='hidden' ref={imageRef} onChange={(e) => uploadImage(e)} />
          {!imageLoading ? (
            <div className='flex flex-col items-center gap-4'>
              <div className='w-16 h-16 rounded-full bg-black-4 flex items-center justify-center'>
                <svg className='w-8 h-8 text-gray-1' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12' />
                </svg>
              </div>
              <div className='flex flex-col items-center gap-1'>
                <h2 className='text-[14px] font-semibold text-purple-1'>
                  Click to upload
                </h2>
                <p className='text-[12px] text-gray-1'>
                  SVG, PNG, JPG or GIF (max. 5MB)
                </p>
              </div>
            </div>
          ) : (
            <div className='text-[14px] flex-center font-medium text-white-1'>
              Uploading
              <Loader size={18} className='animate-spin ml-2' />
            </div>
          )}
        </div>
      )}

      {image && (
        <div className='flex-center w-full'>
          <div className='relative'>
            <Image
              src={image}
              width={200}
              height={200}
              alt='thumbnail'
              className='rounded-apple-lg shadow-card'
            />
            <div className='absolute -top-2 -right-2 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center'>
              <svg className='w-3.5 h-3.5 text-white' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={3} d='M5 13l4 4L19 7' />
              </svg>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default GenerateThumbnail
