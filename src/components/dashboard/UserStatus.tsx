
import { Badge } from "../ui/badge";

interface UserStatusProps {
  banned: boolean;
  approved: boolean;
}

export function UserStatus({ banned, approved }: UserStatusProps) {
  return (
    <div className="flex gap-2">
      {banned && (
        <Badge variant="destructive" className="bg-red-500/20 text-red-400 hover:bg-red-500/30 hover:text-red-300">
          Banned
        </Badge>
      )}
      {approved && (
        <Badge variant="outline" className="bg-green-500/20 text-green-400 hover:bg-green-500/30 hover:text-green-300 border-green-700">
          Approved
        </Badge>
      )}
      {!banned && !approved && (
        <Badge variant="outline" className="bg-gray-500/20 text-gray-400 hover:bg-gray-500/30 hover:text-gray-300 border-gray-700">
          Pending
        </Badge>
      )}
    </div>
  );
}
