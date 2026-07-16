const DefaultButtonConfig = {
  whileHover: {
    scale: 1.02,
    y: -1,
  },

  whileTap: {
    scale: 0.98,
  },

  transition: {
    duration: 0.15,
    ease: "easeOut",
  },
};

const DropdownButtonConfig = {
  whileHover: {},

  whileTap: {},

  transition: {},
};

export const buttonConfigs = {
  default: DefaultButtonConfig,
  dropdown: DropdownButtonConfig,
};
