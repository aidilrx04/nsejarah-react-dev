import { createContext, useEffect, useState } from "react";
import { API } from "../utils";

export const KuizContext = createContext( {} );

export function KuizContextProvider( { idKuiz = null, ...rest } )
{
  let [kuiz, setKuiz] = useState( {} );

  useEffect( () =>
  {

    if ( idKuiz !== null )
    {
      API.getKuiz( idKuiz ).then( data =>
      {
        if ( data.success )
        {
          setKuiz( data.data );
        }
      } );
    }

    return () =>
    {
      setKuiz( {} );
    };
  }, [idKuiz] );

  return (
    <KuizContext.Provider value={{ kuiz, setKuiz }} {...rest}>

    </KuizContext.Provider>
  );
}