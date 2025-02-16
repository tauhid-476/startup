import { Card } from "@/components/ui/card";
import { Startup } from "@/types/Startup";
import { Badge } from "@/components/ui/badge";
import { getInitials } from "@/lib/utils";

interface StartupCardProps {
  startup: Startup;
}

export function StartupCard({ startup }: StartupCardProps) {
  return (
    <Card className="p-6 bg-secondary h-full animate-fadeIn border border-gray-600">
      <div className="space-y-4">
        {startup.image && (
          <img
            src={startup.image}
            alt={startup.title}
            className="w-full h-48 object-cover rounded-lg"
          />
        )}
        <div>
          <Badge className="mb-2 bg-primary text-white">{startup.category}</Badge>
          <h2 className="text-2xl font-bold text-white mb-2">{startup.title}</h2>
          <p className="text-gray-300 mb-4">{startup.description}</p>
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-white">Pitch</h3>
          <p className="text-gray-300">{startup.pitch}</p>
        </div>
        <div className="flex items-center justify-between mt-4 text-gray-300">
          <div className="flex items-center space-x-2">
            <img
              src={startup.postedBy.image || getInitials(startup.postedBy.name)}
              alt={startup.postedBy.name}
              className="w-8 h-8 rounded-full"
            />
            <span>{startup.postedBy.name}</span>
          </div>
          <div>
            <span>{startup.currentApplicants}/{startup.maxApplicants} applicants</span>
          </div>
        </div>
      </div>
    </Card>
  );
}