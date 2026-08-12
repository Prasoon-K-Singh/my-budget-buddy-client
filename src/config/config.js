const backendDomain = "http://localhost:3000/api/";

const navItem = [
  {
    title: "Dashboard",
    link: "/dashboard",
  },
  {
    title: "Expenses",
    link: "/expenses",
  },
  {
    title: "Budget Builder",
    link: "/budgets",
  },
  {
    title: "Goal Tracker",
    link: "/goals",
  },
  {
    title: "Profile",
    link: "/profile",
  },
];

const apiUrl = {
  authUrl: `${backendDomain}auth`,
  userUrl: `${backendDomain}user`,
  accUrl: `${backendDomain}acc`,
  tranUrl: `${backendDomain}tran`,
};

export { navItem, apiUrl };
