// import NavigationDrawer from '../components/commons/NavigationDrawer';
// import requireAuth from '../utils/requireAuth';
import LoginForm from '../components/Screens/Auth/LoginForm';
import { Scene } from 'react-native-router-flux';

const AuthScene = () => (
        <Scene key="auth">
            <Scene key="login" component={LoginForm} title="Please login" initial />
        </Scene>
    );

export default AuthScene;
