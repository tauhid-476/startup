"use client"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useToast } from "@/hooks/use-toast"
import type { StartupFormData } from "@/types/Startup"
import { apiClient } from "@/lib/apiclient"
import type { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props"
import FileUpload from "@/components/FileUpload"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"


const startupSchema = z.object({
    title: z.string().min(1, "Title is required").max(20, "Title must be less than 20 characters"),
    description: z.string().min(10, "Description is required").max(300, "Description must be less than 100 characters"),
    pitch: z.string().min(20, "Pitch is required").max(1000, "Pitch must be less than 1000 characters"),
    category: z.string().optional(),
    image: z.string().optional(),
    maxApplicants: z.number().min(1, "Maximum applicants must be at least 1"),
    hiringQuantity: z.number().min(1, "Hiring quantity must be at least 1")
})

const StartupForm = () => {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const { data: session } = useSession()
  const router = useRouter()
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<StartupFormData>({
    defaultValues: {
      title: "",
      description: "",
      pitch: "",
      category: undefined,
      image: undefined,
      maxApplicants: 1,
      hiringQuantity: 1,
    },
    resolver: zodResolver(startupSchema),
  })

  const title = watch("title")
  const description = watch("description")
  const pitch = watch("pitch")
  const image = watch("image")
  const maxApplicants = watch("maxApplicants")
  const hiringQuantity = watch("hiringQuantity")

  // Check if all required fields are filled
  const isFormValid =
    title.trim() !== "" &&
    description.trim() !== "" &&
    pitch.trim() !== "" &&
    image !== undefined &&
    maxApplicants > 0 &&
    hiringQuantity > 0

  const handleUploadSuccess = (response: IKUploadResponse) => {
    const imageUrl = response.url;
    setValue("image", imageUrl)
    toast({ title: "Success", description: "Image uploaded successfully" })
  }

  const onSubmit = async (data: StartupFormData) => {
    setLoading(true)
    try {
      const formattedData = {
        ...data,
        maxApplicants: Number(data.maxApplicants),
        hiringQuantity: Number(data.hiringQuantity),
      };

      await apiClient.createStartup(formattedData);

      toast({ title: "Success", description: "Startup created successfully" })
      setValue("title", "");
      setValue("description", "");
      setValue("pitch", "");
      setValue("category", "");
      setValue("image", "");
      setValue("maxApplicants", 1);
      setValue("hiringQuantity", 1);

      router.push(`/profile/${session?.user.id}`)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create startup",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1A1F2C] px-4 py-12">
      <div className="relative w-full max-w-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/30 to-purple-500/30 transform blur-3xl opacity-20" />

        <div className="relative bg-black/40 backdrop-blur-xl rounded-xl shadow-2xl border border-white/10">
          <div className="p-6 sm:p-8">
            <div className="mb-8 text-center">
              <h1 className="text-2xl font-semibold text-white mb-2">Create Your Startup</h1>
              <p className="text-pink-200/80">Fill in the details to get started</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-white">Startup Title</Label>
                <div className="form-field">
                  <Input
                    id="title"
                    className={`bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-pink-500/50 focus:ring-pink-500/30 input-animation ${errors.title ? "border-red-500/50" : ""
                      }`}
                    placeholder="Enter your startup name"
                    {...register("title")}
                  />
                </div>
                {errors.title && (
                  <p className="text-red-400 text-sm">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-white">Description</Label>
                <div className="form-field">
                  <Input
                    id="description"
                    className={`bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-pink-500/50 focus:ring-pink-500/30 input-animation ${errors.title ? "border-red-500/50" : ""
                    }`}
                    placeholder="Describe your startup"
                    {...register("description")}
                  />
                </div>
                {errors.description && (
                  <p className="text-red-400 text-sm">{errors.description.message}</p>
                )}
              </div>


              <div className="space-y-2">
                <Label htmlFor="pitch" className="text-white">Pitch</Label>
                <div className="form-field">
                  <Textarea
                    id="pitch"
                    className={`bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-pink-500/50 focus:ring-pink-500/30 min-h-[120px] input-animation ${errors.description ? "border-red-500/50" : ""
                      }`}
                    placeholder="Briefly elaborate your startup, its mission, and what makes it unique, etc."
                    {...register("pitch")}
                  />
                </div>
                {errors.pitch && (
                  <p className="text-red-400 text-sm">{errors.pitch.message}</p>
                )}
              </div>


              <div className="space-y-2">
                <Label htmlFor="category" className="text-white">Category</Label>
                <div className="form-field">
                  <Input
                    id="category"
                    className={`bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-pink-500/50 focus:ring-pink-500/30 input-animation ${errors.category ? "border-red-500/50" : ""
                      }`}
                    placeholder="e.g., Technology, Healthcare"
                    {...register("category")}
                  />
                </div>
                {errors.category && (
                  <p className="text-red-400 text-sm">{errors.category.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-white">Startup Image</Label>
                <FileUpload onSuccess={handleUploadSuccess} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxApplicants" className="text-white">Max Applicants</Label>
                  <div className="form-field">
                    <Input
                      id="maxApplicants"
                      type="number"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-pink-500/50 focus:ring-pink-500/30 input-animation"
                      placeholder="0"
                      {...register("maxApplicants", { valueAsNumber: true })}
                    />
                  </div>
                  {errors.maxApplicants && (
                    <p className="text-red-400 text-sm">{errors.maxApplicants.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hiringQuantity" className="text-white">Hiring Quantity</Label>
                  <div className="form-field">
                    <Input
                      id="hiringQuantity"
                      type="number"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-pink-500/50 focus:ring-pink-500/30 input-animation"
                      placeholder="0"
                      {...register("hiringQuantity", { valueAsNumber: true })}
                    />
                  </div>
                  {errors.hiringQuantity && (
                    <p className="text-red-400 text-sm">{errors.hiringQuantity.message}</p>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                className={`w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-medium py-2.5 rounded-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] ${loading ? "opacity-75 cursor-not-allowed" : ""
                  }`}
                disabled={loading || !isFormValid}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Creating...</span>
                  </div>
                ) : (
                  "Create Startup"
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StartupForm

