"use client"
import StartupsSection from "@/components/HomeStartups"
import { apiClient } from '@/lib/apiclient'
import { Startup } from '@/types/Startup'
import { useToast } from '@/hooks/use-toast'
import React, { useEffect, useState } from 'react'
import { Loader, Search } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useSearchParams } from 'next/navigation'

// Global cache to store startups data
let cachedStartups: Startup[] | null = null

export default function StartupsPage() {
  const [startups, setStartups] = useState<Startup[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [searching, setSearching] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const loadStartups = async () => {
      if (cachedStartups) {
        // Use cached data if available
        setStartups(cachedStartups)
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const response = await apiClient.getStartups()
        setStartups(response)
        // Update the cache
        cachedStartups = response
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

    loadStartups()
  }, [toast])

  const handleSearch = async (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault()
    
    if (!searchQuery.trim()) {
      // If search query is empty, reset to all startups
      if (cachedStartups) {
        setStartups(cachedStartups)
      }
      return
    }

    try {
      setSearching(true)
      const searchResults = await apiClient.searchStartups(searchQuery)
      setStartups(searchResults)
    } catch (error) {
      console.error('Error searching startups:', error)
      toast({
        title: "Error",
        description: "Failed to search startups. Please try again later.",
        variant: "destructive"
      })
    } finally {
      setSearching(false)
    }
  }

  if (loading) {
    return (
      <div className="flex bg-black items-center min-h-screen justify-center">
        <Loader className="h-12 w-12 animate-spin text-white" />
      </div>
    )
  }

  return (
    <div className="min-h-screen gap-6 p-4 bg-black">
      <div className="mb-6">
        <form onSubmit={handleSearch} className="flex space-x-2">
          <div className="relative flex-1">
            <Input
              placeholder="Search startups by title, category, description or founder name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-gray-900 border-gray-700 text-white pr-10"
            />
            {searching && (
              <div className="absolute right-3 top-2">
                <Loader className="h-5 w-5 animate-spin text-gray-400" />
              </div>
            )}
          </div>
          <Button 
            type="submit" 
            className="bg-pink-500 hover:bg-pink-600 text-white"
            disabled={searching}
          >
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
          {searchQuery && (
            <Button 
              type="button"
              variant="outline"
              className="border-gray-700 bg-white text-pink-400"
              onClick={() => {
                setSearchQuery("")
                if (cachedStartups) {
                  setStartups(cachedStartups)
                }
              }}
            >
              Clear
            </Button>
          )}
        </form>
      </div>
      <StartupsSection startups={startups} />
    </div>
  )
}