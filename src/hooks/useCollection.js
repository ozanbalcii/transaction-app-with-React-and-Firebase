import { useEffect, useState, useRef } from "react";
import { projectFirestore } from "../firebase/config";

export const useCollection = (collection, _query, _orderBy) => {
  //* We also have some state for the error in case there is an error with the request.
  const [documents, setDocuments] = useState(null);
  const [error, setError] = useState(null);

//! query: (infinite loop)
//  whenever this home component gets reevaluated and that happens, whenever a state changes, for example, if the documents change after we fetch them,
// and when React compares the previous reference types to the new ones on the next evaluation, it sees them as different.
// what that means is it sees this query(in useEffect) right here as being changed and when that changes, it reruns.
// So that will rerun the hook again, refetch the documents again, up a new listener.
//! useRef -> when we wrap a reference type in use ref, it doesn't see it as different on every componentre evaluation. So doesn't infinite loop. _query is an array and is  different on every function call
  const query = useRef(_query).current 
  const orderBy = useRef(_orderBy).current
  useEffect(() => {
    let ref = projectFirestore.collection(collection) // realtime listening
    if(query){
      ref = ref.where(...query) //! query ->  ["uid", "==", user.uid]
    }
    if(orderBy){
      ref = ref.orderBy(...orderBy)
    }

    const unsubscribe = ref.onSnapshot((snapshot)=> { //!  This function is going to fire a function for us every time we get a snapshot back from the Firestore.
  
      //* if we add a new document or remove a document from it or update a document inside it, then it's going to send to us a new snapshot and fire this function again.
      //* And so therefore we can update our state right here every time we get a snapshot back.
      //* And because we'll be using this state inside our home page later, it's going to keep the data shown on the page in the browser up to date in sync with our collection.
  
      let results = [];
      snapshot.docs.forEach((doc)=> {
          results.push({...doc.data(), id: doc.id})
  
      })
      //update state
      setDocuments(results);
      setError(null);
  
    }, (error) => {
        //update state
        console.log(error)
        setError("could not fetch the data")
    })
    // unsubscribe on unmount
    return () => unsubscribe()
  }, [collection, query, orderBy]);

  return{documents, error}
 
};
