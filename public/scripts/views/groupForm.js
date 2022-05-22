import Form from "./Form.js";

export default class extends Form {
    title = 'Добавление группы';
    meta = {auth : true, access : 2};

    getHTML() {
        return `
            <section class="groupForm">
                <div class="title">Добавление группы</div>
                <div class="container flex">
                    <form action="addGroup" method="POST" enctype="multipart/form-data">
                        <div class="drop-zone">
                            <span>Перетащите файл сюда</span>
                            <input type="file" name="cover" class="d-none">
                        </div>
                        
                        <div class="form-text">
                            <div class="form-control">
                                <label for="title">Название</label>
                                <input type="text" name="title">
                            </div>

                            <div class="form-control drop-down">
                                <label for="country">Страна</label>
                                <input type="text">
                                <input type="hidden" name="country">
                            </div>

                            <button class="btn">Добавить</button>
                        </div>

                    </form>
                </div>
            </section>
        `;
    }

    async scripts() {
        const form = document.querySelector('.groupForm form');

        this.createDropFileUpload(document.querySelector('.drop-zone'));
        this.createDropdownList(document.querySelector('.drop-down'), '/countries/search?query=', 'country_id', 'name');

        form.addEventListener('submit', e => {
            e.preventDefault();
            let d = new FormData(e.target);
            this.xhr.sendRequest('POST', '/groups/add', d);
        });
    }
}