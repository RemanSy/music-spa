import mainPage from "./views/mainPage.js";
import registrationForm from "./views/registrationForm.js";
import profile from "./views/profile.js";
import authForm from "./views/authForm.js";
import groupForm from "./views/groupForm.js";
import albumForm from "./views/albumForm.js";

class Router {
    title = document.querySelector('title');
    body = document.querySelector('main.main');
    curUrl = window.location.pathname;
    targetUrl = '';
    // Callback before routing
    preReqCallback = null;

    getRoute(url) {
        url = this.getUrlPath(url);
        this.curUrl = url;
        history.pushState({}, null, url);
        
        switch(url) {
            case '/':
                return new mainPage();

            case '/groupForm':
                return new groupForm();

            case '/albumForm':
                return new albumForm();

            case '/registrationForm':
                return new registrationForm();

            case '/authForm':
                return new authForm();

            case '/profile':
                return new profile();

            default:
                title.innerHTML = '404';
                main.innerHTML = '<h1>404 - Страница не найдена</h1>';
        }
    }

    beforeReq(callback) {
        let cb = () => {
            let from = this.curUrl;
            let to = this.targetUrl;
            let nt = this.renderUrl;
            nt = nt.bind(this);
            
            let next = (url = null) => {
                return (url !== null) ? nt(url) : true;
            };

            return callback(to, from, next);
        }
        
        this.preReqCallback = cb;
    }

    navigateTo(url) {
        this.targetUrl = this.getUrlPath(url);
        
        if (this.preReqCallback != null)
            if (!this.preReqCallback())
                return;

        this.renderUrl(url);
    }

    renderUrl(url) {
        return this.renderPage(this.getRoute(url));
    }

    renderPage(c) {
        this.title.innerHTML = c.title;
        this.body.innerHTML = c.getHTML();
        c.scripts();
    }

    getUrlPath(url) {
        if (!url.includes('//')) return url;

        let r = url.split('//')[1].split('/').slice(1)[0];
        return r != '' ? `/${r}` : '/';
    }

    decodeCookie() {
        let tmp = {};
        let cookies = document.cookie;

        if (!cookies) return false;

        cookies = cookies
        .split(';')
        .map(v => v.split('='));

        cookies.forEach(val => {
            tmp[decodeURIComponent(val[0].trim())] = decodeURIComponent(val[1].trim());
        });

        return tmp;
    }

    isAuthorized() {
        let cookies = this.decodeCookie();
        return cookies.user ? true : false;
    }
}

const msg = document.querySelector('.flash-message'),
      router = new Router();

function toggleMessage() {
    msg.classList.toggle('shown');
}

toggleMessage();

router.beforeReq( (to, from, next) => {
    if (router.getRoute(to).meta?.auth === true)
        return (router.isAuthorized() === true) ? next() : 
        (to == from) ? next('/') : next(from);
    
    return next();
} );

document.body.addEventListener('click', e => {
    let t = e.target;
    if (t.tagName === 'A' && t.dataset.link != undefined) {
        e.preventDefault();
        router.navigateTo(t.href);
    }
});

window.addEventListener('load', e => {
    e.preventDefault();
    router.navigateTo(window.location.pathname);
});

window.addEventListener('popstate', (e) => router.navigateTo(e.target.location.pathname));