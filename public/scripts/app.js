import Router from "./router.js";
import Xhr from "./xhr.js";

class App {
    router = new Router();
    msg = document.querySelector('.flash-message');

    showMessage(text, type = 'secondary') {
        let span = this.msg.querySelector('span');
        span.innerHTML = text;
        
        this.msg.classList.toggle(`alert-${type}`);

        this.msg.classList.toggle('shown');

        setTimeout(() => this.msg.classList.toggle('shown'), 4000);
    }

    isAuthorized() {
        let cookies = this.router.decodeCookie();
        return cookies.user ? true : false;
    }
}

const app = new App(),
      router = app.router,
      xhr = new Xhr();

      
router.beforeReq(  (to, from, next) => {
    function redirWithMsg(url, msg) {
        app.showMessage(msg);
        return next(url);
    }

    let route = router.getRoute(to);
    if (!route) return false;
    
    // Authentification check
    if (route.meta?.auth === true)
        if (app.isAuthorized() !== true)
               return (to == from) ? redirWithMsg('/', 'Для начала авторизируйтесь') : redirWithMsg(from, 'Для начала авторизируйтесь');
        
    
    // Check if authentification is valid
    xhr.sendRequest('GET', '/users/checkAuth')
    .then(data => {
        if (data == 0) {
            document.cookie = 'user=; Max-Age=0; path=/; domain=' + location.host;

            xhr.sendRequest('GET', '/templates/nav')
                    .then(res => document.querySelector('div.nav').innerHTML = res);


            return redirWithMsg('/', 'Ошибка авторизации, авторизируйтесь повторно');
        }
    });

    return next();
} );

export default app;

document.body.addEventListener('click', e => {
    let t = e.target;

    if (t.tagName === 'A' && t.dataset.link != undefined) {
        e.preventDefault();
        router.navigateTo(t.href);
    }
});

window.addEventListener('load', e => {
    e.preventDefault();
    router.navigateTo(window.location.href);
});

window.addEventListener('popstate', (e) => router.navigateTo(e.target.location.pathname));