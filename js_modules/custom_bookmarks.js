import { InputDialog } from './utils/inputDialog.js';
import { enableSubmitButton } from './utils/enableSubmitButton.js';
import { crossDisplay } from './utils/toggleDisplay.js';

export let customBookmarks =
    JSON.parse(localStorage.getItem('saved_bookmarks'));

export function loadBookmarks() {
    if (customBookmarks == null) {
        customBookmarks = [];
        return;
    }
    for (const n of customBookmarks) {
        addBookmarkToHTML(n.link, n.name, n.id);
    }
}

export function addBookmarkToHTML(link, name, id) {
    const allBookmarksContainer = document.getElementsByClassName(
        'flex-sub-container-horizontal',
    )[0];
    allBookmarksContainer.appendChild(createBookmark(link, name, id));
    const justAdded = document.getElementsByClassName('cross');
    justAdded[justAdded.length - 1].addEventListener('click', editBookmark);
}

function createBookmark(link, name, id) {
    const i = document.createElement('span');
    i.textContent = name.substring(0, 3).toUpperCase();
    i.className = 'custom_link_name';

    const d = document.createElement('div');
    d.className = 'cross';
    d.title = 'Modify bookmark details';
    d.setAttribute('tabindex', '5');

    const l = document.createElement('div');
    l.className = 'loading';

    const newBookmark = document.createElement('a');
    newBookmark.className = 'custom_bookmark bookmark-icon clickable';
    newBookmark.setAttribute('href', link);
    newBookmark.setAttribute('id', id);
    newBookmark.setAttribute('tabindex', '1');
    newBookmark.appendChild(i);
    newBookmark.appendChild(l);
    newBookmark.appendChild(d);

    const newBookmarkTitle = document.createElement('span');
    newBookmarkTitle.className = 'bookmark-title';
    newBookmarkTitle.textContent = name;
    if (sessionStorage.getItem('labels') === 'hidden') {
        newBookmarkTitle.classList.add('hidden');
    }

    const newBookmarkContainer = document.createElement('div');
    newBookmarkContainer.className = 'bookmark-container';
    // newBookmarkContainer.title = name;

    newBookmarkContainer.appendChild(newBookmark);
    newBookmarkContainer.appendChild(newBookmarkTitle);

    return newBookmarkContainer;
}

export function saveBookmarks(link, name, id) {
    customBookmarks.push({
        link: link,
        name: name,
        id: id,
    });
    localStorage.setItem('saved_bookmarks', JSON.stringify(customBookmarks));
}

export function removeBookmarkFromLocalStorage(id) {
    customBookmarks = customBookmarks.filter((elem) => {
        return id != elem.id;
    });
    localStorage.setItem('saved_bookmarks', JSON.stringify(customBookmarks));
}

export function editBookmarkInLocalStorage(id, newName, newLink) {
    const edit = customBookmarks.filter((elem) => {
        return id == elem.id;
    });
    edit[0].name = newName;
    edit[0].link = newLink;
    localStorage.setItem('saved_bookmarks', JSON.stringify(customBookmarks));
}

export function getBookmarkDetailsFromLocalStorage(id) {
    const edit = customBookmarks.filter((elem) => {
        return id == elem.id;
    });
    return [edit[0].id, edit[0].name, edit[0].link];
}

export function toggleRemoveButtons(visible) {
    switch (visible) {
        case 'show': {
            crossDisplay(`block`);
            break;
        }
        case 'hide': {
            crossDisplay(`none`);
            break;
        }
    }
}

export function downloadBookmarks(filename, text) {
    const element = document.createElement('a');
    element.setAttribute(
        'href',
        'data:text/plain;charset=utf-8,' + encodeURIComponent(text),
    );
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

export function editBookmark(event) {
    event.preventDefault();
    event.stopPropagation();
    const targetElement = event.target.parentNode;

    const onChange = () => {
        const checkbox = InputDialog.getCheckboxField();
        const modalSubmitButton = InputDialog.getSubmitButton();
        const inputFields = InputDialog.getInputFields();

        if (checkbox.checked) {
            modalSubmitButton.textContent = 'Delete';
            modalSubmitButton.classList.add('deleteButton');
            for (const i of inputFields) {
                i.disabled = true;
            }
            modalSubmitButton.disabled = false;
        } else if (!checkbox.checked) {
            modalSubmitButton.textContent = 'Save';
            modalSubmitButton.classList.remove('deleteButton');
            for (const i of inputFields) {
                i.disabled = false;
            }
        };
    };

    const details = getBookmarkDetailsFromLocalStorage(targetElement.id);

    InputDialog.show('Edit bookmark',
        null,
        ['Name', 'Address'],
        'Save',
        'Cancel',
        'Delete this bookmark',
        [() => enableSubmitButton(event, true), onChange],
        () => {
            // InputDialog.getInputFields()[0].setAttribute('maxlength', '4');
            InputDialog.getInputFields()[0].value = details[1];
            InputDialog.getInputFields()[1].value = details[2];
        },
    ).then((res) => {
        if (res.checkboxChecked) {
            removeBookmarkFromLocalStorage(targetElement.id);
            targetElement.parentNode.style.display = 'none';
            return;
        }
        targetElement.href = res.inputValues[1].replaceAll(' ', '');
        targetElement.firstChild.innerHTML = res.inputValues[0].substring(0, 3);
        targetElement.nextSibling.innerHTML = res.inputValues[0];

        editBookmarkInLocalStorage(
            targetElement.id,
            res.inputValues[0],
            res.inputValues[1].replaceAll(' ', ''),
        );
    }).catch((e) => console.log(e));

    return;
}

