import { useEffect, useState } from "react";
import { projectAuth } from "../firebase/config";
import { useAuthContext } from "./useAuthContext";

export const useLogin = () => {
  const [isCancelled, setIsCancelled] = useState(false);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const { dispatch } = useAuthContext();

  const login = async (email, password) => {
    setError(null);
    setIsPending(true);

    // login the user
    try {
     const res =  await projectAuth.signInWithEmailAndPassword(email, password); // register to firebase
      dispatch({ type: "LOGIN", payload: res.user });  //! (payload is the response user) //{ type: "LOGIN", payload: res.user } -> this object pass  with "dispatch" to the action in Authcontext.js(projectAuth)

      // update state
      if (!isCancelled) { //! We want to make sure that is canceled is false before we try to update anything.
        setIsPending(false);
        setError(null);
      }
    } catch (err) {
      if (!isCancelled) {
        setError(err.message);
        setIsPending(false);
      }
    }
  }
  useEffect(() => {
    return () => setIsCancelled(true)
  }, [])

  return { error, isPending, login };
};
