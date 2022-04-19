import Form from "./Form.js";

export default class extends Form {
    title = 'Добавление альбома';

    getHTML() {
        return `
            <section class="albumForm">
                <div class="title">Добавление альбома</div>
                <div class="container flex">
                    <form action="addAlbum" method="POST" enctype="multipart/form-data">
                        <div class="drop-zone">
                            <span class="drop-zone__prompt">Перетащите файл сюда</span>
                            <input type="file" name="image" class="d-none">
                        </div>
                        
                        <div class="form-text">
                            <div class="form-control drop-down" id="groups">
                                <label for="group">Группа</label>
                                <input type="text">
                                <input type="hidden" name="group">
                                <ul class="d-none groups"></ul>
                            </div>

                            <div class="form-control">
                                <label for="country">Название</label>
                                <input type="text" name="albumTitle">
                            </div>

                            <div class="form-control">
                                <label for="country">Год выпуска</label>
                                <input type="number" name="year">
                            </div>
                            
                            <div class="form-control drop-down" id="genres">
                                <label for="genre">Жанр</label>
                                <input type="text">
                                <input type="hidden" name="genre">
                                <ul class="d-none genres"></ul>
                            </div>

                            <button class="btn mt-2">Сохранить альбом</button>
                        </div>

                    </form>
                </div>

                <div class="tracks_table">
                    <div class="container">
                        
                        <table>

                            <tr>
                                <th><div class="title">Название</div></th>
                                <th><div class="title">Файл</div></th>
                            </tr>

                            <tr>
                                <td colspan="2"><button class="btn addRow">Добавить трек</button></td>
                            </tr>

                        </table>

                    </div>
                </div>
            </section>
        `;
    }

    scripts() {
        const form = document.querySelector('form'),
              table = document.querySelector('table'),
              addTableRow = table.querySelector('.btn.addRow');


        // Handle table text changing
        table.addEventListener('click', e => {
            let t = e.target;
            if (t.dataset.title != '') return;
            if (t.querySelector('input')) return;

            let input = document.createElement('input');
            input.type = 'text';
            input.value = t.innerHTML;
            t.innerHTML = '';
            t.insertAdjacentElement('afterbegin', input);
            input.focus();

            input.addEventListener('blur', () => t.innerHTML = input.value );
        });

        // Handling adding file to table
        table.addEventListener('click', e => {
            let t = e.target;
            if (t.dataset.file != '')
                if (t.parentNode.dataset.file == '')
                    t = t.parentNode;
                else return;

            let input = t.querySelector('input');
            input.click();
            input.addEventListener('change', e => t.querySelector('span').innerHTML = e.target.files[0].name);
        });

        // Press enter to blur input
        table.addEventListener('keyup', e => {
            if (e.target.tagName != 'INPUT') return;
            
            if (e.key == 'Enter') e.target.blur();
        });
        
        // Add table row
        addTableRow.addEventListener('click', () => {
            let row = `
                <tr>
                    <td data-title>Название трека</td>
                    <td data-file>
                        <span>Добавить файл</span>
                        <input type="file" name="image" class="d-none">
                    </td>
                </tr>
            `;
            
            addTableRow.parentNode.parentNode.insertAdjacentHTML('beforebegin', row);
        });

        form.addEventListener('submit', async e => {
            e.preventDefault();

            let data = new FormData(form);

            let trackRows = Array.from(document.querySelectorAll('table tr'));
            trackRows.splice(0, 1);
            trackRows.splice(trackRows.length - 1, 1);
            

            await asyncForEach(trackRows, async (row, key) => {
                let title = row.querySelector('td[data-title]').innerHTML;
                let file = row.querySelector('td[data-file] input').files[0];

                await this.getDuration(file)
                .then( duration => {
                    data.append(`title[]`, title);
                    data.append(`file[]`, file);
                    data.append(`duration[]`, duration);
                });
            });

            this.xhr.sendRequest('POST', '/albums/add' , data);
        });

        async function asyncForEach(array, callback) {
            for (let index = 0; index < array.length; index++) {
                await callback(array[index], index, array);
            }
        }

        // Creating drop file upload
        this.createDropFileUpload(document.querySelector('.drop-zone'));

        // Creating dropdown lists
        this.createDropdownList(document.querySelector('#groups'), '/groups/search?query=', 'group_id', 'title');
        this.createDropdownList(document.querySelector('#genres'), '/genres/search?query=', 'genre_id', 'name');
    }

    getDuration(file) {
        return new Promise( (resolve, reject) => {
            let audio = new Audio();

            try {
                audio.src = URL.createObjectURL(file);
            } catch (error) {
                console.log('Ошибка загрузки файла');
            }

            audio.onloadedmetadata = () => {
                let aDur = audio.duration;
                let m = Math.round(aDur / 60);
                let s = Math.round(60 * (aDur / 60 % 1));
                s = (Math.floor(s / 10) == 0) ? `0${s}` : s;
                resolve(`${m}:${s}`);
            }
        });
    }
}