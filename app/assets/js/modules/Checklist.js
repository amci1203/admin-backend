import $ from 'jquery';

export default class Checklist (selector) {
    const
        selector = selector.trim(),
        list     = $(`#${this.selector}`),
        items    = this.list.children('li');

    function toggleListItem(event) {
        event.target.classList.toggle('selected');
        return false;
    }
    return (() => {
        items.click(toggleListItem)
    })()

}
