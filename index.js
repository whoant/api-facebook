const {v4 : uuidv4 } = require('uuid');
const fs = require('fs');

const Facebook = require('./module');


const getFbdtsg = (cookie) => {
    return new Promise(async(resolve, reject) => {
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



const postGroup = (paramFb, idGroup, text) => {
    return new Promise(async(resolve, reject) => {
        const {userId, fbDtsg, cookie} = paramFb;

        const api = new Facebook();
        api.setCookie(cookie);
        const variables = {
            "input": {
                "logging": {
                    "composer_session_id": uuidv4()
                },
                "source": "WWW",
                "attachments": [],
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

(async() => {
    try {
        const COOKIE = '';
        const paramQuery = await getFbdtsg(COOKIE);

        postGroup(paramQuery, '465419364679483', "Võ Văn Hoàng Tuân");
    } catch (error) {
        console.log(error);
    }
})();