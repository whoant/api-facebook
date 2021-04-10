require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const readLineSync = require('readline-sync');

const fs = require('fs');

const Facebook = require('./module');
let rq = require('request-promise');


const getFbdtsg = (cookie) => {
    return new Promise(async (resolve, reject) => {
        const api = new Facebook();
        api.setCookie(cookie);

        try {
            const res = await api.run({
                path: '/me'
            });
            // fs.writeFileSync("text.html", res, {encoding: 'utf-8'});
            let regExFbdtsg = /name="fb_dtsg" value="(.*?)"/g.exec(res);
            if (regExFbdtsg === null) return reject(false);
            let regExUserId = /c_user=(\d+)/g.exec(cookie);
            resolve({
                'userId': regExUserId[1],
                'fbDtsg': regExFbdtsg[1],
                cookie
            });
        } catch (error) {
            reject(error);
        }
    });
};

const postGroup = (paramFb, infoFb) => {
    return new Promise(async (resolve, reject) => {
        let attachments = [];

        const { userId, fbDtsg, cookie } = paramFb;
        const {idGroup, text, listIdPhoto} = infoFb;
        if (listIdPhoto != null) {
            attachments = listIdPhoto.map(id => {
                return {
                    photo: {
                        id
                    }
                }
            });
        }
        const api = new Facebook();
        api.setCookie(cookie);
        const variables = {
            "input": {
                "logging": {
                    "composer_session_id": uuidv4()
                },
                "source": "WWW",
                "attachments": attachments,
                "message": {
                    "ranges": [],
                    "text": text
                },
                "with_tags_ids": [],
                "inline_activities": [],
                "explicit_place_id": "0",
                "tracking": [
                    null
                ],
                "audience": {
                    "to_id": idGroup
                },
                "actor_id": userId,
                "client_mutation_id": "7"
            },
            "displayCommentsFeedbackContext": null,
            "displayCommentsContextEnableComment": null,
            "displayCommentsContextIsAdPreview": null,
            "displayCommentsContextIsAggregatedShare": null,
            "displayCommentsContextIsStorySet": null,
            "feedLocation": "GROUP",
            "feedbackSource": 0,
            "focusCommentID": null,
            "gridMediaWidth": null,
            "scale": 1,
            "privacySelectorRenderLocation": "COMET_STREAM",
            "renderLocation": "group",
            "useDefaultActor": false,
            "isFeed": false,
            "isFundraiser": false,
            "isFunFactPost": false,
            "isGroup": true,
            "isTimeline": false,
            "isLivingRoom": false,
            "isSocialLearning": false,
            "isPageNewsFeed": false,
            "isProfileReviews": false,
            "prefetchRecentMediaPhotos": true,
            "UFI2CommentsProvider_commentsKey": "CometGroupDiscussionRootSuccessQuery"
        };

        const formData = {
            path: '/api/graphql/',
            form: {
                '__a': 1,
                'fb_dtsg': fbDtsg,
                'fb_api_caller_class': 'RelayModern',
                'fb_api_req_friendly_name': 'ComposerStoryCreateMutation',
                'variables': JSON.stringify(variables),
                'doc_id': '4515349595146965'
            }
        };
        try {
            const res = await api.run(formData);
            resolve(res);
        } catch (error) {
            reject(error);
        }
    });

};

const uploadImage = (paramFb) => {
    return new Promise(async (resolve, reject) => {
        const { userId, fbDtsg, cookie } = paramFb;

        try {
            const options = {
                method: 'POST',
                uri: `https://upload.facebook.com/ajax/react_composer/attachments/photo/upload?__user=${userId}&__a=1&fb_dtsg=${fbDtsg}`,
                formData: {
                    farr: {
                        value: fs.createReadStream('1.png'),
                        options: {
                            filename: 'test.png',
                            contentType: 'image/png'
                        }
                    },
                    profile_id: userId,
                    source: 8,
                    upload_id: 'jsc_c_8v',
                    waterfallxapp: 'comet'
                },
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36',
                    'Cookie': cookie,
                }
            };
            let res = await rq(options);
            res = JSON.parse(res.substr(9, res.length));
            resolve(res);
        } catch (error) {
            reject(error);
        }
    });
};

(async () => {
    try {
        const COOKIE = process.env.COOKIE;
        
        const paramQuery = await getFbdtsg(COOKIE);
        
        const upload = await uploadImage(paramQuery);
        
        let idGroup = readLineSync.question('ID Group : ');
        // let text = readLineSync.question('Content : ')
        const infoFb = {
            idGroup,
            text: 'Võ Văn Hoàng Tuân',
            listIdPhoto: [upload.payload.photoID]
        };
        const res = await postGroup(paramQuery, infoFb);
        console.log('Success');
    } catch (error) {
        console.log(error);
    }
})();