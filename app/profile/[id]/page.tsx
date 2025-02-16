"use client"
import FileUpload from "@/components/FileUpload"
import { useEffect, useState } from "react"
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props"
import { useForm } from "react-hook-form"
import { useToast } from "@/hooks/use-toast"
import { useSession } from "next-auth/react"
import { apiClient } from "@/lib/apiclient"
import { Startup } from "@/types/Startup"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getInitials } from "@/lib/utils"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Crown, Loader, PenSquare } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import UserStartupsSection from "@/components/UserStartupsSection"


interface FormValues {
  imageUrl: string
}

interface User {
  name: string
  email: string
  image: string
  role: string
  bio: string
}

export default function ProfileDashboard({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const [user, setUser] = useState<User>()
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState("")
  const [startups, setStartups] = useState<Startup[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()
  const { data: session } = useSession()

  const isFounder = session?.user.role === "FOUNDER"
  console.log("isFounder value is", isFounder)

  const { register, handleSubmit, setValue } = useForm<FormValues>({
    defaultValues: {
      imageUrl: ""
    }
  })

  useEffect(() => {
    const getParamId = async () => {
      const id = (await params).id
      setUserId(id)
    }
    getParamId()
  }, [params])

  const isCurrentUser = session?.user.id === userId

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true)
      if (!userId) return
      try {
        const response = await fetch(`/api/user/${userId}`)
        if (!response.ok) {
          throw new Error('Failed to fetch user')
        }
        const user = await response.json()
        setUser(user)
        console.log("user and isCurrentUSer", user, isCurrentUser, user.role)
      } catch (error) {
        console.error("Error fetching user:", error)
        toast({
          title: "Error loading profile",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    const fetchUserPosts = async () => {
      setLoading(true)
      if (!userId) return
      try {
        const response = await apiClient.getUserStartups(userId)
        setStartups(response)
      } catch (error) {
        console.error("Error fetching user:", error)
        toast({
          title: "Error loading profile",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }
    //
    fetchUser()
    fetchUserPosts()
  }, [userId])

  const handleUploadSuccess = async (response: IKUploadResponse) => {
    const imageUrl = response.url
    setValue("imageUrl", imageUrl)
    try {
      await handleProfileUpdate({ imageUrl })
    } catch (error) {
      console.error("Error updating profile picture:", error)
      toast({
        title: "Error updating profile picture",
        variant: "destructive"
      })
    }
  }

  const handleProfileUpdate = async (data: FormValues) => {
    setLoading(true);
    try {
      const result = await apiClient.changePfp(data.imageUrl);
      setUser(prev => prev ? { ...prev, image: data.imageUrl } : prev);
      toast({ title: "Success", description: result.message || "Profile picture updated successfully" });
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update profile picture",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <Loader className="h-10 w-10 animate-spin text-white" />
    </div>
  )

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gradient-to-b from-gray-900 to-black"
    >
      <div className="container mx-auto p-6 h-auto text-white">
        <div className="grid gap-6 md:grid-cols-12">
          <div className="md:col-span-3">

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="bg-black border-gray-500 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white text-center text-xl md:text-2xl">Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center space-y-4 h-auto">
                    <motion.div
                      className="relative"
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Avatar className="h-32 w-32">
                        <AvatarImage src={user?.image || ''} alt="Profile picture" />
                        <AvatarFallback className="text-2xl">{getInitials(user?.name)}</AvatarFallback>
                      </Avatar>
                      {isCurrentUser && (
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                          <DialogTrigger asChild>
                            <Button
                              size="icon"
                              variant="secondary"
                              className="absolute bottom-0 right-0 rounded-full hover:scale-105 transition-transform"
                              title="Change profile photo"
                            >
                              <PenSquare className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-black text-white">
                            <DialogHeader>
                              <DialogTitle>Update Profile Picture</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit(handleProfileUpdate)} className="space-y-4">
                              <input type="hidden" {...register("imageUrl")} />
                              <FileUpload onSuccess={handleUploadSuccess} fileType="image" />
                            </form>
                          </DialogContent>
                        </Dialog>
                      )}
                    </motion.div>

                    <motion.div
                      className="space-y-4 w-full text-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <div className="space-y-2 text-white">
                        {user?.role === "FOUNDER" ? (
                          <Badge variant="secondary" className="animate-fade-in">
                            <Crown className="w-4 h-4 text-yellow-500 mr-1" />
                            {user.role}
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="animate-fade-in">
                            {user?.role}
                          </Badge>
                        )}
                        <h2 className="text-xl font-semibold">{user?.name || 'User Name'}</h2>
                        <p className="text-sm text-gray-500">{user?.email || 'email@example.com'}</p>
                      </div>
                      <div className="pt-2">
                        <h3 className="text-sm font-medium mb-2">About</h3>
                        <p className="text-sm text-muted-foreground">{user?.bio || 'No bio available'}</p>
                      </div>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

          </div>
          <div className="md:col-span-9">
            {isCurrentUser &&
              <UserStartupsSection startups={startups} />
            }
          </div>
        </div>
      </div>
    </motion.div>
  );
}