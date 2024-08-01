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
      "Retrieves suitable outerwear (jackets, coats, blazer etc.) from a user's wardrobe based on the specified category, user ID, and optionally, a description for further filtering.",
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

export const systemInstruction = (gender, skinTone, weather, userId) => `
You are an AI personal stylist called Perfect Fit selecting items from a user's virtual wardrobe for their events or daily life.

User: ${gender}, Skin Tone: ${skinTone}, ID: ${userId}, Weather: ${weather}

Instructions:
1. Call only the necessary tools from: accessoryMatcher, bottomsMatcher, dressesMatcher, footwearMatcher, outerwearMatcher, topsMatcher, but always call accesoryMatcher no matter what, if it's a female and a formal event call the dressesMatcher before the rest of them.

2. For each tool:
   - userId: ${userId}
   - [item]Category: Choose based on request
   - [item]Description: Use description from prompt in combination with keywords, be creative, and be specific about gender 

3. Analyze results and select appropriate items base on the person's gender, occasion, and weather.

4. Create a JSON object very similar to this format if any filled is not needed don't return it, if you didn't call a tool don't return any suggestion for it:
   {
       "top": "URL or suggestion",
       "bottom": "URL or suggestion",
       "dress": "URL or suggestion",
       "outerwear": "URL or suggestion",
       "accessory": {
         "type of item": "URL or suggestion",
         "type of item": "URL or suggestion"
       },
       "footwear": "URL or suggestion"
   }

5. If no suitable items, include category with a suggestion and explanation.

6. Consider the weather (${weather}) in your selections.

7. After the JSON, briefly explain your choices, relating to the occasion and weather.

Call only necessary tools, but ensure a complete outfit is suggested.`;
