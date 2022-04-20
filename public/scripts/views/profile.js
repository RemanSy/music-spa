import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    title = 'Профиль';
    meta = {auth : true};

    getHTML() {
        return `
            <section class="profile">
                <div class="container grid">
                    <div class="albums">
                        <div class="title">Группы</div>
                        <ul class="tree"></ul>
                    </div>
                    <div class="stats">
                        <div class="flex justify-between">
                            <span class="rank">Ранг: Подпивас</span>
                            <span class="albums-total">Альбомов сохранено: 14</span>
                            <span class="tracks-total">Всего треков: 134</span>
                        </div>
                    </div>
                    <div class="tracks">
                        <div class="title">Треки</div>
                        <ol></ol>
                    </div>
                </div>
            </section>
        `;
    }

    async scripts() {
        const tree = document.querySelector('ul.tree');

        // Getting groups and albums
        await this.xhr.sendRequest('GET', '/albums/group')
        .then(res => {
            const groups = JSON.parse(res);
            groups.forEach(group => {
                tree.insertAdjacentHTML('afterbegin', 
                `<li>
                    <div class="trigger">${group.title}</div>
                    <ul class="trigger-target">${this.loadAlbums(group.albums)}</ul>
                </li>`
                );
            });
        });

        // Handle album selection
        document.querySelectorAll('div.trigger').forEach(el => {
            el.addEventListener('click', () => {
                let ul = el.nextElementSibling;
                ul.classList.toggle('active');

                ul.querySelectorAll('li').forEach(li => {
                    
                    li.addEventListener('click', () => {
                        let albumId = li.dataset.id;

                        this.playerLoadTracks(albumId);
                    });

                });
            });
        });
    }

    async playerLoadTracks(albumId) {
        const trackList = document.querySelector('.tracks ol');
        trackList.innerHTML = '';

        await this.xhr.sendRequest('GET', `/tracks/album?id=${albumId}`)
        .then(res => {
            const tracks = JSON.parse(res);
            tracks.forEach(track => {
                trackList.insertAdjacentHTML('afterbegin', this.loadTrack(track.title, track.group, track.album, track.duration, track.location));
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
    }

    loadAlbums(albums) {
        let s = '';
        albums.forEach(album => {
            s += `<li data-id="${album.album_id}">${album.title}</li>`;
        });
        return s;
    }

    loadTrack(title, group, album, duration, src) {
        return `
            <li class="track_info flex justify-evenly">
                <span class="audio__title">${title}</span>
                <span class="audio__group">${group}</span>
                <span class="album">${album}</span>
                <span class="duration">${duration}</span>
                <div class="src" data-src="uploads/${src}"></div>
            </li>
        `;
    }
}