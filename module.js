let rq = require('request-promise');


rq = rq.defaults({
   baseUrl: 'https://www.facebook.com' ,
   headers: {
    'User-Agent': 'Mozilla/5.0 (Linux; Android 5.1.1; SM-J500H Build/LMY48B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.126 Mobile Safari/537.36'
   }
});

class Facebook{

    run(postData){
        const { path, form} = postData;
        const config = {
            uri: path,
            method: (typeof form === "object") ? 'post' : 'get',
            headers: {
                'cookie': this.cookie
            },
            form
        };

        return rq(config);
    }
    

    setCookie(cookie){
        this.cookie = cookie;
    }

}

module.exports = Facebook;