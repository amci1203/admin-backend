import $ from 'jquery';
import _ from '../vendor/lodash.min';

export default function FullScreenSection (selector, breakpoint) {
    const section = $(selector.trim())

    function fixHeight () {
        function shouldApply () {

            if (!breakpoint) return true;

            const operator = breakpoint.charAt(0),
                  size     = breakpoint.substr(1);

            if (operator == '<' && window.innerWidth < size ) return true;
            if (operator == '>' && window.innerWidth > size ) return true;

            return false;
        }
        if ( shouldApply() ) section.css('min-height', window.innerHeight);
        else section.css('min-height', 1);
    }

    return (() => {
        fixHeight();
        $(window).resize(_.debounce(fixHeight, 200, {leading: false, trailing: true}));

        return { fixHeight }
    })()
}
