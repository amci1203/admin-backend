import $ from 'jquery';

export default function Slides (_selector, _affectedBy, _loops) {
    const
        affectedBy       = affectedBy,
        loops            = loops || false,
        selector         = _selector.trim(),
        container        = $(selector),
        slides           = container.find('.slide'),
        numSlides        = slides.length,
        forwardTrigger   = container.find('.slide-forward'),
        backTrigger      = container.find('.slide-back'),
        jumpTrigger      = container.find('.slide-to'),
        startTrigger     = container.find('.slide-to-start'),
        previousTrigger  = container.find('.slide-to-previous');
    let
        currentSlide     = 0,
        previousSlide    = 0;

    function initSlides () {
        slides.css('display', 'none');
        slides.eq(0).addClass('slide--open');
        slides.eq(0).css('display', 'block');
        slides.each( index => classList.add(`slide-${index}`) )
    }

    function slide (slideTo) {
        if (!loops) {
            if (slideTo == 1 && currentSlide == numSlides - 1) return false
            if (slideTo != 1 && currentSlide == 0) return false
        }
        const nextSlide    = currentSlide == numSlides - 1 ? 0 : currentSlide + 1,
              prevSlide    = currentSlide == 0 ? numSlides  : currentSlide - 1,
              slideToShow = slideTo == 1 ? nextSlide : prevSlide;

        toggleSlides(slideToShow);
    }

    function slideToPrevious () { toggleSlides(previousSlide) }

    function jump (toSlide) {
        const targetSlide = toSlide ? +toSlide : +event.target.dataset.jump;
        if (targetSlide >= numSlides ) throw Error('ERR: index out of bounds.');
        if (targetSlide !== currentSlide) toggleSlides(targetSlide);
    }

    function toggleSlides (showIndex) {
        slides.eq(currentSlide).removeClass('slide--open');
        setTimeout(() => slides.eq(currentSlide).css('display',  'none'), 250);

        slides.eq(showIndex).css('display', 'block');
        setTimeout(() => slides.eq(showIndex).addClass('slide--open'), 250);

        previousSlide = currentSlide;
        currentSlide  = showIndex;

        $(document).trigger('slide', [null, null]);
        if (container.hasClass('scroll-top')) $(window).scrollTop(0);
    }

    function handleModalClose (event, isAffected) {
        wait(500);
        if (isAffected === affectedBy) {
            slides.eq(currentSlide)
                .removeClass('slide--open')
                .css('display', 'none');
            slides.eq(0)
                .addClass('slide--open')
                .css('display', 'block');
            currentSlide = 0;
        }
    }

    function wait (ms) { setTimeout(() => {}, ms) }

    return (() => {
        initSlides()

        forwardTrigger.click(slide.bind(null, 1))
        backTrigger.click(slide)

        previousTrigger.click(slideToPrevious)
        jumpTrigger.click(jump)
        startTrigger.click(jump.bind(null, "0"))

        $(document).on('modal-closed', handleModalClose)

        return { slide, slideToPrevious, jump }
    })()
}
