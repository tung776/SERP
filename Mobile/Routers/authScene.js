import NavigationDrawer from '../components/commons/NavigationDrawer';
import requireAuth from '../utils/requireAuth';
import LoginForm from '../components/Screens/Auth/LoginForm';
import {Scene, Router, Actions} from 'react-native-router-flux';

const AuthScene = () => {
    return (
        <Scene key = "auth">
            <Scene key = "login" component = {LoginForm} title = "Please login" initial={true} />
        </Scene>
    );
};

export default AuthScene;