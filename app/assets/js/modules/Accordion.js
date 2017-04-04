import $ from 'jquery';

export default function Accordion (_selector, _careted) {
    const
        selector = _selector.trim(),
        element  = $(selector),
        panel    = element.find('.accordion-panel'),
        triggers = element.find('.accordion-panel__trigger').length != 0 ? element.find('.accordion-panel__trigger') : element.find('.accordion-panel__heading'),
        caret    = _careted == undefined ? $(`${selector} .accordion-panel__caret`) : false;

    function setIndexes () {
        triggers.each((index, item) => {
            item.setAttribute('data-index', index);
        })
    }

    function toggleAccordionPanel (event) {
        let trigger   = event.target,
            thisPanel = panel.eq(+trigger.getAttribute('data-index')),
            thisCaret = thisPanel.find('.accordion-panel__caret')[0],
            content   = thisPanel.find('.accordion-panel__content')[0];

        content.classList.toggle('accordion-panel__content--open');
        if (thisCaret) {
            thisCaret.classList.toggle('accordion-panel__caret--open');
        }

//        const scrollTo = content.classList.contains('accordion-panel__content--open') ? content.offset().top - 50 : thisPanel.offset().top - 150;

        triggerWaypointRefresh()
//        scrollPage(scrollTo);
    }

    function toggleCaretlessPanel (event) {
        let trigger = event.target,
            content = panel.eq(+trigger.getAttribute('data-index')).find($('.accordion-panel__content'))[0];


        trigger.classList.toggle('open');
        content.classList.toggle('accordion-panel__content--open');
        const
//            scrollTo = content.classList.contains('accordion-panel__content--open') ? content.offset().top - 50 : element.offset().top - 250,
            html     = trigger.classList.contains('open') ? '(Show Less)' : '(Show More)';

        trigger.innerHTML = html;
        triggerWaypointRefresh();
//        scrollPage(scrollTo);
    }

    function triggerWaypointRefresh () {
        setTimeout(done => $(document).trigger('accordion'), 500);
    }

    function scrollPage (scrollTo) {
        $('html, body').animate({
            scrollTop: scrollTo
        }, 300);
    }

    return (() => {
        setIndexes();
        if (caret) {
            triggers.click(toggleAccordionPanel);
        } else {
            triggers.click(toggleCaretlessPanel);
        }
    })()
}

