/**
 * @file 微信示例
 * @author yangxiaoxu@baiu.com
 */

import React from 'react';
import axios from 'axios';
import VConsole from 'vconsole/dist/vconsole.min.js' 

import * as wxJsSdk from '@/components/wxJsSdk';

import './index.less';

export default class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            imgList: []
        };
    }
    componentDidMount() {
        wxJsSdk.init(location.href);//初始化
        let vConsole = new VConsole();
    }

    takePicture = () => {
        wxJsSdk.takePicture();
    }

    render() {
        const imgList = this.state.imgList;
        return (
            <div>
                <ul>
                    <li> <a>微信登陆</a></li>
                    <li> <a href="javascript:void(0);" onClick={this.takePicture}>拍照片</a></li>
                    <li> <a>调起支付</a></li>
                    <li> <a>微信分享</a></li>
                </ul>
                <div>图片展示：</div>
                <div id="imgShow">
                    {Array.isArray(imgList) && imgList.map(imgSrc => <img key={imgSrc} src={imgSrc} />)}
                </div>
            </div>
        );
    }
}
