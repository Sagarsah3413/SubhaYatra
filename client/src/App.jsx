// import Header from "../components/header/Header";
import { Header } from "../components/header/Header";
import "./App.css";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
function App() {
  return (
    <>
      <div className=" h-screen bg-gray-100">
        <Header />
        <SignedOut>
          <SignInButton>
            <div className="flex items-center justify-center mt-8">
              <button className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold rounded-full shadow-lg hover:from-pink-600 hover:to-purple-600 transition duration-300 ease-in-out">
                Sign In 💓
              </button>
            </div>
          </SignInButton>
        </SignedOut>

        <SignedIn>
          <>
            {/* <Header /> */}
            <div
              className="max-w-sm mx-auto mt-10 p-6 bg-white rounded-lg shadow-md flex items-center
      flex-col"
            >
              <h2 className="text-2xl font-semibold text-gray-800 ">
                Welcome 💖
              </h2>
              <p className="text-gray-600 mt-2">Here you go cuties!</p>
            </div>
          </>
        </SignedIn>
      </div>
    </>
  );
}

export default App;
