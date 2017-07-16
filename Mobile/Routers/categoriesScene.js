// import NavigationDrawer from '../components/commons/NavigationDrawer';
// import requireAuth from '../utils/requireAuth';
import Categories from '../components/Screens/Categories';
import CategoryEdit from '../components/Screens/Categories/CategoryEdit';
import CategoryView from '../components/Screens/Categories/CategoryView';
import { Scene } from 'react-native-router-flux';

const CategoriesScene = () => (
        <Scene
key="categories"
            animation='fade'
        >
            <Scene key="categoryList" component={Categories} title="Nhóm sản phẩm" />
            <Scene key="categoryEdit" component={CategoryEdit} title="Sửa nhóm sản phẩm" />
            <Scene key="categoryView" component={CategoryView} title="Xem sản phẩm" />
        </Scene>
    );
export default CategoriesScene;
