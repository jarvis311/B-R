// material-ui
import { useTheme } from '@mui/material/styles';
import img from './images/logo.png'
/**
 * if you want to use image instead of <svg> uncomment following.
 *
 * import logoDark from 'assets/images/logo-dark.svg';
 * import logo from 'assets/images/logo.svg';
 *
 */

// ==============================|| LOGO SVG ||============================== //

const Logo = () => {
    const theme = useTheme();

    return (
        <img style={{width:'150px'}} src={img} alt="sdlfhg" />
    );
};

export default Logo;
