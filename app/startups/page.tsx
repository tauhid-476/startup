"use client"
import StartupsSection from "@/components/HomeStartups"
import { apiClient } from '@/lib/apiclient'
import { Startup } from '@/types/Startup'
import { useToast } from '@/hooks/use-toast'
import React, { useEffect, useState } from 'react'
import { Loader } from 'lucide-react'

export default function StartupsPage() {
  const [startups, setStartups] = useState<Startup[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchStartups = async () => {
      try {
        setLoading(true)
        const response = await apiClient.getStartups()
        setStartups(response)
      } catch (error) {
        console.error('Error fetching startups:', error)
        toast({
          title: "Error",
          description: "Failed to load startups. Please try again later.",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    fetchStartups()
  }, []) 
//
  if (loading) {
    return (
      <div className="flex  bg-black items-center min-h-screen justify-center">
        <Loader className="h-12 w-12 animate-spin text-white" />
      </div>
    )
  }

  return (
    <div className="min-h-screen gap-6 p-4 bg-black">
      <StartupsSection startups={startups} />
    </div>
  )
}