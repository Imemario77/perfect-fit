export const accessoryMatcherFunctionDeclaration = {
  name: "accessoryMatcher",
  parameters: {
    type: "OBJECT",
    description:
      "Retrieves suitable accessories from a user's wardrobe based on the specified category, user ID, and optionally, a description for further filtering.",
    properties: {
      accessoryCategory: {
        type: "STRING",
        description: "The type of accessory to look for.",
      },
      userId: {
        type: "STRING",
        description: "The Id of user to look for.",
      },
      accessoryDescription: {
        type: "STRING",
        description: "Infomation of the accessory to look for.",
      },
    },
    required: ["accessoryCategory", "userId", "accessoryDescription"],
  },
};

export const footwearMatcherFunctionDeclaration = {
  name: "footwearMatcher",
  parameters: {
    type: "OBJECT",
    description:
      "Retrieves suitable footwear from a user's wardrobe based on the specified category, user ID, and optionally, a description for further filtering.",
    properties: {
      footWearCategory: {
        type: "STRING",
        description: "The type of footWear to look for.",
      },
      userId: {
        type: "STRING",
        description: "The Id of user to look for.",
      },
      footWearDescription: {
        type: "STRING",
        description: "Infomation of the footWear to look for.",
      },
    },
    required: ["footWearCategory", "userId", "footWearDescription"],
  },
};

export const topsMatcherFunctionDeclaration = {
  name: "topsMatcher",
  parameters: {
    type: "OBJECT",
    description:
      "Retrieves suitable tops (shirts, blouses, etc.) from a user's wardrobe based on the specified category, user ID, and optionally, a description for further filtering.",
    properties: {
      topCategory: {
        type: "STRING",
        description: "The type of top to look for.",
      },
      userId: {
        type: "STRING",
        description: "The Id of user to look for.",
      },
      topDescription: {
        type: "STRING",
        description: "Infomation of the top to look for.",
      },
    },
    required: ["topCategory", "userId", "topDescription"],
  },
};

export const bottomsMatcherFunctionDeclaration = {
  name: "bottomsMatcher",
  parameters: {
    type: "OBJECT",
    description:
      "Retrieves suitable bottoms (pants, skirts, etc.) from a user's wardrobe based on the specified category, user ID, and optionally, a description for further filtering.",
    properties: {
      bottomCategory: {
        type: "STRING",
        description: "The type of bottom to look for.",
      },
      userId: {
        type: "STRING",
        description: "The Id of user to look for.",
      },
      bottomDescription: {
        type: "STRING",
        description: "Infomation of the bottom to look for.",
      },
    },
    required: ["bottomCategory", "userId", "bottomDescription"],
  },
};

export const dressesMatcherFunctionDeclaration = {
  name: "dressesMatcher",
  parameters: {
    type: "OBJECT",
    description:
      "Retrieves suitable dresses from a user's wardrobe based on the specified category, user ID, and optionally, a description for further filtering.",
    properties: {
      dressesCategory: {
        type: "STRING",
        description: "The type of dresses to look for.",
      },
      userId: {
        type: "STRING",
        description: "The Id of user to look for.",
      },
      dressesDescription: {
        type: "STRING",
        description: "Infomation of the dresses to look for.",
      },
    },
    required: ["dressesCategory", "userId", "dressesDescription"],
  },
};

export const outerwearMatcherFunctionDeclaration = {
  name: "outerwearMatcher",
  parameters: {
    type: "OBJECT",
    description:
      "Retrieves suitable outerwear (jackets, coats, etc.) from a user's wardrobe based on the specified category, user ID, and optionally, a description for further filtering.",
    properties: {
      outerWearCategory: {
        type: "STRING",
        description: "The type of outerWear to look for.",
      },
      userId: {
        type: "STRING",
        description: "The Id of user to look for.",
      },
      outerWearDescription: {
        type: "STRING",
        description: "Infomation of the outerWear to look for.",
      },
    },
    required: ["outerWearCategory", "userId", "outerWearDescription"],
  },
};
