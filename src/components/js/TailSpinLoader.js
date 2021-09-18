import Loader from 'react-loader-spinner';

export default function TailSpinLoader( props )
{
    return (
        <div className="loader-container" { ...props }>
            <div className="loader">
                <Loader type="TailSpin" color="#8E2DE2" />
                { props.children }
            </div>
        </div>
    );
}