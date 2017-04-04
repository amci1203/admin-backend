import $ from 'jquery';

export default function Modal (name) {
    const
        modal        = $(`#${name}`),
        openTrigger  = $(`.${name}--open'`),
        closeTrigger = $(`.${name}--close`);

    function openModal ()  { modal.addClass('modal--open') }
    function closeModal () { modal.removeClass('modal--open')  }

    function handleKeyPress (key) {
        if (key.keyCode === 27) modal.removeClass('modal--open');
    }

    return (() => {
        openTrigger.click(openModal);
        closeTrigger.click(closeModal);
        $(document).keyup(handleKeyPress);

        return { openModal, closeModal }
    })()
}
