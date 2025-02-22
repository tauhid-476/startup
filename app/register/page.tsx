'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';


function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await response.json();

      if (response.ok) toast({ title: 'Account created successfully', description: 'You can now login to your account' });

      if (!response.ok) {
        toast({ title: 'Error', description: data.message || 'Something went wrong', variant: "destructive" });
      }

      router.push('/login');

    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-black border border-gray-500 rounded-2xl shadow-xl p-8"
      >
        <h1 className="text-3xl font-bold text-center text-white mb-8">
          Create Account
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2">
              Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full text-white pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all"
                placeholder="Enter your name"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full text-white pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-400 mb-2">
              Select Role
            </label>
            <Select onValueChange={setRole}>
              <SelectTrigger className='bg-black text-white'>
                <SelectValue className='text-gray-400' placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent className='bg-black text-white'>
                <SelectItem value="FOUNDER">Founder</SelectItem>
                <SelectItem value="CANDIDATE">Candidate</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full text-white pl-10 pr-10 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all"
                placeholder="Create a password"
              />
              {showPassword ? (
                <EyeOff
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                />
              ) : (
                <Eye
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                />
              )}
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02, boxShadow: "0px 4px 10px rgba(233, 30, 99, 0.3)" }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-red-500 text-white py-3 rounded-lg font-medium transition-all duration-300 ease-in-out hover:from-pink-600 hover:to-red-600 focus:ring-2 focus:ring-pink-400 focus:ring-offset-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin h-5 w-5" />
                <span>Creating Account...</span>
              </>
            ) : (
              "Create Account"
            )}
          </motion.button>


          <p className="text-center text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="text-pink-500 hover:text-pink-600 font-bold">
              Sign In
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
}

export default Register;
