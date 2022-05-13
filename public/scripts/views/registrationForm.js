import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    title = 'Регистрация';

    getHTML() {
        return `
            <section class="registerForm">
                <div class="title">Регистрация</div>
                <div class="container flex">
                    <form action="addUser" method="POST" class="form-register">
                        <div class="form-control">
                            <label for="username">Имя пользователя</label>
                            <input type="text" name="username" id="username" required>
                        </div>

                        <div class="form-control">
                            <label for="email">Email</label>
                            <input type="email" name="email" id="email" required>
                        </div>

                        <div class="form-control">
                            <label for="password">Пароль</label>
                            <input type="password" name="password" id="password" required>
                        </div>

                        <div class="form-control">
                            <label for="password_confirm">Подтвердите пароль</label>
                            <input type="password" name="password_confirm" id="password_confirm" required>
                        </div>
                        <div class="error d-none"></div>
                        <button class="btn">Зарегистрироваться</button>
                    </form>
                    <a href="/authForm" data-link>Зарегистрированы? Узнали? Войдите...</a>
                    </div>
            </section>
        `;
    }

    scripts() {
        const form = document.querySelector('form.form-register'),
              nav = document.querySelector('div.nav'),
              pass = form.querySelector('#password'),
              passConf = form.querySelector('#password_confirm'),
              err = form.querySelector('.error');

        form.addEventListener('submit', e => {
            e.preventDefault();

            if (pass.value != passConf.value) {
                err.classList.remove('d-none');
                err.classList.add('flex');
                return err.innerHTML = 'Пароли не совпадают';
            }

            let genT = () => Math.random().toString(36).slice(2);
            let token = genT() + genT();

            let fdTmp = new FormData(e.target);

            fdTmp.append('token', token);

            err.classList.add('d-none');

            this.xhr.sendRequest('POST', '/users/add', fdTmp)
            .then(res => {
                if (res == '') history.back();

                document.cookie = `user=${token}`;

                this.xhr.sendRequest('GET', '/templates/nav')
                .then(res => nav.innerHTML = res);
            });
        });
    }
}