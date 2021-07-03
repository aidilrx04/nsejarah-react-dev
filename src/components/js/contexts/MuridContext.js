import { createContext, useEffect, useState } from "react";
import { API } from "../utils";

export const MuridContext = createContext( {} );

export function MuridContextProvider( { idMurid = null, ...rest } )
{
  let [murid, setMurid] = useState( {} );

  useEffect( () =>
  {
    if ( idMurid !== null )
    {
      API.getMurid( idMurid ).then( data =>
      {
        if ( data.success )
        {
          setMurid( data.data );
        }
      } );
    }

    return () =>
    {
      setMurid( {} );
    };
  }, [idMurid] );


  return (
    <MuridContext.Provider value={{ murid, setMurid }} {...rest}></MuridContext.Provider>
  );
}