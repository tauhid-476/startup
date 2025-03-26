"use client"
import ApplicationForm from '@/components/ApplicationForm';
import { ApplicationList } from '@/components/Applicationslist';
import { StartupCardDetails } from '@/components/StartupDetailsCard';
import { useToast } from '@/hooks/use-toast';
import { apiClient } from '@/lib/apiclient';
import { Application } from '@/types/Application';
import { Startup } from '@/types/Startup';
import { Loader } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

function StartupDashboard({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const [startup, setStartup] = useState<Startup | null>(null);
    const [startupId, setStartupId] = useState<string>("");
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [isOwner, setIsOwner] = useState(false);
    const { toast } = useToast()
    const { data: session, status } = useSession()
    const router = useRouter()

    const isCandidate = session?.user.role === "CANDIDATE";

    useEffect(() => {
        const getStartupId = async () => {
            const id = (await params).id
            setStartupId(id);
        };
        getStartupId();
    }, [params]);

    useEffect(() => {
        if (status === "loading") return;
        if (!session) {
            router.push("/login");
            return;
        }
    }, [session, status, router]);


    useEffect(() => {
        const fetchStartupAndItsApplications = async () => {
            if (status === "loading" || !session || !startupId) return;
            setLoading(true)
            try {
                const fetchedStartup = await apiClient.getStartup(startupId);
                setStartup(fetchedStartup);

                const owner = session.user.id === fetchedStartup.postedById;
                setIsOwner(owner);
                if (!owner && session.user.role !== "CANDIDATE") {
                    toast({
                        title: "Access Denied",
                        description: "You must be either the startup owner or a candidate to access this page.",
                        variant: "destructive"
                    });
                    router.push("/");
                    return;
                }

                if (owner) {
                    const applications = await apiClient.getstartupApplications(startupId);
                    setApplications(applications);
                    if (!applications || applications.length === 0) {
                        toast({
                            title: "No applications found",
                            description: "There are no applications at this time.",
                            variant: "default"
                        });
                    }
                }
            } catch (error) {
                console.error(error);
                toast({
                    title: "Error",
                    description: "An error occurred while fetching data. Please try again later.",
                    variant: "destructive"
                });
            } finally {
                setLoading(false);
            }
        }
        fetchStartupAndItsApplications()

    }, [startupId, toast, session, status, router])


    if (loading) {
        return <div className="min-h-screen bg-black flex items-center justify-center">
            <Loader className='w-10 h-10 text-white animate-spin' />
        </div>;
    }

    if (!startup) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <p className="text-white">Startup not found</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black">
            <div className="container px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="animate-fadeIn">
                        {startup && <StartupCardDetails startup={startup} />}
                    </div>
                    <div>
                        {isOwner && <ApplicationList applications={applications} startupId={startup?.id || ""} />}
                        {isCandidate && startup && <ApplicationForm startupId={startupId} />}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StartupDashboard