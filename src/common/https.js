import Global from './global'
import Store from './vuex'
import axios from 'axios'

let isLoading = 0;

function showLoading() {
    if (isLoading <= 0) {
        // Store.state.gLoad=true;
        Store.commit('showLoad')
    }
    isLoading++;
}

function hideLoading() {
    // Store.state.gLoad=false;
    Store.commit('hideLoad')
    isLoading--;
}

function uploadFile(fileOrg, callback) {
    showLoading();
    uni.uploadFile({
        url: Global.uploadUrl + "?folder=Image&fileName=" + fileOrg,
        filePath: fileOrg,
        name: "file",
        success: (res) => {
            if (res.statusCode == 200) {
                let obj = JSON.parse(res.data)
                // let obj =res.data.replace(/D:\\File\\log_IIS\\/g,'');
                callback(obj.data);
            } else {
                Global.toast("文件上传失败")
                callback(false);
            }
        },
        fail: (res) => {
            // console.log("FileUploadFail");
            callback(false);
        },
        complete: (res) => {
            hideLoading();
        }
    });
}

function requestHttpCommon(api, sendData, met, callback, errorCallback) {
    if (!sendData instanceof FormData) {
        sendData = JSON.stringify(sendData)
        // } else {
        // sendData = qs.stringify({RequestContent: sendData})
    }
    axios({
        url: Global.domain + api,
        method: met,
        //发送json数据用这个
        data: sendData,
        header: {
            'Content-Type': typeof (sendData) == "object" ? 'application/json' : 'application/x-www-form-urlencoded',
        },
        timeout: 20000,
        withCredentials: true
    }).then((res) => {
        // console.log(res,'httpSuccess');
        if (res.status >= 200 && res.status < 300) {
            let endResult = res.data;
            callback(endResult)
        } else {
            Global.toast("ErrorCode:" + res.statusCode);
            callback(res.data);
        }
    }).catch((error) => {
        if (errorCallback) {
            errorCallback(error);
        } else {
            processErrorResponse(error.response);
        }
    })
}

function processErrorResponse(response) {
    if (response.status === 400) {
        Global.toast(response.data.message, 'error')
    } else if (response.status === 401) {
        Global.toast('请登录')
        window.location.href = "/Login"
    } else if (response.status === 403) {
        Global.toast('您无权访问', 'error')
    } else if (response.status === 500) {
        Global.toast('服务器错误，请联系管理员', 'error')
    }

}

function postHttp(api, sentData, callback, errorCallback) {
    let arrApi = api.split(";");
    let isNeedNotice = true;
    if (arrApi.length > 1) {//api分号后面拼接false就表示不要通知
        isNeedNotice = false;
        api = arrApi[0];
    } else {
        showLoading();
    }
    requestHttpCommon(api, sentData, 'POST', function (reDa) {
        callback(reDa);
        if (isNeedNotice) {
            hideLoading();
        }
    }, errorCallback);
}

function getHttp(api, sentData, callback, errorCallback) {
    if (typeof (sentData) == "object") {
        let i = 0;
        for (let key in sentData) {
            if (i == 0) {
                api += "?";
            } else {
                api += "&";
            }
            api += key + "=" + sentData[key];
            i++;
        }
    }
    requestHttpCommon(api, sentData, 'Get', function (reDa) {
        callback(reDa);
    }, errorCallback);
}


function freeHttp(api, sendData, callback) {

    uni.request({
        url: api,
        method: "POST",
        data: sendData,
        header: {
            'Content-Type': 'application/x-www-form-urlencoded'
            // 'content-type': 'application/json',
            // 'Access-Control-Allow-Origin':'*'
        },
        timeout: 60000,
        fail: (res) => {
            Global.toast("网络连接失败,请稍后再试");
            callback(false);
        },
        complete: (res) => {
            hideLoading();
        },
        success: (res) => {
            // console.log(res,'httpSuccess');
            callback(res.data);
        }
    });
}

export default {
    // hideLoading,
    // showLoading,
    postHttp,
    getHttp,
    freeHttp,
    uploadFile,
}
