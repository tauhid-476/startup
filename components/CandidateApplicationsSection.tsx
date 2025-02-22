import { Application } from '@/types/Application'
import Image from 'next/image';
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";


interface ApplicationsProps {
  applications: Application[]
}

function CandidateApplicationsSection({ applications }: ApplicationsProps) {

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "PENDING":
        return "bg-yellow-500 hover:bg-yellow-600";
      case "ACCEPTED":
        return "bg-green-500 hover:bg-green-600";
      case "REJECTED":
        return "bg-red-500 hover:bg-red-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  return (
    <Card className="bg-black border-gray-500 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white text-xl md:text-2xl">Your Applications</CardTitle>
      </CardHeader>
      <CardContent>
        {applications.length === 0 ? (
          <p className="text-gray-300">You have not applied to any startups yet.</p>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {applications.map((application) => (
              <motion.div key={application.id} whileHover={{ scale: 1.02 }} className="group">
                <Card className="bg-gray-900 border-gray-700 hover:border-gray-500 transition-colors duration-200 overflow-hidden h-[28rem]">
                  <CardContent className="p-0">
                    {/* Startup Image Section */}
                    <div className="relative w-full h-48">
                      {application.startup.image ? (
                        <Image
                          src={application.startup.image}
                          alt={application.startup.title}
                          layout="fill"
                          objectFit="cover"
                          className="rounded-t-lg"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                          <span className="text-gray-400 text-4xl font-bold">
                            {application.startup.title.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content Section */}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-white group-hover:text-pink-400 transition-colors mb-3">
                            {application.startup.title}
                          </h3>
                          <span
                            className={`text-white px-3 py-1 rounded-full ${getStatusColor(
                              application.status
                            )}`}
                >
                          {application.status}
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-300 text-sm mb-6 line-clamp-2">
                      {application.startup.description}
                    </p>

                    <div className="flex items-center justify-between border-t border-gray-700 pt-4 text-sm text-gray-400">
                      <p>Applied on: {new Date(application.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              </motion.div>
        ))}
      </motion.div>
        )}
    </CardContent>
    </Card >
  );
}

export default CandidateApplicationsSection