// Export all images
import branchMaster from "./branch-master.png";
import staff from "./staff.png";
import account from "./account.png";
import deposites from "./deposites.png";
import loans from "./loans.png";
import branchInfo from "./branch-info.png";
import branchManagerUser from "./rajesh-kumar.jpg";
import address from "./Address.png";
import user from "./User.png";

// Export as ICON object with properties
export const IMAGES = {
  BRANCH_MASTER: branchMaster,
  STAFF: staff,
  ACCOUNT: account,
  DEPOSITES: deposites,
  LOANS: loans,
  BRANCH_INFO: branchInfo,
  Branch_MANAGER: branchManagerUser,
  ADDRESS: address,
  USER: user,
} as const;

// Default export for convenience
export default IMAGES;
