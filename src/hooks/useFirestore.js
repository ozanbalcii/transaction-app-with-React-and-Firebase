import { useReducer, useEffect, useState } from "react";
import { projectFirestore, timestamp } from "../firebase/config";

let initailState = {
    document: null,
    isPending:false,
    error:null,
    success:null
}

const firestoreReducer = (state, action) => { 
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
    const [response, dispatch] = useReducer(firestoreReducer, initailState) 
    const [isCancelled, setIsCancelled] = useState(false) 

    const ref = projectFirestore.collection(collection); 

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
            dispatchIfNotCancelled({ type: 'ADDED_DOCUMENT', payload: addedDocument }) 
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
