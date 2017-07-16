import { Dimensions } from 'react-native';
const height = Dimensions.get("window").height;
export default styles = {
    container: {
        flex: 1
    },
    body: {
        flex: 1,
        backgroundColor: '#bdc3c7',
        paddingLeft: 10,
        paddingRight: 10
    },
    headTitle: {
        fontSize: 20,
        color: '#1abc9c'
    }
}