<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= $title ?></title>
    <link rel="icon" type="image/x-icon" href="media/logo.png">
    <link href="media/material-icons2.css" rel="stylesheet">
    <link rel="stylesheet" href="style/main.css">
    <link rel="stylesheet" href="style/style.css">
</head>
<body>
    <div class="wrapper">
        <div class="nav">
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
        </div>
    
        <section class="player">
            <div class="container flex">
                <div class="w-100">
                    <div class="flex justify-start">
                        <div class="audio__title"></div>
                        -
                        <div class="audio__group"></div>
                        <i class="material-icons toggle__volume">volume_up</i>
                        <div class="ch_volume">
                            <div class="volume__container">
                                <div class="volume"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="w-100 flex">
                    <div class="controls">
                        <i class="material-icons" id="prev_arrow">skip_previous</i>
                        <i class="material-icons" id="play_arrow">play_arrow</i>
                        <i class="material-icons" id="next_arrow">skip_next</i>
                    </div>
                    <div class="progress__container">
                        <div class="progress"></div>
                    </div>
                </div>
            </div>
        </section>

        <main class="main">
            <!-- {{content}} -->
        </main>
    </div>
    <script src="scripts/Player.js"></script>
    <script src="scripts/router.js" type="module"></script>
</body>
</html>