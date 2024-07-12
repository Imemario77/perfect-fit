import { db } from "@/firebase/admin/config";
import { FieldValue } from "@google-cloud/firestore";
import { embeddingFunction } from "../gemini";

const accessoryMatcher = async (
  userid,
  accessoryCategory,
  accessoryDescription
) => {
  return [
    {
      id: "accessory_7",
      description:
        "A classic silver watch with a leather strap, adding a touch of elegance.",
      imageUrl: "https://watch.com/time.png",
    },
    {
      id: "accessory_8",
      description: "A minimalist beaded bracelet, perfect for a casual touch.",
      imageUrl: "https://watch.com/best_time.png",
    },
    {
      id: "accessory_9",
      description:
        "A stylish pair of aviator sunglasses, protecting your eyes and completing the look.",
      imageUrl: "https://clasictimes.com/minimal.png",
    },
  ];
};

const footwearMatcher = (userid, footwearCategory, footwearDescription) => {
  return [
    {
      id: "footwear_5",
      description:
        "Brown leather Chelsea boots, a sophisticated choice for a date night.",
      imageUrl: "https://feetware.com/clasic/feet.png",
    },
    {
      id: "footwear_6",
      description:
        "Minimalist white sneakers, offering a comfortable and trendy option.",
      imageUrl: "https://feetware.com/feet.png",
    },
  ];
};

const topsMatcher = (userid, topCategory, topDescription) => {
  return [
    {
      id: "top_1",
      description: "A crisp white linen shirt, perfect for a summer date.",
      imageUrl: "https://top1.com/img.png",
    },
    {
      id: "top_2",
      description:
        "A light blue chambray button-down, offering a casual yet polished look.",
      imageUrl: "https://tinme-toping.com/image.png",
    },
  ];
};

const bottomsMatcher = (userid, bottomCategory, bottomDescription) => {
  return [
    {
      id: "bottom_3",
      description:
        "Dark wash straight-leg jeans, a timeless classic for dates.",
      imageUrl: "https://tights.com",
    },
    {
      id: "bottom_4",
      description: "Chinos in a neutral khaki shade, versatile and stylish.",
      imageUrl: "https://shorts.com/item.png",
    },
  ];
};

const dressesMatcher = async ({
  userId,
  dressesCategory,
  dressesDescription,
}) => {
  const embedding = await embeddingFunction(dressesDescription);
  const coll = db.collection("galleryEmbedding");
  const preFilteredVectorQuery = coll.findNearest(
    "embedding",
    FieldValue.vector(embedding.values),
    {
      limit: 5,
      distanceMeasure: "EUCLIDEAN",
    }
  );

  const vectorQuerySnapshot = await preFilteredVectorQuery.get();

  console.log(vectorQuerySnapshot);
  return [
    {
      id: "dress_1",
      description:
        "A flowing floral maxi dress, perfect for a summer garden party.",
      imageUrl: "https://dress1.com.maxi.png",
    },
    {
      id: "dress_2",
      description:
        "A sleek black cocktail dress, ideal for a formal evening event.",
      imageUrl: "https://dress2.com.cocktail.png",
    },
    {
      id: "dress_3",
      description:
        "A casual denim sundress, comfortable and stylish for everyday wear.",
      imageUrl: "https://dress3.com.denim.png",
    },
    {
      id: "dress_4",
      description:
        "A vibrant red wrap dress, flattering and versatile for various occasions.",
      imageUrl: "https://dress4.com.wrap.png",
    },
    {
      id: "dress_5",
      description:
        "A bohemian-style white lace dress, perfect for a beach wedding or romantic date.",
      imageUrl: "https://dress5.com.lace.png",
    },
  ];
};

const outerwearMatcher = (userid, outerwearCategory, outerwearDescription) => {
  return [
    {
      id: "outerwear_m1",
      description:
        "A classic black leather jacket, perfect for adding an edgy touch to any outfit.",
      imageUrl: "https://www.example.com/leather-jacket.jpg",
    },
    {
      id: "outerwear_m2",
      description:
        "A warm and stylish navy blue wool overcoat, ideal for colder months.",
      imageUrl: "https://www.example.com/wool-overcoat.jpg",
    },
    {
      id: "outerwear_m3",
      description:
        "A versatile olive green bomber jacket, suitable for casual outings.",
      imageUrl: "https://www.example.com/bomber-jacket.jpg",
    },
    {
      id: "outerwear_m4",
      description:
        "A lightweight khaki trench coat, perfect for transitional weather.",
      imageUrl: "https://www.example.com/trench-coat.jpg",
    },
    {
      id: "outerwear_m5",
      description:
        "A sporty black puffer jacket with a hood, great for outdoor activities.",
      imageUrl: "https://www.example.com/puffer-jacket.jpg",
    },
  ];
};

export const functions = {
  accessoryMatcher,
  footwearMatcher,
  topsMatcher,
  bottomsMatcher,
  dressesMatcher,
  outerwearMatcher,
};
