import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Calendar, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Startup } from "@/types/Startup";
import { formatDistanceToNow } from "date-fns";
import { getInitials } from "@/lib/utils";
import Link from "next/link";
import { useSession } from "next-auth/react";
interface StartupsSectionProps {
    startups: Startup[];
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5
        }
    }
};

export default function StartupsSection({ startups }: StartupsSectionProps) {

    const { data: session } = useSession();
    const userId = session?.user.id

    const hasUserApplied = (startup: Startup) => {
        if (!session?.user?.id || !startup.applications) return false;
        return startup.applications.some(
            application => application.applicantId === userId
        );
    };

    return (
        <Card className="bg-black border-gray-500 backdrop-blur-sm">
            <CardHeader className="flex flex-row justify-between items-center">
                <CardTitle className="text-white text-xl md:text-2xl">Most Recent Startups:</CardTitle>
            </CardHeader>
            <CardContent>
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                    {startups.map((startup) => {
                        const applied = hasUserApplied(startup)
                        return (
                            <motion.div
                                key={startup.id}
                                variants={itemVariants}
                                whileHover={{ scale: 1.02 }}
                                className="group"
                            >
                                <Card className="bg-gray-900 border-gray-700 hover:border-gray-500 transition-colors duration-200 overflow-hidden h-[24rem] flex flex-col md:h-[26rem]">
                                    <CardContent className="p-0 flex flex-col h-full">
                                        {/* Image Section - Responsive height */}
                                        <div className="relative w-full h-40 md:h-48 flex-shrink-0">
                                            {startup.image ? (
                                                <img
                                                    src={startup.image}
                                                    alt={startup.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                                                    <span className="text-gray-400 text-4xl font-bold">
                                                        {startup.title.charAt(0)}
                                                    </span>
                                                </div>
                                            )}
                                            {!startup.isActive && (
                                                <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                                                    Inactive
                                                </div>
                                            )}
                                        </div>

                                        {/* Content Section - Optimized for 2-line description */}
                                        <div className="p-4 flex flex-col flex-grow">
                                            <div className="flex items-start justify-between mb-3">
                                                <div>
                                                    <h3 className="text-base md:text-lg font-semibold text-white group-hover:text-pink-400 transition-colors">
                                                        {startup.title}
                                                    </h3>
                                                    <Badge
                                                        variant="secondary"
                                                        className="mt-1 bg-gray-800 hover:bg-gray-600 text-gray-300 text-xs"
                                                    >
                                                        {startup.category || "Uncategorized"}
                                                    </Badge>
                                                </div>
                                                <div className="flex items-center space-x-1 text-gray-400 bg-gray-800 px-2 py-1 rounded-full text-xs">
                                                    <Users className="w-3 h-3" />
                                                    <span>{startup.currentApplicants}/{startup.maxApplicants}</span>
                                                </div>
                                            </div>

                                            {/* Description - 2 lines with ellipsis */}
                                            <p className="text-gray-300 text-sm line-clamp-1 md:line-clamp-2 mb-4 flex-grow">
                                                {startup.description}
                                            </p>

                                            {/* Footer Section - Compact and responsive */}
                                            <div className="flex items-center justify-between border-t border-gray-700 pt-3 mt-auto flex-col sm:flex-row gap-2">
                                                <div className="flex items-center space-x-2">
                                                    <Avatar className="h-7 w-7">
                                                        <AvatarImage src={startup.postedBy.image} />
                                                        <AvatarFallback>{getInitials(startup.postedBy.name)}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex flex-col">
                                                        <span className="text-xs text-gray-300">{startup.postedBy.name}</span>
                                                        <div className="flex items-center text-gray-400">
                                                            <Calendar className="w-3 h-3 mr-1" />
                                                            <span className="text-xs">
                                                                {formatDistanceToNow(new Date(startup.createdAt), { addSuffix: true })}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                {applied ? (
                                                    <Button
                                                        disabled
                                                        className="text-white bg-green-500 border-2 border-green-500 px-3 py-1 rounded-full hover:bg-green-400 transition-colors cursor-not-allowed text-xs w-full sm:w-auto"
                                                    >
                                                        Applied
                                                        <CheckCircle className="w-3 h-3 ml-1" />
                                                    </Button>
                                                ) : (
                                                    <Link href={`/startups/${startup.id}`}>
                                                        <Button
                                                            variant="secondary"
                                                            className="text-white bg-pink-500 border-2 border-pink-500 px-3 py-1 rounded-full hover:bg-pink-400 transition-colors text-xs w-full sm:w-auto"
                                                        >
                                                            View
                                                            <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                                                        </Button>
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )
                    })}
                </motion.div>
            </CardContent>
        </Card>
    );
}
