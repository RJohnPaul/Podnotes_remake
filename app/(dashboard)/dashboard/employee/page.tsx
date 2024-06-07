'use client'
import { useState, useEffect } from 'react';
import BreadCrumb from '@/components/breadcrumb';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import dotenv from 'dotenv';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient';
import { useToast } from '@/components/ui/use-toast';
import { Progress } from '@/components/ui/progress';
import React from 'react';

dotenv.config();

const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_API_KEY);

const breadcrumbItems = [{ title: 'Video To Notes', link: '/dashboard/employee' }];

dotenv.config();

export default function Page() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    let progressInterval: NodeJS.Timeout | null = null;

    if (loading) {
      setProgress(0);
      progressInterval = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 100) {
            return prevProgress;
          }
          return prevProgress + 1;
        });
      }, 50);
    }

    return () => {
      if (progressInterval) clearInterval(progressInterval);
    };
  }, [loading]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setVideoFile(e.target.files[0]);
    }
  };

  const handleGenerateNotes = async () => {
    try {
      setLoading(true);

      if (videoFile) {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const prompt = `Please generate notes from the following video file: ${videoFile.name}`;

        const base64 = await convertToBase64(videoFile);

        const result = await model.generateContent(prompt, { inputFiles: [{ content: base64, mimeType: videoFile.type }] });
        const response = await result.response;
        const text = await response.text();

        setNotes(text.trim());

        setLoading(false);
        toast({
          title: 'Notes are generated successfully!',
          description: 'The notes have been generated based on the provided video file.',
          variant: 'default',
        });
      } else {
        setLoading(false);
        toast({
          title: 'No video file selected',
          description: 'Please select a video file to generate notes.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      setLoading(false);
      toast({
        title: 'Error generating notes',
        description: 'An error occurred while generating notes. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        if (typeof fileReader.result === 'string') {
          resolve(fileReader.result.split(',')[1]);
        } else {
          reject(new Error('Failed to convert file to base64'));
        }
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <BreadCrumb items={breadcrumbItems} />
      </div>
      <div className="flex justify-center items-center py-12 md:py-16 lg:py-20 px-4 md:px-6 lg:px-8">
        <Card className="w-full max-w-3xl shadow-lg rounded-lg">
          <CardHeader className="bg-gray-900 dark:bg-gray-900 text-black py-6 rounded-t-lg md:px-8 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium dark:text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold">Video Upload</CardTitle>
            </div>
            <CardDescription className="text-gray-400 mt-2">
              Upload a video file and click &apos;Generate Notes&apos; to generate notes from the video.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 md:p-8 lg:p-10 space-y-6">
            <input
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              className="w-full bg-gray-100 dark:bg-gray-950/50 dark:text-gray-200 rounded-md p-4 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-800/50 focus:border-transparent"
            />
            {!videoFile && (
              <p className="text-gray-500">
                Please provide me with the video file &quot; so I can generate notes for you. You can upload the video file to a file sharing service like Google Drive or Dropbox and share the link with me.
              </p>
            )}
            <div className="flex justify-end">
              {videoFile ? (
                <HoverBorderGradient
                  onClick={handleGenerateNotes}
                  containerClassName="rounded-full"
                  as="button"
                  className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-0.5"
                >
                  <span>Generate Notes</span>
                </HoverBorderGradient>
              ) : (
                <button
                  onClick={handleGenerateNotes}
                  disabled
                  className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-0.5 rounded-full opacity-50 cursor-not-allowed"
                >
                  <span>Generate Notes</span>
                </button>
              )}
            </div>
            {loading && (
              <div className="mt-4">
                <Progress value={progress} />
              </div>
            )}
            {notes && (
              <div className="mt-8 p-6 md:p-8 lg:p-6 space-y-6 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
                <h3 className="text-lg font-semibold">Generated Notes:</h3>
                <ReactMarkdown remarkPlugins={[remarkGfm]} className="prose max-w-none">
                  {notes}
                </ReactMarkdown>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
}