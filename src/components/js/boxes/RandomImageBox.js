import { useEffect, useState } from "react";
import { rand } from "../utils";
import { Box, BoxBody, BoxHeader } from "./Box";

export function RandomImageBox()
{
    let [random, setRandom] = useState( 0 );
    let [imgs, setImgs] = useState( [] );

    useEffect( () => {
        setImgs( [1] );

        return () => {
            setImgs( [] );
        }
    }, []);

    useEffect( () => {
        setTimeout( () => {
            setRandom( random => random + 1);

        }, 10000)
    }, [random]);
    return (
        <Box>
            <BoxHeader
                right={
                     <i className="fas fa-redo" onClick={() => setRandom( random => random + 1)}/>
                }
            >
                <i className="far fa-image"/> Random Image 😑
            </BoxHeader>
            <BoxBody>
                {
                    imgs.map( img => {
                        return (
                            <img key={imgs.indexOf( img )} style={{maxWidth: '100%'}} src={`https://picsum.photos/500/400?random=${random + rand()}`} alt=""/>
                        )
                    })
                }
            </BoxBody>
        </Box>
    )
}

export default RandomImageBox;