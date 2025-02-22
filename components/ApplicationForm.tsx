"use client"

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { apiClient } from '@/lib/apiclient';
// import { ApplicationFormData } from '@/types/Application';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

interface ApplicationFormProps {
  startupId: string;
}

const githubRegex = /^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,37}[a-zA-Z0-9]\/?$/;
const twitterRegex = /^https?:\/\/(www\.)?(twitter|x)\.com\/[a-zA-Z[a-zA-Z0-9_]{3,14}\/?$/;
// const linkedinRegex = /^https:\/\/(www\.)?linkedin\.com\/in\/[\w\-\.]{3,100}\/?$/;

const applicationSchema = z.object({
    github: z.string().regex(githubRegex, "Invalid GitHub profile link").optional(),
    twitter: z.string().regex(twitterRegex, "Invalid Twitter/X profile link").optional(),
    linkedin: z.string().optional(),
});

type ApplicationFormData = z.infer<typeof applicationSchema>

const ApplicationForm = ({ startupId }: ApplicationFormProps) => {
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  
  const { register, handleSubmit, formState: { errors } } = useForm<ApplicationFormData>({
    defaultValues: {
        github: '',
        twitter: '',
        linkedin: '',
    },
    resolver: zodResolver(applicationSchema),
  });

  const onSubmit = async (data: ApplicationFormData) => {
    setSubmitting(true);
    console.log("data from frontend",data)
    try {
      await apiClient.createApplication(data,startupId);
      console.log("data from frontend si",data)
      toast({
        title: "Success",
        description: "Your application has been submitted!",
      });
      router.push("/startups")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive",
      });
      console.error("Error submitting application:", error);
    } finally {
      setSubmitting(false);
    }
  };
//
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="github">GitHub Profile</label>
        <input
          {...register("github")}
          type="url"
          className='w-full border border-gray-300 rounded-full px-4 py-2 text-white'
          placeholder="https://github.com/username"
        />
        {errors.github && <span className='text-red-500'>{errors.github.message}</span>}
      </div>

      <div>
        <label htmlFor="twitter">Twitter Profile</label>
        <input
          {...register("twitter")}
          type="url"
          className='w-full border border-gray-300 rounded-full px-4 py-2 text-white'
          placeholder="https://twitter.com/username"
        />
        {errors.twitter && <span className='text-red-500'>{errors.twitter.message}</span>}
      </div>

      <div>
        <label htmlFor="LinkedIn">Linkedin Profile</label>
        <input
          {...register("linkedin")}
          className='w-full border border-gray-300 rounded-full px-4 py-2 text-white'
          type="url"
          placeholder="https://linkedin.com/username"
        />
        {errors.linkedin && <span className='text-red-500'>{errors.linkedin.message}</span>}
      </div>
      
      {/* Similar fields for Twitter and LinkedIn */}
      
      <button 
        type="submit" 
        disabled={submitting}
        className="w-full bg-pink-500 text-white rounded-full px-4 py-2"
      >
        {submitting ? "Submitting..." : "Submit Application"}
      </button>
    </form>
  );
};

export default ApplicationForm;