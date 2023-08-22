"use client";
import { ChangeEvent, FC, FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { SiFacebook } from "react-icons/si";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { doc, setDoc } from "firebase/firestore";
import { toast } from "react-hot-toast";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import ClientOnly from "@/components/ClientOnly";
import { auth, db, googleAuthProvider } from "@/libs/firebase";

type UserProps = {
  uid: string;
  email: string;
  displayName: string;
};

const Register: FC = () => {
  const router = useRouter();

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [currentPath, setCurrentPath] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const res = await createUserWithEmailAndPassword(
        auth,
        user.email,
        user.password
      );

      await updateProfile(res.user, {
        displayName: user.name,
      });

      const userRef = doc(db, "users", res.user.uid);

      const userDetails: UserProps = {
        uid: res.user.uid,
        email: user.email,
        displayName: user.name,
      };
      await setDoc(userRef, userDetails);
      router.push(currentPath);
      toast.success("Success");
      setUser({
        email: "",
        name: "",
        password: "",
      });
    } catch (error: any) {
      console.log("Error creating an account", error);
    }
  };

  const googleSignIn = async () => {
    try {
      const res = await signInWithPopup(auth, googleAuthProvider);

      const userRef = doc(db, "users", res.user.uid);

      const userDetails: UserProps = {
        uid: res.user.uid,
        email: res.user.email as string,
        displayName: res.user.displayName as string,
      };
      await setDoc(userRef, userDetails);
      router.push(currentPath);
      toast.success("Signed In With Google");
    } catch (error: any) {
      console.log("Error creating an account", error);
    }
  };
  useEffect(() => {
    const currentPathname = localStorage?.getItem("currentPathname");
    const parsedPathname = currentPathname ? JSON.parse(currentPathname) : null;
    setCurrentPath(parsedPathname);
  }, []);

  return (
    <ClientOnly>
      <section className="flex flex-col items-center justify-center h-full w-full gap-[30px]">
        <h1 className="text-5xl">Create your account</h1>
        <input
          type="text"
          className="w-[410px] h-[48px] rounded-3xl border-2 border-gray-500 px-10"
          placeholder="Name"
          value={user.name}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setUser({ ...user, name: e.target.value })
          }
        />
        <input
          type="text"
          className="w-[410px] h-[48px] rounded-3xl border-2 border-gray-500 px-10"
          placeholder="Email"
          value={user.email}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setUser({ ...user, email: e.target.value })
          }
        />
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            className="w-[410px] h-[48px] rounded-3xl border-2 border-gray-500 pl-10 pr-16"
            placeholder="Password"
            value={user.password}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setUser({ ...user, password: e.target.value })
            }
          />
          {user.password.length !== 0 && (
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-5 top-[9px] cursor-pointer"
            >
              {!showPassword ? (
                <AiFillEyeInvisible size={25} />
              ) : (
                <AiFillEye size={25} />
              )}
            </span>
          )}
        </div>

        <button
          className="w-[410px] h-[38px] rounded-3xl bg-[#FFC857] font-bold"
          onClick={handleSubmit}
        >
          SIGN UP
        </button>

        <div className="flex gap-5 items-center">
          <div
            className=" w-[147px] h-0"
            style={{
              border: "1px solid rgba(0, 0, 0, 0.6)",
            }}
          />
          <h4>OR</h4>
          <div
            className="w-[147px] h-0"
            style={{
              border: "1px solid rgba(0, 0, 0, 0.6)",
            }}
          />
        </div>

        <div
          className="w-[410px] h-[48px] rounded-3xl shadow-lg border-1 flex items-center justify-center gap-4 cursor-pointer"
          onClick={googleSignIn}
        >
          <FcGoogle size={25} />
          <h1 className="text-xl">Continue with Google</h1>
        </div>

        {/* <div className="w-[410px] h-[48px] rounded-3xl flex items-center justify-center gap-4 bg-[#1877F2] cursor-pointer">
          <SiFacebook size={25} color="white" />
          <h1 className="text-xl text-white">Continue with Facebook</h1>
        </div> */}
        <div>
          Already have an account?
          <span
            className="underline font-bold cursor-pointer"
            onClick={() => router.push("login")}
          >
            Log in
          </span>
        </div>
      </section>
    </ClientOnly>
  );
};

export default Register;
