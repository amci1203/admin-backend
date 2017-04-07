/*
    arguments

    images       : jQuery Object        (jQuery collection of slides)
    currentImage : Number               (index of currently visible slide)
    direction    : String               (transition style, any string that is not 'slide' will set it to zoom)
    cb           : Function[newCurrent] (callback that passes the new index back to the caller)

*/

import $ from 'jquery';

export default function slide (_images, currentImage, direction, transition, cb) {
    const
        images    = _images instanceof $ ? _images : $(_images),
        zooms     = transition != 'slide',
        interval  = zooms ? 1500 : 500,
        numImages = images.length;
    let
        newCurrent    = '',
        newAnimateCls = '',
        oldAnimateCls = '';
    if (zooms) {
        newAnimateCls = 'zoom-out';
        oldAnimateCls = 'zoom-in';
    }
    if (direction == 'right') {
        if (!zooms) {
            newAnimateCls = 'slide-right-in';
            oldAnimateCls = 'slide-right-out';
        }
        const to = numImages - 1 == currentImage ? 0 : currentImage + 1;
        newCurrent = to;
        images.eq(to).addClass(`active ${newAnimateCls}`)
        images.eq(currentImage).addClass(oldAnimateCls);
    }
    else if (direction == 'left') {
        if (!zooms) {
            newAnimateCls = 'slide-left-in';
            oldAnimateCls = 'slide-left-out';
        }
        const to = currentImage == 0 ? numImages - 1 : currentImage - 1;
        newCurrent = to;
        images.eq(to).addClass(`active ${newAnimateCls}`)
        images.eq(currentImage).addClass(oldAnimateCls);
    }

    setTimeout(() => {
        images.eq(newCurrent).removeClass(newAnimateCls);
        images.eq(currentImage).removeClass(`active ${oldAnimateCls}`);

        cb(newCurrent)
    }, interval)

}
