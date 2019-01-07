/**
 * 登录页
 */
import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View,Image,TextInput} from 'react-native';
import Button from '../component/button';
import PressText from '../component/press-text';

const styles = StyleSheet.create({
    container:{
        flex:1,
    },
    containerTop:{
        flex:1,
        flexDirection:'row',
    },
    containerCenter:{
        flex:1.3,
    },
    containerBottom:{
        flex:1,
        flexDirection:'row'
    },
    form:{
        flex:1,
        flexDirection:'row',
    },
    formLeft:{
        flex:1,
    },
    formCenter:{
        flex:6,
        flexDirection:'row',
        borderRadius:3,
        backgroundColor:'#FFF',
    },
    formRight:{
        flex:1,
    },
    formInput:{
        marginTop:10,
    },
    formInputLeft:{
        flex:1,
    },
    formInputCenter:{
        flex:18,
    },
    formInputRight:{
        flex:1,
    },
    formLabel:{
        color:'#8D959D',
    },
    formTextInput:{
        marginTop:5,
        backgroundColor:'#F4F6F9',
        borderRadius:4,
        height:36,
    },
    imageTop:{
        flex:1
    },
    imageCenter:{
        flex:4,
    },
    loginImage:{
        top:50,
        width:'60%',
        height:'60%',
        alignSelf:'center'
    },
    imageBottom:{
        flex:1,
    },
    loginLeft:{
        flex:1,
    },
    loginCenter:{
        flex:4,
    },
    loginRight:{
        flex:1,
    },
});

export default class Login extends Component{

    constructor(props){
        super(props);
        this.state = {
            xAppId:'',
            account:'',
            password:''
        }
    }

    _login(){
        const {xAppId,account,password} = this.state;

        if(xAppId == ''){
            alert('School ID can not be empty');
            return false;
        }
        if(account == ''){
            alert('Account can not be empty');
            return false;
        }
        if(password == ''){
            alert('Password can not be empty');
            return false;
        }
        

        fetch("https://devapi.edu.ink/auth/session", {
        method: "POST",
        headers: {
            'X-App-Id':xAppId
        },
        body: JSON.stringify({
                login: account,
                password: password,
                clientType:'mobile'
            })
        })
        .then(response => {
            let responseJson = JSON.parse(response._bodyText);
            let responseStatus = response.status;
            
            if(responseStatus == 200){
                // 存储登录信息
                global.storage.save({
                    key: 'loginStatus', 
                    data: { 
                        token:responseJson.sessionToken,
                        appId:responseJson.appId
                    },
                });
                // 更新全局变量
                global.appId = responseJson.appId;
                global.token = responseJson.sessionToken;

                // 跳转至主页
                this.props.navigation.navigate('Main');
            }else{
                alert(responseJson.message);
            }
            
        })
        .catch(error => {
          alert(error);
        });
    }

    _switchForgetPasswordPage(){
        // 跳转至忘记密码页面
        this.props.navigation.navigate('ForgetPassword');
    }

    render(){
        return(
            <View style={styles.container}>
                <View style={styles.containerTop}>
                    <View style={styles.imageTop}></View>
                    <View style={styles.imageCenter}>
                        <Image style={styles.loginImage} source={require('../image/icon/edu.png')} />
                    </View>
                    <View style={styles.imageBottom}></View>
                </View>
                <View style={styles.containerCenter}>
                    <View style={styles.form}>
                        <View style={styles.formLeft}></View>
                        <View style={styles.formCenter}>
                            <View style={styles.formInputLeft}></View>
                            <View style={styles.formInputCenter}>
                                <View style={styles.formInput}>
                                    <Text style={styles.formLabel}>SCHOOL</Text>
                                    <TextInput onChangeText={(text)=>{this.setState({xAppId:text})}} style={styles.formTextInput} value={this.state.xAppId} />
                                </View>
                                <View style={styles.formInput}>
                                    <Text style={styles.formLabel}>EMAIL/USERNAME/MOBILE PHONE</Text>
                                    <TextInput onChangeText={(text)=>{this.setState({account:text})}} style={styles.formTextInput} value={this.state.account} />
                                </View>
                                <View style={styles.formInput}>
                                    <Text style={styles.formLabel}>PASSWORD</Text>
                                    <TextInput onChangeText={(text)=>{this.setState({password:text})}} style={styles.formTextInput} secureTextEntry={true} value={this.state.password} />
                                </View>
                            </View>
                            <View style={styles.formInputRight}></View>
                        </View>
                        <View style={styles.formRight}></View>
                    </View>
                </View>
                <View style={styles.containerBottom}>
                    <View style={styles.loginLeft}></View>
                    <View style={styles.loginCenter}>
                        <Button
                            name = 'LOGIN'
                            onPress = {()=>this._login()}
                        />
                        <PressText 
                            name='I FORGET MY PASSWORD'
                            onPress={()=>this._switchForgetPasswordPage()}
                        />
                    </View>
                    <View style={styles.loginRight}></View>
                </View>
            </View>
        );
    }
}