import { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import { Url } from "../utils";
import { Box, BoxBody, BoxHeader } from "./Box";

export function NavigasiBox()
{
    const user = useContext( UserContext );

    function handleLogout( e )
    {
        e.preventDefault();
        user.logout();
        return false;
    }
    return (
        <Box id="navigasi-box">
            <BoxHeader>
                <i className="fas fa-bars" /> Navigasi
            </BoxHeader>
            <BoxBody>
                <table className="table navigasi">
                    <tbody>
                        <tr>
                            <td>
                                <Link to={ Url( '/' ) }> <i className="fas fa-home" /> Laman Utama</Link>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <Link to={ Url( '/kuiz' ) }><i className="fas fa-search" /> Cari Kuiz</Link>
                            </td>
                        </tr>
                        {
                            user.loggedin
                                ? <>
                                    <tr>
                                        <td>
                                            <Link to={ Url( "#" ) } onClick={ e => handleLogout( e ) }> <i className="fas fa-sign-out-alt" /> Log Keluar </Link>
                                        </td>
                                    </tr>
                                    {
                                        user.data.hasOwnProperty( 'g_jenis' )
                                        && (
                                            <tr>
                                                <td>
                                                    <Link to={ Url( '/guru' ) }> <i className="fas fa-chalkboard-teacher" /> Laman Guru </Link>
                                                </td>
                                            </tr>
                                        )
                                    }
                                </>
                                : <tr>
                                    <td>
                                        <Link to={ Url( '/login' ) }>
                                            <i className="fas fa-sign-in-alt" /> Log Masuk
                                        </Link>
                                    </td>
                                </tr>
                        }
                    </tbody>
                </table>
            </BoxBody>
            {/* <LoginModalBox cond={showModal}/> */ }
        </Box>
    );
}

export default NavigasiBox;