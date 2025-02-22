"use client"
import { motion } from 'framer-motion';
import { ArrowRight, Loader, Rocket, Users } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect } from 'react';

export default function Home() {
  const { data: session, status } = useSession()
  const isFounder = session?.user.role === "FOUNDER"

  useEffect(() => {
    console.log(session?.user.id)
  })

  if(status === "loading")
    return <div className="min-h-screen flex items-center justify-center">
      <Loader className="h-10 w-10 animate-spin text-white" />
    </div>

  return (
    <div className="min-h-screen overflow-hidden bg-black text-white">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-pink">
          <motion.div
            className="absolute inset-0"
            style={{
              backgroundImage: 'radial-gradient(circle at 25px 25px, pink 2%, transparent 0%), radial-gradient(circle at 75px 75px, pink 2%, transparent 0%)',
              backgroundSize: '100px 100px'
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ duration: 1 }}
          />
        </div>

        {/* Content */}
        <div className="min-h-screen relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Connect with the Next Big Thing
            </h1>
            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
              Whether you&apos;re building the future or looking to join groundbreaking startups,
              we&apos;re here to make the connection happen.
            </p>

            {/* Buttons Container */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              {/* Show both buttons when no session */}
              {!session ? (
                <>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link href="/register">
                      <button className="group flex items-center gap-2 bg-pink-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-pink-600 transition-colors">
                        <Rocket className="w-5 h-5" />
                        Build your startup
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </Link>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link href="/startups">
                      <button className="group flex items-center gap-2 bg-white text-pink-500 border-2 border-pink-500 px-8 py-4 rounded-full text-lg font-semibold hover:bg-pink-50 transition-colors">
                        <Users className="w-5 h-5" />
                        Find Startups
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </Link>
                  </motion.div>
                </>
              ) : (
                // Show only relevant button based on role when session exists
                isFounder ? (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link href={`/profile/${session.user.id}`}>
                      <button className="group flex items-center gap-2 bg-pink-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-pink-600 transition-colors">
                        <Rocket className="w-5 h-5" />
                        Browse your startups
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </Link>
                  </motion.div>
                ) : (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link href="/startups">
                      <button className="group flex items-center gap-2 bg-white text-pink-500 border-2 border-pink-500 px-8 py-4 rounded-full text-lg font-semibold hover:bg-pink-50 transition-colors">
                        <Users className="w-5 h-5" />
                        Find Startups
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </Link>
                  </motion.div>
                )
              )}
            </div>
          </motion.div>

          {/* Floating Elements */}
          <motion.div
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            className="absolute top-20 right-20 w-20 h-20 bg-pink-200 rounded-full opacity-20"
          />
          <motion.div
            animate={{
              y: [0, 10, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            className="absolute bottom-20 left-20 w-16 h-16 bg-pink-300 rounded-full opacity-20"
          />
        </div>
      </motion.div>
    </div>
  );
}
