"use client";

// pages/profile.js
import { useState } from "react";
import Image from "next/image";

function Profile() {
  // let [user, loading, error] = useAuthState(auth);
  // const router = useRouter();

  // useEffect(() => {
  //   if (!loading && !user) {
  //     router.push("/login");
  //   }
  // }, [user, loading, router]);

  // In a real app, you'd fetch this data from your backend
  const [user, setUser] = useState({
    name: "Alex Johnson",
    email: "alex@example.com",
    profilePicture: "/images/profile-placeholder.jpg",
    stylePreferences: ["Casual", "Minimalist"],
    favoriteColors: ["Blue", "Black", "White"],
    wardrobeStats: {
      totalItems: 87,
      mostWornCategory: "Tops",
      leastWornCategory: "Formal Wear",
    },
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the updated user data to your backend
    console.log("Updated user data:", user);
    setIsEditing(false);
  };

  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">User Profile</h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="flex items-center mb-6">
          <Image
            src={user.profilePicture}
            alt={user.name}
            width={100}
            height={100}
            className="rounded-full mr-4"
          />
          <div>
            <h2 className="text-2xl font-semibold">{user.name}</h2>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="name"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={user.name}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={user.email}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Style Preferences
            </label>
            <p>{user.stylePreferences.join(", ")}</p>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Favorite Colors
            </label>
            <p>{user.favoriteColors.join(", ")}</p>
          </div>

          {isEditing ? (
            <button
              type="submit"
              className="bg-primary text-bg py-2 px-4 rounded hover:bg-sec-2 transition-colors"
            >
              Save Changes
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="bg-sec-1 text-text py-2 px-4 rounded hover:bg-sec-2 hover:text-bg transition-colors"
            >
              Edit Profile
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="hover:bg-white hover:text-sec-2 py-2 px-4 rounded ml-3 bg-sec-2 text-bg transition-colors"
          >
            Log out
          </button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Wardrobe Statistics</h2>
        <p>Total Items: {user.wardrobeStats.totalItems}</p>
        <p>Most Worn Category: {user.wardrobeStats.mostWornCategory}</p>
        <p>Least Worn Category: {user.wardrobeStats.leastWornCategory}</p>
      </div>
    </main>
  );
}

export default Profile;
