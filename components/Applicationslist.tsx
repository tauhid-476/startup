import { Application } from "@/types/Application";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Github, Linkedin, Twitter, Mail, Loader } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/apiclient";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";


interface ApplicationListProps {
  applications: Application[];
  startupId: string
}

type DialogState = {
  isOpen: boolean;
  type: "ACCEPTED" | "REJECTED" | null;
  applicationId: string | null;
};


//accept / reject functionality
export function ApplicationList(
  { applications: initialApplications,
    startupId
  }: ApplicationListProps) {

  const [applications, setApplications] = useState<Application[]>(initialApplications)
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [loadingApplicationId, setLoadingApplicationId] = useState<string | null>(null);
  const [dialogState, setDialogState] = useState<DialogState>({
    isOpen: false,
    type: null,
    applicationId: null,
  });
  const { toast } = useToast();

  console.log(selectedApplication)

  const handleOpenDialog = (applicationId: string, type: "ACCEPTED" | "REJECTED") => {
    setDialogState({
      isOpen: true,
      type,
      applicationId,
    });
  };

  const handleCloseDialog = () => {
    setDialogState({
      isOpen: false,
      type: null,
      applicationId: null,
    });
  };


  const handleApplicationStatus = async (applicationId: string, status: "ACCEPTED" | "REJECTED") => {
    setLoadingApplicationId(applicationId);
    try {

      const response = await apiClient.updateApplicationStatus(startupId, applicationId, status)

      setApplications(prev => prev.map(app =>
        app.id === applicationId ? { ...app, status: response.status } : app
      ));

      console.log("response object from hiring is", response)

      toast({
        title: `Application ${status.toLowerCase()}`,
        description: `Successfully ${status.toLowerCase()} the application from ${response.user.name}`,
        variant: "default"
      });

    } catch (error) {
      toast({ title: "Error", description: "Something went wrong", variant: "destructive" })
      console.log(error, "error");
    } finally {
      setLoadingApplicationId(null);
    }
  }

  const getApplicationById = (id: string) => {
    return applications.find(app => app.id === id);
  };

  if (applications.length === 0) return (
    <div className="text-white">No applications yet</div>
  )

  return (
    <div className="space-y-4">
    <h2 className="text-2xl font-bold text-white mb-4">Applications</h2>
    
    <AlertDialog  open={dialogState.isOpen} onOpenChange={handleCloseDialog}>
      <AlertDialogContent className="bg-black text-white">
        <AlertDialogHeader>
          <AlertDialogTitle>
            {dialogState.type === "ACCEPTED" ? "Accept Application" : "Reject Application"}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-white">
            Are you sure you want to {dialogState.type === "ACCEPTED" ? "accept" : "reject"} the application from{" "}
            {dialogState.applicationId && getApplicationById(dialogState.applicationId)?.user.name}?
            {dialogState.type === "ACCEPTED" && " This will mark them as hired."}
            {dialogState.type === "REJECTED" && " This action cannot be undone."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-gray-600 hover:bg-gray-700" >Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              if (dialogState.applicationId && dialogState.type) {
                handleApplicationStatus(dialogState.applicationId, dialogState.type);
              }
            }}
            className={dialogState.type === "ACCEPTED" ? "bg-pink-500 hover:bg-pink-600" : "bg-red-600 hover:bg-red-700"}
          >
            {dialogState.type === "ACCEPTED" ? "Accept" : "Reject"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

    <Accordion type="single" collapsible className="space-y-4">
      {applications.map((application) => (
        <AccordionItem
          onClick={() => setSelectedApplication(application)}
          key={application.id}
          value={application.id}
          className="animate-fadeIn"
        >
          <Card className="bg-secondary border-primary/20">
            <AccordionTrigger className="px-6 py-4">
              <div className="flex items-center space-x-4">
                <img
                  src={application.user.image}
                  alt={application.user.name}
                  className="w-12 h-12 rounded-full"
                />
                <Link href={`/profile/${application.user.id}`}>
                  <span className="text-lg font-medium text-white">
                    {application.user.name}
                  </span>
                </Link>
                {application.status && (
                  <span className={`ml-2 px-2 py-1 rounded text-sm ${
                    application.status === "ACCEPTED" ? "bg-green-500" : 
                    application.status === "REJECTED" ? "bg-red-500" : 
                    "bg-gray-500"
                  }`}>
                    {application.status}
                  </span>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-4">
              <div className="space-y-4">
                <div className="flex space-x-2">
                  {application.github && (
                    <Link href={application.github} target="_blank" rel="noopener noreferrer">
                      <Button size="sm" className="bg-pink-500">
                        <Github className="w-4 h-4" />
                      </Button>
                    </Link>
                  )}
                  {application.linkedin && (
                    <Link href={application.linkedin} target="_blank" rel="noopener noreferrer">
                      <Button size="sm" className="bg-pink-500">
                        <Linkedin className="w-4 h-4" />
                      </Button>
                    </Link>
                  )}
                  {application.twitter && (
                    <Link href={application.twitter} target="_blank" rel="noopener noreferrer">
                      <Button size="sm" className="bg-pink-500">
                        <Twitter className="w-4 h-4" />
                      </Button>
                    </Link>
                  )}
                  {application.user.email && (
                    <Link href={`mailto:${application.user.email}`}>
                      <Button size="sm" className="bg-pink-500">
                        <Mail className="w-4 h-4" />
                      </Button>
                    </Link>
                  )}
                </div>
                {application.status ==="PENDING" && (
                  <div className="flex space-x-2">
                    <Button
                      className="w-full bg-pink-500 text-white border-2 border-gray-600 px-4 py-2 rounded-full hover:bg-pink-600 transition-colors"
                      onClick={() => handleOpenDialog(application.id, "ACCEPTED")}
                      disabled={loadingApplicationId === application.id}
                    >
                      {loadingApplicationId === application.id ? (
                        <Loader className="w-4 h-4 animate-spin" />
                      ) : (
                        "Accept"
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full bg-red-600 border-primary/20 text-white hover:bg-red-600/90 hover:text-white"
                      onClick={() => handleOpenDialog(application.id, "REJECTED")}
                      disabled={loadingApplicationId === application.id}
                    >
                      {loadingApplicationId === application.id ? (
                        <Loader className="w-4 h-4 animate-spin" />
                      ) : (
                        "Reject"
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </AccordionContent>
          </Card>
        </AccordionItem>
      ))}
    </Accordion>
  </div>
  );
}