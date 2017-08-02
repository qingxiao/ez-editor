/**
 * Created by xiaoqing on 2017/7/18.
 */
import React from 'react';
//import Layout from 'antd/lib/layout';
import {Layout} from 'antd';
import {Component} from 'react';
//import 'antd/lib/layout/style/css';
import './index.less';
var {Header, Footer, Sider, Content} = Layout;
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
