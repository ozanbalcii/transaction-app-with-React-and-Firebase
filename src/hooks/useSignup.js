import { useEffect, useState } from "react";
import { projectAuth } from "../firebase/config";
import { useAuthContext } from "./useAuthContext";

export const useSignup = () => {
  const [isCancelled, setIsCancelled] = useState(false); 
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const { dispatch } = useAuthContext();  

  const signup = async (email, password, displayName) => {
    setError(null);
    setIsPending(true);

    try {
      // signup the user and add to firestore collection(register process)
      const res = await projectAuth.createUserWithEmailAndPassword(
        email,
        password
      );
      // console.log(res.user);

      if (!res) {
        throw new Error("Could not complete the signup");
      }
      // add display name to the user
      await res.user.updateProfile({ displayName });

      // dispatch login action
      //? So now we're dispatching this action and when we dispatch it, it fires this auth reducer.
      dispatch({ type: "LOGIN", payload: res.user }) //! { type: "LOGIN", payload: res.user } -> this object pass  with "dispatch" to the action in Authcontext.js

      // update state
      if(!isCancelled){
        setIsPending(false);
        setError(null);
      }
      
    } catch (err) {
      if(!isCancelled){
        console.log(err);
        setError(err.message);
        setIsPending(false);
      }
    }
  }
  useEffect(() => { 
    return () => {
      setIsCancelled(true);
    }
  }, [])

  return { error, isPending, signup };
};
