let rq = require('request-promise');


rq = rq.defaults({
   baseUrl: 'https://www.facebook.com' ,
   headers: {
    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    'accept-language': 'vi,en;q=0.9',
    'cache-control': 'max-age=0',
    'dnt': '1',
    'user-agent': 'Mozilla/5.0 (Linux; Android 5.1.1; SM-J500H Build/LMY48B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.126 Mobile Safari/537.36'
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