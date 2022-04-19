<div class="container flex">
    <img src="media/logo.png" alt="logo" class="logo">
    <span class="title">Plus ushi</span>
    <ul>
        <li><a href="/" data-link>Последние треки</a></li>
        <li><a href="/groupForm" data-link>Добавить группу</a></li>
        <li><a href="/albumForm" data-link>Добавить альбом</a></li>

        <? if(isset($_COOKIE['user'])): ?>
            <li><a href="/profile" data-link>Профиль</a></li>
        <? else: ?>
            <li><a href="/registrationForm" data-link>Регистрация</a></li>
        <? endif ?>

    </ul>
</div>