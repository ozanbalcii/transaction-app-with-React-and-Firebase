import { useEffect, useState, useRef } from "react";
import { projectFirestore } from "../firebase/config";

export const useCollection = (collection, _query, _orderBy) => {
  const [documents, setDocuments] = useState(null);
  const [error, setError] = useState(null);
  
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
