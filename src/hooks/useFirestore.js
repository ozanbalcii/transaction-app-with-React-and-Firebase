import { useReducer, useEffect, useState } from "react";
import { projectFirestore, timestamp } from "../firebase/config";

let initailState = {
    document: null,
    isPending:false,
    error:null,
    success:null
}

const firestoreReducer = (state, action) => {  // 2- Firestore reducer is going to look at the type of dispatch that we do.
    switch (action.type) {
        case 'IS_PENDING':
            return { isPending:true, document:null, success:false, error:null}
        case 'ADDED_DOCUMENT':
            return { isPending:false, document:action.payload, success:true, error:null}
        case 'ERROR':
            return { isPending:false, document:null, success:false, error:action.payload}
        case 'DELETED_DOCUMENT':
            return { isPending:false, document:action.payload, success:true, error:null}
        default:
            return state;
    }
}

export const useFirestore = (collection) => {
    const [response, dispatch] = useReducer(firestoreReducer, initailState) // 1- (2. Article above) dispatch : we're going to be using this dispatch function right here to dispatch different actions to our Firestore reducer.
    const [isCancelled, setIsCancelled] = useState(false) //! (diğerlerinde de yapmıştık bu amaçla) I need to use the isCancelled because other components will be true every time, therefore, the state not will update every time.

    const ref = projectFirestore.collection(collection); //? we would get a reference to the transactions collection.

    // only dispatch is not cancelled
    const dispatchIfNotCancelled = (action) => {
        if (!isCancelled) {
            dispatch(action)
        }
    }

    // add a document
    const addDocument = async(doc) => {
        dispatch({ type: 'IS_PENDING'})

        try {
            const createdAt = timestamp.fromDate(new Date())
            const addedDocument = await ref.add({...doc, createdAt})
            dispatchIfNotCancelled({ type: 'ADDED_DOCUMENT', payload: addedDocument }) //! dispatchIfNotCancelled has an Action in it.  A Type and a Payload pass to Action here. (Action is in the function above.)
        }
        catch (err) {
            dispatchIfNotCancelled({ type: 'ERROR', payload: err.message })
        }
    }

   

    // delete a document
    const deleteDocument = async (id) => {
        dispatch({ type: 'IS_PENDING' })

        try{
            const deleteDocument = await ref.doc(id).delete()
            dispatchIfNotCancelled({ type: 'DELETED_DOCUMENT', payload: deleteDocument })
        }catch(err){
            dispatchIfNotCancelled({ type: 'ERROR', payload: 'could not delete the document'})
        }
    }

    useEffect(() => {
        return () => setIsCancelled(true) // I need to use the isCancelled because other components will be true every time, therefore, the state not will update.

    }, [])

    return { response, addDocument, deleteDocument }

}   
