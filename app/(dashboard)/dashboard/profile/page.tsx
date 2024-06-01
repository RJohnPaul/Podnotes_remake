'use client'
import { useState } from 'react';
import BreadCrumb from '@/components/breadcrumb';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import dotenv from 'dotenv';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

dotenv.config();

const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI('AIzaSyDeSw9Bdd31ZQ3uzryaHZpfsRtV_k8-8D8');

const breadcrumbItems = [{ title: 'Profile', link: '/dashboard/profile' }];
const MAX_TOKENS = 1000;

dotenv.config();

export default function Page() {
  const [transcript, setTranscript] = useState('');
  const [notes, setNotes] = useState('');
  const [remainingTokens, setRemainingTokens] = useState(MAX_TOKENS);
  const [copied, setCopied] = useState(false);

  const handleTranscriptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setTranscript(value);

    // Calculate the number of tokens in the transcript
    const tokens = value.split(/\s+/).length;
    setRemainingTokens(MAX_TOKENS - tokens);
  };

  const handleGenerateNotes = async () => {
    if (remainingTokens < 0) {
      alert('You have exceeded the maximum token limit. Please reduce the transcript length.');
      return;
    }

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `Please generate notes from the following transcript:\n\n${transcript}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = await response.text();

      setNotes(text.trim());
      setTranscript('');
      setRemainingTokens(MAX_TOKENS);
    } catch (error) {
      console.error('Error generating notes:', error);
      setNotes('An error occurred while generating notes. Please check the API key and try again.');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(notes);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ScrollArea className="h-full">
      <BreadCrumb items={breadcrumbItems} />
      <div className="flex justify-center items-center py-12 md:py-16 lg:py-20 px-4 md:px-6 lg:px-8">
        <Card className="w-full max-w-3xl shadow-lg rounded-lg">
          <CardHeader className="bg-gray-900 text-white px-6 py-6 rounded-t-lg md:px-8">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold">Transcript Entry</CardTitle>
            </div>
            <CardDescription className="text-gray-400 mt-2">
              Enter the transcript text and click &apos;Generate&apos; to submit.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 md:p-8 lg:p-10 space-y-6">
            <Textarea
              value={transcript}
              onChange={handleTranscriptChange}
              placeholder="Enter the transcript text here..."
              className="w-full h-[300px] bg-gray-100 dark:bg-gray-800 dark:text-gray-200 rounded-md p-4 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            />
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500">
                Remaining Tokens: {remainingTokens} / {MAX_TOKENS}
              </p>
              <Button
                onClick={handleGenerateNotes}
                disabled={remainingTokens < 0}
                className="bg-gray-900 text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 rounded-md px-6 py-3 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Generate
              </Button>
            </div>
            {notes && (
              <div className="mt-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Generated Notes:</h3>
                  <button
                    className="bg-gray-200 text-gray-800 hover:bg-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    onClick={copyToClipboard}
                  >
                    {copied ? 'Copied!' : 'Copy'}
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
//
//AIzaSyDeSw9Bdd31ZQ3uzryaHZpfsRtV_k8-8D8

