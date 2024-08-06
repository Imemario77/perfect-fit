// "use client";

// import { useState, useEffect } from "react";
// import Image from "next/image";
// import { auth, db } from "@/firebase/config";
// import { useRouter } from "next/navigation";
// import { useAuthState } from "react-firebase-hooks/auth";
// import {
//   collection,
//   deleteDoc,
//   doc,
//   getDoc,
//   getDocs,
//   query,
//   where,
// } from "firebase/firestore";
// import { FaTrash } from "react-icons/fa";
// import { deleteObject, getStorage, ref } from "firebase/storage";
// import { toast, ToastContainer } from "react-toastify";

// function Wardrobe() {
//   const [clothes, setClothes] = useState([]);
//   const [filter, setFilter] = useState("all");

//   const categories = [
//     "all",
//     "tops",
//     "bottoms",
//     "dresses",
//     "outerwear",
//     "footwear",
//     "accessories",
//   ];

//   const filteredClothes = clothes.filter(
//     (item) => filter === "all" || item.category === filter
//   );

//   let [user, loading, error] = useAuthState(auth);
//   const router = useRouter();

//   useEffect(() => {
//     if (!loading && !user) {
//       router.push("/login");
//     } else if (user) {
//       async function hasOnboarded() {
//         try {
//           const userDoc = await getDoc(doc(db, "userProfile", user.uid));
//           if (!userDoc.exists() || !userDoc.data().onboardingCompleted) {
//             router.push("/onboarding");
//           } else {
//             const galleryQuery = query(
//               collection(db, "gallery"),
//               where("userRef", "==", user.uid)
//             );
//             const gallerySnapshot = await getDocs(galleryQuery);

//             const galleryDocs = gallerySnapshot.docs.map((doc) => ({
//               id: doc.id,
//               ...doc.data(),
//             }));

//             console.log(galleryDocs);
//             setClothes(galleryDocs);
//           }
//         } catch (error) {
//           console.error("Error fetching data:", error);
//         }
//       }
//       hasOnboarded();
//     }
//   }, [user, loading, router]);

//   const handleDelete = async (id) => {
//     try {
//       await deleteDoc(doc(db, "gallery", id));

//       // Get the file path from the document
//       const filePath = clothes.find((item) => item.id === id).imageUrl;

//       // Delete the file from Firebase Storage
//       const storage = getStorage();
//       const desertRef = ref(storage, filePath);
//       await deleteObject(desertRef);

//       // Update the clothes state
//       setClothes(clothes.filter((item) => item.id !== id));

//       toast.success("Item has been removed", {
//         position: "top-right",
//         autoClose: 3000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         progress: undefined,
//         style: {
//           fontSize: "14px",
//         },
//       });
//       toast;
//     } catch (error) {
//       console.error("Error deleting document:", error);
//       toast.error("Error removing item", {
//         position: "top-right",
//         autoClose: 3000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         progress: undefined,
//         style: {
//           fontSize: "14px",
//         },
//       });
//     }
//   };

//   const confirmDelete = (id) => {
//     if (window.confirm("Are you sure you want to delete this item?")) {
//       handleDelete(id);
//     }
//   };
//   return (
//     <main className="flex-grow container mx-auto px-4 py-8">
//       <h1 className="text-3xl font-bold mb-8">My Wardrobe</h1>

//       <div className="mb-8 flex justify-between items-center">
//         <div>
//           <select
//             value={filter}
//             onChange={(e) => setFilter(e.target.value)}
//             className="p-2 border rounded"
//           >
//             {categories.map((category) => (
//               <option key={category} value={category}>
//                 {category.charAt(0).toUpperCase() + category.slice(1)}
//               </option>
//             ))}
//           </select>
//         </div>
//         <button
//           onClick={() => router.push("/addItem")}
//           className="bg-primary text-bg py-2 px-4 rounded hover:bg-sec-2 transition-colors"
//         >
//           Add New Item
//         </button>
//       </div>

//       <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//         {filteredClothes.length === 0 && <span>No item in this section</span>}
//         {filteredClothes.map((item) => (
//           <div
//             key={item.id}
//             className="bg-white p-4 rounded-lg shadow-md relative"
//           >
//             <Image
//               src={item.imageUrl}
//               alt={item.description}
//               width={200}
//               height={200}
//               className="w-full h-48 object-cover mb-4 rounded"
//             />
//             <FaTrash
//               className="absolute top-2 right-2 text-red-600 cursor-pointer w-fit h-fit hover:animate-bounce bg-primary p-3 rounded-[50%]"
//               onClick={() => confirmDelete(item.id)}
//             />
//             <h3 className="text-lg font-semibold mb-2">{item.type}</h3>
//             <p className="text-gray-600 mb-2">Category: {item.category}</p>
//             <p className="text-gray-600">Color: {item.color}</p>
//           </div>
//         ))}
//       </div>
//     </main>
//   );
// }

// export default Wardrobe;

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { auth, db } from "@/firebase/config";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { FaTrash, FaTimes } from "react-icons/fa";
import { deleteObject, getStorage, ref } from "firebase/storage";
import { toast, ToastContainer } from "react-toastify";
import { format } from "date-fns";

function Wardrobe() {
  const [clothes, setClothes] = useState([]);
  const [filter, setFilter] = useState("all");
  const [selectedItem, setSelectedItem] = useState(null);

  const categories = [
    "all",
    "tops",
    "bottoms",
    "dresses",
    "outerwear",
    "footwear",
    "accessories",
  ];

  const filteredClothes = clothes.filter(
    (item) => filter === "all" || item.category === filter
  );

  let [user, loading, error] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      async function hasOnboarded() {
        try {
          const userDoc = await getDoc(doc(db, "userProfile", user.uid));
          const galleryQuery = query(
            collection(db, "gallery"),
            where("userRef", "==", user.uid)
          );
          const gallerySnapshot = await getDocs(galleryQuery);

          const galleryDocs = gallerySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          console.log(galleryDocs);
          setClothes(galleryDocs);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
      hasOnboarded();
    }
  }, [user, loading, router]);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "gallery", id));
      // Get the file path from the document
      const filePath = clothes.find((item) => item.id === id).imageUrl;
      // Delete the file from Firebase Storage
      const storage = getStorage();
      const desertRef = ref(storage, filePath);
      await deleteObject(desertRef);
      // Update the clothes state
      setClothes(clothes.filter((item) => item.id !== id));
      toast.success("Item has been removed", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: {
          fontSize: "14px",
        },
      });

      setSelectedItem(null);
    } catch (error) {
      console.error("Error deleting document:", error);
      toast.error("Error removing item", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: {
          fontSize: "14px",
        },
      });
    }
  };

  const confirmDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      handleDelete(id);
    }
  };

  const openModal = (item) => {
    console.log(item);
    setSelectedItem(item);
  };

  const closeModal = () => {
    setSelectedItem(null);
  };

  return (
    <main className="flex-grow container mx-auto px-4 py-8 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-center text-primary">
        My Wardrobe
      </h1>

      <div className="mb-8 flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="p-2 border rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-primary"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={() => router.push("/addItem")}
          className="bg-primary text-bg py-2 px-6 rounded-full hover:bg-sec-2 transition-colors duration-300 shadow-md hover:shadow-lg"
        >
          Add New Item
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {filteredClothes.length === 0 && (
          <span className="col-span-full text-center text-gray-500 text-lg">
            No items in this section
          </span>
        )}
        {filteredClothes.map((item) => (
          <div
            key={item.id}
            className="bg-white p-4 rounded-lg shadow-lg relative transform hover:scale-105 transition-transform duration-300 cursor-pointer"
            onClick={() => openModal(item)}
          >
            <div className="relative aspect-square mb-4">
              <Image
                src={item.imageUrl}
                alt={item.description}
                layout="fill"
                objectFit="cover"
                className="rounded-md"
              />
            </div>

            <h3 className="text-lg font-semibold mb-2 truncate">{item.type}</h3>
            <p className="text-gray-600 mb-1 text-sm">
              Category: {item.category}
            </p>
            <p className="text-gray-600 text-sm">Color: {item.color}</p>
          </div>
        ))}
      </div>

      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center overflow-y-scroll z-50">
          <div className="bg-white p-8 rounded-lg max-w-3xl w-full mx-4 relative ">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <FaTimes size={24} />
            </button>
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2 mb-4 md:mb-0 md:mr-8">
                <Image
                  src={selectedItem.imageUrl}
                  alt={selectedItem.description}
                  width={100}
                  height={100}
                  objectFit="cover"
                  className="rounded-lg md:w-[400px] md:h-[400px] shadow-md"
                />
              </div>
              <div className="md:w-1/2">
                <h2 className="text-2xl font-bold mb-4">{selectedItem.type}</h2>
                <p className="text-gray-700 mb-2">
                  <span className="font-semibold">Category:</span>{" "}
                  {selectedItem.category}
                </p>
                <p className="text-gray-700 mb-2">
                  <span className="font-semibold">Color:</span>{" "}
                  {selectedItem.color}
                </p>
                <p className="text-gray-700 mb-4">
                  <span className="font-semibold">Description:</span>{" "}
                  {selectedItem.description}
                </p>
                <p className="text-gray-700 mb-4">
                  <span className="font-semibold">Last worn:</span>
                  {selectedItem.lastWornDate &&
                  selectedItem.lastWornDate.seconds
                    ? format(
                        new Date(selectedItem.lastWornDate.seconds * 1000),
                        "PPP"
                      )
                    : "Not yet worn"}
                </p>
                <button
                  onClick={() => confirmDelete(selectedItem.id)}
                  className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors duration-300"
                >
                  Delete Item
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </main>
  );
}

export default Wardrobe;
