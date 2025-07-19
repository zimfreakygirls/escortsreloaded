
import { User } from "lucide-react";
import { TableCell, TableRow } from "../ui/table";
import { UserStatus } from "./UserStatus";
import { UserActions } from "./UserActions";

interface UserTableRowProps {
  user: {
    id: string;
    email: string;
    username?: string;
    created_at: string;
    last_sign_in_at: string | null;
    banned: boolean;
    approved: boolean;
  };
  formatDate: (dateString: string | null) => string;
  onStatusChange: (userId: string, field: 'banned' | 'approved', value: boolean) => void;
  isMobile?: boolean;
}

export function UserTableRow({ user, formatDate, onStatusChange, isMobile = false }: UserTableRowProps) {
  if (isMobile) {
    return (
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-gray-700">
        <div className="flex items-center gap-2">
          <UserStatus banned={user.banned} approved={user.approved} />
        </div>
        <UserActions 
          userId={user.id} 
          banned={user.banned} 
          approved={user.approved} 
          onStatusChange={onStatusChange}
        />
      </div>
    );
  }

  return (
    <TableRow className="border-gray-800 hover:bg-[#1e1c2e]/30">
      <TableCell className="font-medium text-white">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-gray-400" />
          <div className="flex flex-col">
            {user.username && (
              <span className="font-semibold">{user.username}</span>
            )}
            <span className={user.username ? "text-sm text-gray-400" : ""}>{user.email}</span>
          </div>
        </div>
      </TableCell>
      <TableCell className="text-gray-300">{formatDate(user.created_at)}</TableCell>
      <TableCell className="text-gray-300">{formatDate(user.last_sign_in_at)}</TableCell>
      <TableCell>
        <UserStatus banned={user.banned} approved={user.approved} />
      </TableCell>
      <TableCell>
        <UserActions 
          userId={user.id} 
          banned={user.banned} 
          approved={user.approved} 
          onStatusChange={onStatusChange}
        />
      </TableCell>
    </TableRow>
  );
}
