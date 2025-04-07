
import { UsersTable } from "@/components/dashboard/UsersTable";
import { TabsContent } from "@/components/ui/tabs";

export function UsersTabContent() {
  return (
    <TabsContent value="users" className="space-y-4">
      <div className="flex justify-between items-center pb-4">
        <h2 className="text-xl font-semibold">Manage Users</h2>
      </div>
      <UsersTable />
    </TabsContent>
  );
}
