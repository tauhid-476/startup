import { useToast } from '@/hooks/use-toast'
import { apiClient } from '@/lib/apiclient'
import { FormValues, User } from '@/types/User'
import { IKUploadResponse } from 'imagekitio-next/dist/types/components/IKUpload/props'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getInitials } from "@/lib/utils"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from './ui/button'
import { Crown, PenSquare, Save, X } from 'lucide-react'
import FileUpload from './FileUpload'
import { Badge } from './ui/badge'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'

interface ProfileCardProps {
  user: User | null
  isCurrentUser: boolean
}

const ProfileCard = ({user, isCurrentUser}: ProfileCardProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const { register, handleSubmit, setValue, watch } = useForm<FormValues>({
    defaultValues: {
      imageUrl: user?.image || "",
      name: user?.name || "",
      bio: user?.bio || ""
    }
  })

  const handleUploadSuccess = async (response: IKUploadResponse) => {
    const imageUrl = response.url
    setValue("imageUrl", imageUrl)
    try {
      await handleProfileUpdate({ imageUrl, name: watch('name'), bio: watch('bio') })
    } catch (error) {
      console.error("Error updating profile picture:", error)
      toast({
        title: "Error updating profile picture",
        variant: "destructive"
      })
    }
  }

  const handleProfileUpdate = async (data: FormValues) => {
    setLoading(true)
    try {
      const result = await apiClient.updateProfile(data)
      toast({ 
        title: "Success", 
        description: "Profile updated successfully" 
      })
      setIsDialogOpen(false)
      setIsEditing(false)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update profile",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
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
                    <form className="space-y-4">
                      <input type="hidden" {...register("imageUrl")} />
                      <FileUpload onSuccess={handleUploadSuccess} fileType="image" />
                    </form>
                  </DialogContent>
                </Dialog>
              )}
            </motion.div>

            <motion.div
              className="space-y-4 w-full text-center relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {isCurrentUser && !isEditing && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute -right-2 -top-2"
                  onClick={() => setIsEditing(true)}
                >
                  <PenSquare className="h-4 w-4 text-white" />
                </Button>
              )}
              
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
                
                {isEditing ? (
                  <form onSubmit={handleSubmit(handleProfileUpdate)} className="space-y-4">
                    <Input
                      {...register("name")}
                      className="bg-transparent border-gray-700 text-center"
                      placeholder="Your name"
                    />
                    <Textarea
                      {...register("bio")}
                      className="bg-transparent border-gray-700 text-center min-h-[100px]"
                      placeholder="Tell us about yourself..."
                    />
                    <div className="flex justify-center gap-2">
                      <Button 
                        type="submit" 
                        disabled={loading}
                        className="gap-2 w-full"
                      >
                        <Save className="h-4 w-4" />
                        Save
                      </Button>
                      <Button
                        type="button"
                        className='bg-red-700 w-full text-white hover:bg-red-500'
                        onClick={() => setIsEditing(false)}
                      >
                        <X className="h-4 w-4" />
                        Cancel
                      </Button>
                    </div>
                  </form>
                ) : (
                  <>
                    <h2 className="text-xl font-semibold">{user?.name || 'User Name'}</h2>
                    <p className="text-sm text-gray-500">{user?.email || 'email@example.com'}</p>
                    <div className="pt-2">
                      <h3 className="text-sm font-medium mb-2">About</h3>
                      <p className="text-sm text-muted-foreground">{user?.bio || 'No bio available'}</p>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default ProfileCard