"use client"

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { apiClient } from '@/lib/apiclient';
import { ApplicationFormData } from '@/types/Application';

interface ApplicationFormProps {
  startupId: string;
}

const ApplicationForm = ({ startupId }: ApplicationFormProps) => {
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  
  const { register, handleSubmit, formState: { errors } } = useForm<ApplicationFormData>({
    defaultValues: {
        github: '',
        twitter: '',
        linkedin: '',
    }
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
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

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
        {errors.github && <span>{errors.github.message}</span>}
      </div>

      <div>
        <label htmlFor="twitter">Twitter Profile</label>
        <input
          {...register("twitter")}
          type="url"
          className='w-full border border-gray-300 rounded-full px-4 py-2 text-white'
          placeholder="https://twitter.com/username"
        />
        {errors.twitter && <span>{errors.twitter.message}</span>}
      </div>

      <div>
        <label htmlFor="LinkedIn">Linkedin Profile</label>
        <input
          {...register("linkedin")}
          className='w-full border border-gray-300 rounded-full px-4 py-2 text-white'
          type="url"
          placeholder="https://linkedin.com/username"
        />
        {errors.linkedin && <span>{errors.linkedin.message}</span>}
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