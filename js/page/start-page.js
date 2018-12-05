/**
 * 启动页
 */
import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View,AsyncStorage} from 'react-native';
import Storage from 'react-native-storage';
import {StackActions,NavigationActions } from 'react-navigation';


export default class StartPage extends Component{

    constructor(props){
        super(props);

        this._initStorge();
        // this._deleteStorge();
        this._loadStorge();

    }

    _initStorge(){
        // 初始化Storage
        global.storage = new Storage({
            // 最大容量，默认值1000条数据循环存储
            size: 1000,
    
            // 存储引擎：对于RN使用AsyncStorage,如不指定则数据只会保存在内存中，重启后即丢失
            storageBackend: AsyncStorage,
                
            // 数据过期时间，默认一整天（1000 * 3600 * 24 毫秒），设为null则永不过期
            defaultExpires: null,
                
            // 读写时在内存中缓存数据。默认启用。
            enableCache: true,
        });  
    }

    _loadStorge(){
        // 读取storage
        global.storage.load({
            key: 'loginStatus',
            
            // autoSync(默认为true)意味着在没有找到数据或数据过期时自动调用相应的sync方法
            autoSync: false,
            
            // syncInBackground(默认为true)意味着如果数据过期，
            // 在调用sync方法的同时先返回已经过期的数据。
            // 设置为false的话，则始终强制返回sync方法提供的最新数据(当然会需要更多等待时间)。
            syncInBackground: true,
            
        })
        .then(ret => {
            // 检查token是否过期
            this._checkTokenDeadline(ret.token,ret.appId);
        }).catch(err => {
            // 找不到token，则直接需要登录
            if(err.name == 'NotFoundError'){
                this.props.navigation.navigate('Login');
            }else{
                alert(err.message);
            }
        });
    }

    _deleteStorge(){
        // 删除单个数据
        global.storage.remove({
        	key: 'loginStatus'
        });
    }
    // 检查token是否已过期
    _checkTokenDeadline(token,appId){
        fetch("https://devapi.edu.ink/auth/session", {
            method: "GET",
            headers: {
                'X-Session-Token':token,
                'X-App-Id':appId
            },
        }).then(response => {
            let responseJson = JSON.parse(response._bodyText);
            let responseStatus = response.status;

            global.appId = responseJson.appId;
            global.token = responseJson.sessionToken;

            let message;
            let routeName;
            switch(responseStatus){
                case 200:
                    global.token = responseJson.sessionToken;
                    routeName = 'Main';
                    break;
                case 401:
                    if(responseJson.appCode == 'ERR_INVALID_APP_ID'){
                        message = 'Invalid school ID';
                        routeName = 'Login';
                    }else if(responseJson.appCode == 'ERR_INVALID_SESSION_TOKEN'){
                        message = 'Authentication information expires, please log in again';
                        routeName = 'Login';
                    }
                    break;
                case 403:
                    if(responseJson.appCode == 'ERR_NO_PERMISSION'){
                        message = 'Currently User does not have permission to call this API';
                        routeName = 'Login';
                    }
                    break;
            }

            if(message != undefined){
                alert(message);
            }
            
            this.props.navigation.navigate(routeName);
        })
        .catch(error => {
          alert(error);
        });
    }


    render(){
        return(
            <View>
                <Text>start</Text>
            </View>
        );
    }
}