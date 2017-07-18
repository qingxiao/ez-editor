/**
 * Created by xiaoqing on 2017/7/18.
 */
import Layout from 'antd/lib/layout';
import {Component} from 'react';
class App extends Component {
    render() {
        return (
            <Layout>
                <Header>header</Header>
                <Layout>
                    <Sider>left sidebar</Sider>
                    <Content>main content</Content>
                    <Sider>right sidebar</Sider>
                </Layout>
                <Footer>footer</Footer>
            </Layout>
        );
    }
}

export default App;
