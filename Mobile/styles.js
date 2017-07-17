import { Dimensions } from 'react-native';
const height = Dimensions.get("window").height;
export default styles = {
    container: {
        flex: 1,
        justifyContent: 'center'
    },
    body: {
        flex: 1,
        paddingLeft: 5,
        paddingRight: 5,
        backgroundColor: '#bdc3c7'
    },
    headTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#ecf0f1'
    },
    footerTitleStyle: {
        color: '#ecf0f1',
        fontSize: 20
    }
}