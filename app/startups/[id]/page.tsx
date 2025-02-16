"use client"
import ApplicationForm from '@/components/ApplicationForm';
import { ApplicationList } from '@/components/Applicationslist';
import { StartupCard } from '@/components/StartupDetailsCard';
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
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [isOwner, setIsOwner] = useState(false);
    const { toast } = useToast()
    const { data: session, status } = useSession()
    const router = useRouter()

    const isCandidate = session?.user.role ==="CANDIDATE"

    useEffect(() => {
        if (status === "loading") return;
        if (!session) {
            router.push("/login");
            return;
        }
    }, [session, status, router]);


    useEffect(() => {
        setLoading(true);
        const fetchStartup = async () => {
            const startupId = (await params).id
            setLoading(true);
            try {
                const startup = await apiClient.getStartup(startupId);
                setStartup(startup);

                const ownerStatus = session?.user.id === startup.postedBy.id;
                setIsOwner(ownerStatus);

                if (!isOwner && !isCandidate) {
                    toast({ title: "Access Denied", description: "You do not own this startup.", variant: "destructive" });
                    router.push("/");
                    return;
                }

            } catch (error) {
                console.log(error);
                toast({ title: 'Error fetching startup', description: 'Please try again later', variant: 'destructive' });
            } finally {
                setLoading(false);
            }
        }

        const fetchStartupApplications = async () => {
            const startupId = (await params).id
            setLoading(true);
            try {
                if (isOwner) {
                    const applicationsData = await apiClient.getstartupApplications(startupId);
                    setApplications(applicationsData);
                }
            } catch (error) {
                console.log(error)
                toast({ title: 'Error fetching startup applications', description: 'Please try again later', variant: 'destructive' });
            } finally {
                setLoading(false);
            }
        }

        fetchStartup();
        fetchStartupApplications();

    }, [params, session])


    if (loading) {
        return <div className="min-h-screen bg-black flex items-center justify-center">
            <Loader className='w-10 h-10 text-white animate-spin' />
        </div>;
    }


    return (
        <div className="min-h-screen bg-black">
            <div className="container px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="animate-fadeIn">
                        {startup && <StartupCard startup={startup} />}
                    </div>
                    <div>
                        {isOwner ? (
                            <ApplicationList applications={applications} />
                        ) : (
                            startup && <ApplicationForm startupId={startup.id} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StartupDashboard