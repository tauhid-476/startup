import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Calendar, ArrowRight, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Startup } from "@/types/Startup";
import { formatDistanceToNow } from "date-fns";
import { getInitials } from "@/lib/utils";
import Link from "next/link";

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
                    {startups.map((startup) => (
                        <motion.div
                            key={startup.id}
                            variants={itemVariants}
                            whileHover={{ scale: 1.02 }}
                            className="group"
                        >
                            <Card className="bg-gray-900 border-gray-700 hover:border-gray-500 transition-colors duration-200 overflow-hidden">
                                <CardContent className="p-0">
                                    {/* Startup Image Section */}
                                    <div className="relative w-full h-48">
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
                                            <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                                                Inactive
                                            </div>
                                        )}
                                    </div>

                                    {/* Content Section */}
                                    <div className="p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <h3 className="text-lg font-semibold text-white group-hover:text-pink-400 transition-colors">
                                                    {startup.title}
                                                </h3>
                                                <Badge
                                                    variant="secondary"
                                                    className="mt-2 bg-gray-800 hover:bg-gray-600 text-gray-300"
                                                >
                                                    {startup.category || "Uncategorized"}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center space-x-2 text-gray-400 bg-gray-800 px-3 py-1 rounded-full">
                                                <Users className="w-4 h-4" />
                                                <span className="text-sm">
                                                    {startup.hiringQuantity}/{startup.maxApplicants}
                                                </span>
                                            </div>
                                        </div>

                                        <p className="text-gray-300 text-sm mb-6 line-clamp-2">
                                            {startup.description}
                                        </p>

                                        <div className="flex items-center justify-between border-t border-gray-700 pt-4">
                                            <div className="flex items-center space-x-2">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={startup.postedBy.image} />
                                                    <AvatarFallback>
                                                        {getInitials(startup.postedBy.name)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex flex-col">
                                                    <span className="text-sm text-gray-300">
                                                        {startup.postedBy.name}
                                                    </span>
                                                    <div className="flex items-center text-gray-400">
                                                        <Calendar className="w-3 h-3 mr-1" />
                                                        <span className="text-xs">
                                                            {formatDistanceToNow(new Date(startup.createdAt), { addSuffix: true })}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <Link href={`/startups/${startup.id}`}>
                                                <Button
                                                    variant="secondary"
                                                    className="w-full text-white bg-pink-500 border-2 border-pink-500 px-4 py-2 rounded-full hover:bg-pink-400 transition-colors">
                                                    View Details
                                                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            </CardContent>
        </Card>
    );
}
