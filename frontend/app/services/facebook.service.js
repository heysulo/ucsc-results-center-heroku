app.service('FacebookService',function ($rootScope,$q,$localStorage,$location,$timeout,$interval) {
    let serviceReady = undefined;

    function getAccessTokenFromLocalStroage() {
        if ($localStorage.facebookAuth && $localStorage.facebookAuth.authResponse && $localStorage.facebookAuth.authResponse !== null){
            return $localStorage.facebookAuth.authResponse.accessToken || ''
        }
        return ''
    }

    return{
        parseXFBML: function () {
            FB.XFBML.parse();
        },
        getLoginStatus: function () {
            return $q((resolve, _reject) => {
                FB.getLoginStatus(function(response) {
                    resolve(response);
                });
            })
        },
        getUserDetails: function () {
            return $q((resolve, _reject) => {
                FB.api('/me', {
                    fields: 'email,first_name,last_name,gender,link,short_name,picture{url},cover,name',
                    access_token : getAccessTokenFromLocalStroage()
                }, (response)=> {
                    if (!response.error){
                        resolve(response);
                    }else{
                        this.reAuthenticate(true).then((success)=>{
                            if (success){
                                this.getUserDetails().then((data)=>{
                                    resolve(data);
                                });
                            }else{
                                resolve(response);
                            }
                        });
                    }
                });

            })
        },
        reAuthenticate : function (forceLogin = false) {
            console.warn('Reauthenticating', forceLogin ? 'with force flag' : '');
            return $q((resolve, _reject) => {
                FB.getLoginStatus(function(response) {
                    if((response.status !== 'connected' || forceLogin) && response.status !== 'unknown'){
                        FB.login(function(response) {
                            if (response.authResponse) {
                                $localStorage.facebookAuth = response;
                                serviceReady = true;
                                resolve(true);
                            } else {
                                resolve(false);
                            }
                        });
                    }else {
                        if (response.status !== 'unknown'){
                            $localStorage.facebookAuth = response;
                            serviceReady = true;
                            resolve(true);
                        }else{
                            resolve(false);
                        }
                    }
                });
            })
        },
        initializeService : function () {
            return $q((resolve,_reject)=>{
                if ($localStorage.facebookAuth){
                    console.log('lc');
                    FB.api('/me', {
                        fields: 'email,first_name,last_name,gender,link,short_name,picture{url},cover,name',
                        access_token : getAccessTokenFromLocalStroage()
                    }, (response)=> {
                        serviceReady = !response.error;
                        resolve(true);
                    });
                }else{
                    console.log('no lc');
                    FB.getLoginStatus((response)=>{
                        if (response.status === 'connected'){
                            $localStorage.facebookAuth = response;
                            serviceReady = true;
                        }else{
                            serviceReady = false;
                        }
                        resolve(true);
                    });
                }
            })
        },
        serviceReady : serviceReady
    }
});