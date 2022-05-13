import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    createDropFileUpload(dropZone) {
        let dropZoneText = dropZone.querySelector('span');
        let file = dropZone.querySelector('input[type=file]');
        
        dropZone.addEventListener('dragover', e => {
            e.preventDefault();

            dropZone.classList.add('drag');
            dropZoneText.classList.add('d-none');
        });

        ['dragleave', 'dragend'].forEach(type => {
            dropZone.addEventListener(type, e => {
                e.preventDefault();

                dropZone.classList.remove('drag');
                dropZoneText.classList.remove('d-none');
            });
        });

        dropZone.addEventListener('drop', e => {
            e.preventDefault();
            let r = new FileReader();

            if (e.dataTransfer.files.length) {
                file.files = e.dataTransfer.files;
                r.readAsDataURL(file.files[0]);
            }

            r.onload = () => dropZone.style.background = `url(${r.result})`;
        });

        dropZone.addEventListener('click', e => {
            file.click();
        });

        file.addEventListener('change', e => {
            let r = new FileReader();
                
            r.readAsDataURL(file.files[0]);

            r.onload = () => dropZone.style.background = `url(${r.result})`;

            dropZone.classList.add('drag');
            dropZoneText.classList.add('d-none');
        });
    }

    // 1 Div with inputs, 2 url for the request, 3 id of table, 4 name of required field
    createDropdownList(inputDiv, url, idName, titleName) {
        if (!inputDiv.classList.contains('drop-down')) throw 'Input div must have a \'drop-down\' class';
        let list = document.createElement('ul');
        let realInput = inputDiv.querySelector('input[type=hidden]');
        let tmpInput = inputDiv.querySelector('input[type=text]');

        inputDiv.addEventListener('input', e => {
            let input = e.target;
            inputDiv.insertAdjacentElement('beforeend', list);

            if (input.value.length < 2) return;

            this.xhr.sendRequest('GET', `${url}${input.value}`)
            .then(res => {
                list.innerHTML = generateList(JSON.parse(res), idName, titleName);

                list.querySelectorAll('li').forEach(el => {
                    el.addEventListener('click', () => {
                        tmpInput.value = el.innerHTML;
                        realInput.value = el.dataset.id;
                        list.classList.add('d-none');
                    });
                });
            });
        });

        tmpInput.addEventListener('focus', () => { list.classList.remove('d-none') });

        tmpInput.addEventListener('blur', () => {
            setTimeout( () => setTimeout(list.classList.add('d-none')), 90);
        });

        function generateList(arr, idName, titleName) {
            let s = '';
            arr.forEach(el => s += `<li data-id='${el[idName]}'>${el[titleName]}</li>`);
            return s;
        }
    }
}