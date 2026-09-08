const backendDomain = "http://localhost:3000/api/";

const NAV_ITEM = [
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

const API_URL = {
  authUrl: `${backendDomain}auth`,
  userUrl: `${backendDomain}user`,
  accUrl: `${backendDomain}acc`,
  tranUrl: `${backendDomain}tran`,
  catUrl: `${backendDomain}cat`,
};

const TRANS_TYPE = {
  debit: "Pay-out",
  credit: "Credit-in",
};

const STATUS = {
  active: "Active",
  inactive: "Inactive",
};

const YES_NO_SELECT = {
  yes: "Yes",
  no: "No",
};

const PAY_METHOD = {
  upi: "UPI",
  cash: "Cash",
  card: "Card",
  "net-bank": "Net Banking",
};

const LIST_LIMIT = 10;

export {
  NAV_ITEM,
  API_URL,
  TRANS_TYPE,
  STATUS,
  YES_NO_SELECT,
  PAY_METHOD,
  LIST_LIMIT,
};
