/* eslint-disable @next/next/no-img-element */
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function Component() {
  return (
    <div className="min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr]">
        <div className="hidden border-r bg-gray-100/40 lg:block dark:bg-gray-800/40">
          <div className="flex flex-col gap-4 p-4">
            <div className="flex h-[60px] items-center">
              <Link href="#" className="flex items-center gap-2 font-semibold">
                <span>Podcast Dashboard</span>
              </Link>
            </div>
            <nav className="grid gap-1 text-sm font-medium">
              <Link href="dashboard/profile" className="block rounded-lg px-3 py-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50">
                Transcripts
              </Link>
              <Link href="#" className="block rounded-lg px-3 py-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50">
                Audio
              </Link>
              <Link href="#" className="block rounded-lg px-3 py-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50">
                AI-Transcript
              </Link>
              <Link href="#" className="block rounded-lg px-3 py-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50">
                Video
              </Link>
            </nav>
          </div>
        </div>
        <div className="flex flex-col">
          <header className="flex h-14 lg:h-[60px] items-center border-b bg-gray-100/40 px-4 sm:px-6 dark:bg-gray-800/40">
            <h1 className="text-lg font-semibold">Dashboard</h1>
          </header>
          <main className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            <Card>
              <CardHeader>
                <CardTitle>New Podcast Releases</CardTitle>
                <CardDescription>Check out the latest podcast episodes from your subscriptions.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <img src="/placeholder.svg" width={64} height={64} className="rounded-lg" alt="Podcast Cover" />
                      <div>
                        <h3 className="font-medium">Podcast Title</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">New episode description</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Saved Podcasts</CardTitle>
                <CardDescription>Your saved podcast episodes for later listening.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <img src="/placeholder.svg" width={64} height={64} className="rounded-lg" alt="Podcast Cover" />
                      <div>
                        <h3 className="font-medium">Podcast Title</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Episode description</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Magic Chat</CardTitle>
                <CardDescription>Connect with other podcast listeners and creators.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <Avatar className="border w-10 h-10">
                        <img src="/placeholder.svg" alt="Avatar" />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">User Name</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">User message</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Style Library</CardTitle>
                <CardDescription>Browse and apply custom styles to your podcast.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex flex-col items-center gap-2">
                      <div className="h-20 w-20 rounded-lg bg-gray-100 dark:bg-gray-800" />
                      <p className="text-sm font-medium">Style Name</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Integrations</CardTitle>
                <CardDescription>Connect your podcast with other tools and services.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex flex-col items-center gap-2">
                      <div className="h-20 w-20 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        <span className="text-4xl">🎙️</span>
                      </div>
                      <p className="text-sm font-medium">Integration Name</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </div>
  )
}