import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { Startup } from "@/types/Startup";
import { Badge } from "@/components/ui/badge";
import { getInitials } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useState } from "react";
import { apiClient } from "@/lib/apiclient";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";

interface StartupCardProps {
  startup: Startup;
}

const startupStatusSchema = z.object({
  isActive: z.boolean()
});

export function StartupCardDetails({ startup }: StartupCardProps) {
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const { data: session } = useSession();
  const { toast } = useToast();

  const { setValue, watch } = useForm({
    resolver: zodResolver(startupStatusSchema),
    defaultValues: {
      isActive: false
    }
  });

  const userId = session?.user.id

  const isOwner = startup.postedById === userId
  console.log("isowner from startup details card.tsx", isOwner)

  const isActive = watch("isActive");

  const fetchStartupStatus = useCallback(async () => {
    try {
      setIsSwitchLoading(true);
      const response = await apiClient.getStartup(startup.id);
      setValue("isActive", response.isActive);
      console.log("response from startup details card.tsx", response)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch status settings",
        variant: "destructive"
      });
      console.log("error from startup details card.tsx", error)
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue, startup.id, toast]);

  useEffect(() => {
    if (!session?.user) return;
    if (isOwner) {
      fetchStartupStatus();
    }
  }, [session, fetchStartupStatus]);

  const handleSwitchChange = async () => {
    try {
      setIsSwitchLoading(true);
      const response = await apiClient.updateStartupStatus(startup.id, { isActive: !isActive });

      setValue("isActive", response.isActive);
      toast({
        title: "Success",
        description: `Startup ${response.isActive ? "activated" : "deactivated"} successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive"
      });
     console.log("error from startup details card.tsx", error)
    } finally {
      setIsSwitchLoading(false);
    }
  };

  return (
    <Card className="p-6 bg-secondary h-full animate-fadeIn border border-gray-600">
      <div className="space-y-4">
        {startup.image && (
          <img
            src={startup.image}
            alt={startup.title}
            className="w-full h-48 object-cover rounded-lg"
          />
        )}
        <div className="flex items-center justify-between">
          <Badge className="bg-primary text-white">{startup.category}</Badge>
          <div className="flex items-center gap-2">
            {isOwner && (
              <>
                <span className="text-sm text-gray-300">
                  {isActive ? "Active" : "Inactive"}
                </span>
                <Switch
                  checked={isActive}
                  onCheckedChange={handleSwitchChange}
                  disabled={isSwitchLoading}
                  className="data-[state=checked]:bg-green-500"
                />
              </>
            )}
            {isSwitchLoading && (
              <Loader2 className="h-4 w-4 animate-spin text-gray-300" />
            )}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white mb-2">{startup.title}</h2>
          <p className="text-gray-300 mb-4">{startup.description}</p>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-white">Pitch</h3>
          <p className="text-gray-300">{startup.pitch}</p>
        </div>

        <div className="flex items-center justify-between mt-4 text-gray-300">
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={startup.postedBy?.image ?? ""} />
              <AvatarFallback>
                {startup.postedBy?.name ? getInitials(startup.postedBy.name) : "N/A"}
              </AvatarFallback>
            </Avatar>
            <span>{startup.postedBy?.name ?? "Unknown"}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">
              {startup.currentApplicants}/{startup.maxApplicants} applicants
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}