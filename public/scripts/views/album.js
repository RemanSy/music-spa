import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    title = 'Альбом';

    getHTML() {
        return `
            <section class="album">
                <div class="container flex">
                    <div class="meta">
                        <img src="" class="album__cover">
                        <div class="info">
                            
                            <div>АЛЬБОМ</div>
                            <div class="album__title"></div>
                            <div class="album__group"></div>
                            <div class="year_genre"></div>
                            <div class="buttons">
                                <button class="listen btn"><i class="material-icons">play_arrow</i> Слушать</button>
                                <span class="material-icons fav-icon btn">favorite_border</span>
                            </div>

                        </div>
                    </div>

                    <ol class="track_list"></ol>
                    </div>
                </div>
            </section>
        `;
    }

    async scripts() {
        const params = this.getUrlParameters(window.location.href);
        const trackList = document.querySelector('.track_list');
        if (!params.alid) return console.log('ID doesn\'t exist');
        
        await this.xhr.sendRequest('GET', `albums/get?id=${params.alid}`)
        .then(data => {
            data = JSON.parse(data)[0];
            let d = new Date(data.year);

            document.querySelector('.album__cover').src = `uploads/${data.image}`;
            document.querySelector('.album__title').innerHTML = data.title;
            document.querySelector('.album__group').innerHTML = data.group;
            document.querySelector('.year_genre').innerHTML = `${d.getFullYear()} &#8729; ${data.genre}`;
        });

        // Load tracks
        await this.xhr.sendRequest('GET', `/albums/tracks?id=${params.alid}`)
        .then(res => {
            const tracks = JSON.parse(res);
            tracks.forEach(track => {
                trackList.insertAdjacentHTML('beforeend', this.loadTrack(track.title, track.group, track.duration, track.location));
            });
        });

        Player.tracks = document.querySelectorAll('li.track_info');

        Player.tracks.forEach((track, key) => {
            track.addEventListener('click', () => {
                Player.songIndex = key;
                Player.loadAudio(track);
                Player.playAudio();
            });
        });

        // Add album to favorites
        document.querySelector('.buttons span.fav-icon').addEventListener('click', e => {
            let d = new FormData();
            d.append('album', params.alid);
            d.append('token', this.decodeCookie().user);

            this.xhr.sendRequest('POST', '/users/fav', d)
            .then(res => {
                
                if (res == 1)
                    this.showMessage('Добавлено в понравившиеся');
                else if (res == 0)
                    this.showMessage('Уже в понравившемся');
                else
                    this.showMessage('Ошибка добавления');

            });
        });

        // Add track to favorites
        document.querySelectorAll('.add_favorite').forEach(el => {
            el.addEventListener('click', e => {
                let file = e.target.parentNode.querySelector('.src').dataset.src;
                file = file.split('/')[1];
                let d = new FormData();
                d.append('file', file);
                d.append('token', this.decodeCookie().user);

                this.xhr.sendRequest('POST', '/users/fav', d)
                .then(res => {
                    
                    if (res == 1)
                        this.showMessage('Добавлено в понравившиеся');
                    else if (res == 0)
                        this.showMessage('Уже в понравившемся');
                    else
                        this.showMessage('Ошибка добавления');

                });
            });
        });

        document.querySelector('.listen.btn').addEventListener('click', () => {
            Player.songIndex = 0;
            Player.loadAudio(document.querySelector('.track_info'));
            Player.playAudio();
        });
    }

    loadTrack(title, group, duration, location) {
        return `
        <li class="track_info flex justify-evenly">
            <div class="audio__ctrls">
                <i class="material-icons">play_arrow</i>
            </div>
            <span class="audio__title">${title}</span>
            <span class="audio__group">${group}</span>
            <span class="material-icons fav-icon add_favorite">favorite_border</span>
            <span class="duration">${duration}</span>
            <div class="src" data-src="uploads/${location}"></div>
        </li>
        `;
    };
}