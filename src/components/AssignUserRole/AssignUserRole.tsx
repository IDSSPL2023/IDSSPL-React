import { useState } from "react";
import NavbarAUR from "./NavbarAUR";
import UserTable, { type UserRow } from "./UserTable";
import RoleAssignmentForm, { type SelectedUser } from "./RoleAssignmentForm";

const newUsers: UserRow[] = Array.from({ length: 5 }, (_, i) => ({
  srNo: i + 1,
  shortName: "AMT",
  phone: "9876543210",
  email: "amt@example.com",
  userName: "Appana M Telgi",
  userId: `00${i + 1}`,
  assigned: false,
}));

const modifiedUsers: UserRow[] = Array.from({ length: 10 }, (_, i) => ({
  srNo: i + 1,
  shortName: "AMT",
  phone: "9876543210",
  email: "amt@example.com",
  userName: "Appana M Telgi",
  userId: `00${i + 1}`,
  assigned: true,
  role: "Officer",
}));

export default function AssignUserRole() {
  const [selectedUser, setSelectedUser] = useState<SelectedUser | null>({
    userId: "001",
    userName: "Appana M Telgi",
    userRole: "Officer",
  });
  const [currentNewUsers, setCurrentNewUsers] = useState<UserRow[]>(newUsers);
  const [currentModifiedUsers, setCurrentModifiedUsers] = useState<UserRow[]>(modifiedUsers);

  const handleRoleAssigned = (userId: string, role: string) => {
    const userIndex = currentNewUsers.findIndex((u) => u.userId === userId);
    if (userIndex !== -1) {
      const user = currentNewUsers[userIndex];
      const updatedUser = { ...user, assigned: true, role };
      setCurrentNewUsers((prev) => prev.filter((u) => u.userId !== userId));
      setCurrentModifiedUsers((prev) => [...prev, updatedUser]);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6FC] dark:bg-slate-950">
      <NavbarAUR
        titleEn="Assign User Role"
        titleHi="कस्टमर मास्टर"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "MIS Activity", href: "/" },
          { label: "Assign User Role", href: "/assignuserrole" },
        ]}
        onBack={() => window.history.back()}
      />

      <div className="grid grid-cols-1 gap-4 p-4 xl:grid-cols-2">
        <UserTable 
          onUserSelect={setSelectedUser} 
          currentNewUsers={currentNewUsers}
          currentModifiedUsers={currentModifiedUsers}
          setCurrentNewUsers={setCurrentNewUsers}
          setCurrentModifiedUsers={setCurrentModifiedUsers}
        />
        <RoleAssignmentForm 
          selectedUser={selectedUser} 
          onRoleAssigned={handleRoleAssigned}
        />
      </div>
    </div>
  );
}
