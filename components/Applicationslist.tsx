import { Application } from "@/types/Application";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Github, Linkedin, Twitter, Mail } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";

interface ApplicationListProps {
  applications: Application[];
}

export function ApplicationList({ applications }: ApplicationListProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white mb-4">Applications</h2>
      <Accordion type="single" collapsible className="space-y-4">
        {applications.map((application) => (
          <AccordionItem
            key={application.id}
            value={application.id}
            className="animate-fadeIn"
          >
            <Card className="bg-secondary border-primary/20">
              <AccordionTrigger className="px-6 py-4 ">
                <div className="flex items-center space-x-4">
                  <img
                    src={application.user.image}
                    alt={application.user.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <Link href={`/profile/${application.user.id}`}><span className="text-lg font-medium text-white">
                    {application.user.name}
                  </span></Link>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4">
                <div className="space-y-4">
                  <div className="flex space-x-2">
                    {application.github && (
                      <a
                        href={application.github}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button size="sm" className="bg-pink-500">
                          <Github className="w-4 h-4" />
                        </Button>
                      </a>
                    )}
                    {application.linkedin && (
                      <Link
                        href={application.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button size="sm" className="bg-pink-500">
                          <Linkedin className="w-4 h-4" />
                        </Button>
                      </Link>
                    )}
                    {application.twitter && (
                      <a
                        href={application.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button size="sm" className="bg-pink-500">
                          <Twitter className="w-4 h-4" />
                        </Button>
                      </a>
                    )}
                    {application.user.email && (
                      <Link href={`mailto:${application.user.email}`}>
                        <Button size="sm" className="bg-pink-500">
                          <Mail className="w-4 h-4" />
                        </Button>
                      </Link>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      className="w-full bg-pink-500 text-white border-2 border-gray-600 px-4 py-2 rounded-full hover:bg-pink-600 transition-colors"
                    >
                      Accept
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full bg-red-600 border-primary/20 text-white hover:bg-red-600/90 hover:text-white"
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              </AccordionContent>
            </Card>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}