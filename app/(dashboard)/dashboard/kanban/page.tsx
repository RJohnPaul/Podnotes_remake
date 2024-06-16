'use client'
import { useState, useEffect } from 'react';
import BreadCrumb from '@/components/breadcrumb';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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

const breadcrumbItems = [{ title: 'Youtube Link To Notes', link: '/dashboard/kanban' }];

dotenv.config();

export default function Page() {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [copied, setCopied] = useState(false);
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

  const handleYoutubeUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setYoutubeUrl(e.target.value);
  };

  const handleGenerateNotes = async () => {
    try {
      setLoading(true);

      // Make a request to RapidAPI to get the transcript URL
      const url = 'https://youtubetranscriptdownloader.p.rapidapi.com/dev';
      const options = {
        method: 'POST',
        headers: {
          'x-rapidapi-key': process.env.NEXT_PUBLIC_RAPID_API_KEY || '',
          'x-rapidapi-host': 'youtubetranscriptdownloader.p.rapidapi.com',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: youtubeUrl }),
      };

      const rapidApiResponse = await fetch(url, options);

      if (rapidApiResponse.ok) {
        const rapidApiResult = await rapidApiResponse.json();
        const transcriptUrl = rapidApiResult.body.match(/"Transcript URL: (.*?)"/)[1];

        // Fetch the transcript text from the URL
        const transcriptResponse = await fetch(transcriptUrl);
        const transcriptText = await transcriptResponse.text();

        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const prompt = `Please generate notes from the following transcript:\n\n${transcriptText}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = await response.text();

        setNotes(text.trim());

        setLoading(false);
        toast({
          title: 'Notes generated successfully!',
          description: 'The notes have been generated based on the provided YouTube URL.',
          variant: 'default',
        });
      } else {
        setLoading(false);
        toast({
          title: 'Error fetching transcript',
          description: 'An error occurred while fetching the transcript. Please check the provided YouTube URL and try again.',
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

  const copyToClipboard = () => {
    navigator.clipboard.writeText(notes);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: 'Notes copied to clipboard!',
      description: 'The generated notes have been copied to your clipboard.',
      variant: 'default',
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
              <CardTitle className="text-2xl font-bold">YouTube Link Entry</CardTitle>
            </div>
            <CardDescription className="text-gray-400 mt-2">
              Enter the YouTube URL and click &apos;Generate Notes&apos; to generate notes from the video transcript.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 md:p-8 lg:p-10 space-y-6">
            <Input
              value={youtubeUrl}
              onChange={handleYoutubeUrlChange}
              placeholder="Enter the YouTube URL here..."
              className="w-full bg-gray-100 dark:bg-gray-950/50 dark:text-gray-200 rounded-md p-4 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-800/50 focus:border-transparent"
            />
            <div className="flex justify-end">
              <HoverBorderGradient
                onClick={handleGenerateNotes}
                containerClassName="rounded-full"
                as="button"
                className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-0.5"
              >
                <span>Generate Notes</span>
              </HoverBorderGradient>
            </div>
            {loading && (
              <div className="mt-4">
                <Progress value={progress} />
              </div>
            )}
            {notes && (
              <div className="mt-8 p-6 md:p-8 lg:p-6 space-y-6 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Generated Notes</h3>
                  <button onClick={copyToClipboard} className="bg-slate-800 no-underline group cursor-pointer relative shadow-2xl shadow-zinc-900 rounded-full p-px text-xs font-semibold leading-6 text-white inline-block">
                    <span onClick={copyToClipboard} className="absolute inset-0 overflow-hidden rounded-full">
                      <span onClick={copyToClipboard} className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    </span>
                    <div onClick={copyToClipboard} className="relative flex space-x-2 items-center z-10 rounded-full bg-zinc-950 py-0.5 px-4 ring-1 ring-white/10">
                      <span onClick={copyToClipboard}>
                        {copied ? 'Copied!' : 'Copy'}
                      </span>
                      <svg
                        fill="none"
                        height="16"
                        viewBox="0 0 24 24"
                        width="16"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M10.75 8.75L14.25 12L10.75 15.25"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                        />
                      </svg>
                    </div>
                    <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-emerald-400/0 via-emerald-400/90 to-emerald-400/0 transition-opacity duration-500 group-hover:opacity-40" />
                  </button>
                </div>
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