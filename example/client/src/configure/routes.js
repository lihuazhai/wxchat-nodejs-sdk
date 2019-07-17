/**
 * @file 路由配置文件
 * @author yangxiaoxu
 */

import React from 'react';
import loadable from 'react-loadable';

function Loading() {
    return <div>Loading...</div>;
}

export default [
    {
        path: '/index',
        exact: true,
        component: loadable({
            loader: () => import('../page/index/Index'),
            loading: Loading
        })
    }
];
