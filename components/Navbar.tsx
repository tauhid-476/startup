"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Menu, X, Rocket, User } from "lucide-react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useToast } from "@/hooks/use-toast"
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  const { toast } = useToast();
  const router = useRouter();;
  const isFounder = session?.user.role === "FOUNDER";

  const handleSignout = async () => {
    try {
      await signOut({redirect: false});
      toast({ title: "Successfully signed out" });
      router.push("/");
    } catch (error) {
      toast({ title: "An error occurred", variant: "destructive" });
      console.error('Error signing out:', error)
    }
  }

  return (
    <nav className="fixed top-0 left-0  w-full bg-black text-white backdrop-blur-lg z-50 border-b border-gray-600">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className=" flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }}>
              <Rocket className="h-8 w-8 text-pink-500" />
            </motion.div>
            <span className="font-bold text-xl text-white">StartupHub</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {!isFounder && (
              <Link
                href="/startups"
                className="block text-white hover:text-gray-500 transition-colors"
              >
                Browse Startups
              </Link>
            )}
            <div className="flex items-center space-x-4">
              {session ? (
                <>
                  <Link href={`/profile/${session.user?.id}`} className="flex items-center space-x-2 text-gray-400 hover:text-gray-500 transition-colors">
                    <User className="h-6 w-6" />
                    <span>{session.user?.name || "Profile"}</span>
                  </Link>
                  <motion.button
                    onClick={handleSignout}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-pink-500 text-white border-2 border-gray-600 px-4 py-2 rounded-full hover:bg-pink-600 transition-colors"
                  >
                    Sign Out
                  </motion.button>
                </>
              ) : (
                <>
                  <Link href={"/login"}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-pink-500 text-white border-2 px-4 py-2 rounded-full hover:bg-pink-600 transition-colors"
                    >
                      Sign In
                    </motion.button>
                  </Link>
                  <Link href={"/register"}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-white text-pink-500 border-2 border-pink-500 px-4 py-2 rounded-full hover:bg-pink-50 transition-colors"
                    >
                      Sign Up
                    </motion.button>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 hover:text-pink-500 transition-colors">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: isOpen ? 1 : 0, height: isOpen ? "auto" : 0 }}
        transition={{ duration: 0.3 }}
        className="md:hidden bg-black border-t border-gray-400"
      >
        <div className="px-4 py-4 space-y-4">
          {!isFounder && (
            <Link
              href="/startups"
              className="block text-white hover:text-pink-500 transition-colors"
            >
              Browse Startups
            </Link>
          )}

          <div className="space-y-2">
            {session ? (
              <>
                <Link href={`/profile/${session.user?.id}`} className="block text-white hover:text-pink-500 transition-colors">
                  Profile
                </Link>
                <Button
                  onClick={() => signOut()}
                  variant="secondary"
                  className="w-full bg-white text-pink-500 border-2 border-pink-500 px-4 py-2 rounded-full hover:bg-pink-50 transition-colors"  
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <button onClick={() => signIn()} className="w-full bg-pink-500 text-white px-4 py-2 rounded-full hover:bg-pink-600 transition-colors">
                  Sign In
                </button>
                <button onClick={() => signIn()} className="w-full bg-white text-pink-500 border-2 border-pink-500 px-4 py-2 rounded-full hover:bg-pink-50 transition-colors">
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </nav>
  );
};

export default Navbar;
