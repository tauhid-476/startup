"use client"
import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { useSession } from "next-auth/react"
import { apiClient } from "@/lib/apiclient"
import { Startup } from "@/types/Startup"
import { motion } from "framer-motion"
import { Loader, Loader2 } from "lucide-react"
import UserStartupsSection from "@/components/UserStartupsSection"
import CandidateApplicationsSection from "@/components/CandidateApplicationsSection"
import { User } from "@/types/User"
import ProfileCard from "@/components/ProfileCard"
import { Application } from "@/types/Application"

export interface FormValues {
  imageUrl: string
}

export default function ProfileDashboard({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState("")
  const [startups, setStartups] = useState<Startup[]>([])
  const { toast } = useToast()
  const [applications, setApplications] = useState<Application[]>([])
  const { data: session, status } = useSession()

  const isFounder = session?.user.role === "FOUNDER"
  const isCandidate = session?.user.role === "CANDIDATE"
  console.log("isFounder value is", isFounder)

  useEffect(() => {
    const getParamId = async () => {
      const id = (await params).id
      setUserId(id)
    }
    getParamId()
  }, [params])

  const isCurrentUser = session?.user.id === userId

  useEffect(() => {
    if (!userId) return

    const fetchUser = async () => {
      try {
        const user = await apiClient.getUser(userId)
        setUser(user)
        console.log("user and isCurrentUSer", user, isCurrentUser, user.role)
      } catch (error) {
        console.error("Error fetching user:", error)
        toast({
          title: "Error loading profile",
          variant: "destructive"
        })
      }
    }

    const fetchFounderStartups = async () => {
      if (!isCurrentUser) return
      try {
        const response = await apiClient.getFounderStartups(userId)
        setStartups(response)
      } catch (error) {
        console.error("Error fetching user:", error)
        toast({
          title: "Error loading profile",
          variant: "destructive"
        })
      }
    }

    const fetchCandidateApplications = async () => {
      if (!isCurrentUser) return
      try {
        const applications = await apiClient.getCandidateApplications(userId)
        setApplications(applications)
      } catch (error) {
        console.error("Error fetching user:", error)
        toast({
          title: "Error loading profile",
          variant: "destructive"
        })
      }
    }

    //
    setLoading(true)
    Promise.all([
      fetchUser(),
      isCurrentUser ? fetchCandidateApplications() : Promise.resolve(),
      isFounder ? fetchFounderStartups() : Promise.resolve()
    ]).finally(() => setLoading(false))
  }, [userId, isCurrentUser, isFounder, toast])


  if (status === "loading") {
    return <Loader2 className="animate-spin self-center" />
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <Loader className="h-10 w-10 animate-spin text-white" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <p>Profile not found</p>
      </div>
    )
  }

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

            {user && <ProfileCard user={user} isCurrentUser={isCurrentUser} />}

          </div>
          <div className="md:col-span-9">
            {isCurrentUser ? (
              <>
                {isFounder && <UserStartupsSection startups={startups} />}
                {isCandidate && <CandidateApplicationsSection applications={applications} />}
              </>
            ) : (
              <div>
                <h2 className="text-2xl font-bold mb-4">Public Profile</h2>
                <p>This is {user.name}&apos;s public profile.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}