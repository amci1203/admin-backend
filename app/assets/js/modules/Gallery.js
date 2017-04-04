import $ from 'jquery';

import Modal from './Modal';

export default function Gallery (_selector) {
    const
        interval          = 5,
        selector          = _selector.trim(),
        gallery           = $(`#${selector}`),
        images            = gallery.find('.gallery__image'),
        prev              = gallery.find('.prev'),
        next              = gallery.find('.next'),
        close             = gallery.find('.gallery--close'),
        numImages         = images.length,
        totalImagesView   = gallery.find('#total-images'),
        currentImageView  = gallery.find('#current-image');
    let
        currentImage      = 0;

    function init () {
        totalImagesView.html(numImages);
    }

    function openSlideshowView (event) {
        if (gallery.hasClass('slide-view')) return false;
        else {
            event.currentTarget.classList.add('active');
            currentImage = +event.currentTarget.getAttribute('data-index');
            currentImageView.html(currentImage + 1);
            gallery.toggleClass('slide-view');
        }
    }

    function closeSlideshowView () {
        images.removeClass('active');
        gallery.removeClass('slide-view');
    }

    function slide(direction) {
        let current = currentImage;
        images.eq(currentImage).removeClass('active');
        if (direction === 'right') {
            const isEnd = numImages - 1 === currentImage ? true : false;
            if (isEnd) {
                current = 0;
                images.eq(current).addClass('active')
            } else {
                current += 1;
                images.eq(current).addClass('active')
            }
        } else {
            const isStart = current === 0 ? true : false;
            if (isStart) {
                current = numImages - 1;
                images.eq(current).addClass('active')
            } else {
                current -= 1;
                images.eq(current).addClass('active')
            }
        }
        currentImageView.html(current + 1);
        currentImage = current;
    }

    function togglePlay () {
        setInterval(() => {
            slide('right');
        }, interval * 1000)
    }

    function handleKeyPress (event) {
        if (!gallery.hasClass('slide-view')) return false;
        else {
            const keyCode = event.keyCode;
            if ([37, 39].indexOf(keyCode) !== -1) {
                const direction = keyCode === 37 ? 'left' : 'right';
                slide(direction);
            } else if (keyCode === 27) {
                closeSlideshowView();
            } else return false
        }
    }

    return (() => {
        $(document).keyup(handleKeyPress)
        images.click(openSlideshowView)
        prev.click(slide.bind(null, 'left'))
        next.click(slide.bind(null, 'right'))
        close.click(closeSlideshowView);

        return { openSlideshowView, closeSlideshowView, slide, togglePlay }
    })
}
