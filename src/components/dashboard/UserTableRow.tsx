
import { User } from "lucide-react";
import { TableCell, TableRow } from "../ui/table";
import { UserStatus } from "./UserStatus";
import { UserActions } from "./UserActions";

interface UserTableRowProps {
  user: {
    id: string;
    email: string;
    created_at: string;
    last_sign_in_at: string | null;
    banned: boolean;
    approved: boolean;
  };
  formatDate: (dateString: string | null) => string;
  onStatusChange: (userId: string, field: 'banned' | 'approved', value: boolean) => void;
}

export function UserTableRow({ user, formatDate, onStatusChange }: UserTableRowProps) {
  return (
    <TableRow className="border-gray-800 hover:bg-[#1e1c2e]/30">
      <TableCell className="font-medium text-white">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-gray-400" />
          {user.email}
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
