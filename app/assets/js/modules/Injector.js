import $ from 'jquery';

export default function Injector (rootFolder, defaultExt, callback) {
    function findView (elm) {
        const
            path  = elm.getAttribute('data-view'),
            nest  = elm.getAttribute('data-root'),
            child = path.split('/'),
            root  = nest ? nest.split('/') : [rootFolder],
            ext   = defaultExt || 'html';

        if (path.charAt(0) == '/') {
            const abs = path.substr(path.lastIndexOf('.')) == ext ? path : `${path}.${ext}`;
            return abs;
        };

        const
            directoriesUp = child.filter(str => str == '..').length,
            inViewsFolder = (root.length - directoriesUp) > 0;

        if (!inViewsFolder && childPath[0] != '') {
            console.error('All views/partials should be in the "views" folder. Use an absolute path to use files above "views"');
            return false;
        }
        else {
            const
                realRoot  = directoriesUp == 0 ? root : root.slice(0, (directoriesUp * -1)),
                realChild = child.filter(str => str != '..'),

                view = [...realRoot, ...realChild].join('/'),
                rel  = view.substr(-5) == ext ? view : `${view}.${ext}`;

            return rel;
        }
    }

    function fetchPartials () {
        const partials    = $('._partial'),
              hasPartials = partials.length;

        if (hasPartials) {
            let i;
            for (i = 0; i < hasPartials; i++) {
                const partial = partials.get(i),
                      view    = findView(partial),
                      isLast  = i == hasPartials - 1;
                get(partial, view, isLast);
            }
        }
        else setTimeout(callback, 200);
    }

    function get (elm, path, isLast) {
        $.get(path)
            .fail((jqXHR, text) => jqXHR.status == 404 ? $(elm).remove() : console.error(text))
            .done(data => {
                $(elm).html(data);
                $(elm).find('._partial').attr('data-root', path.split('/').slice(0, -1).join('/'));
                $(elm).children().unwrap();

                if (isLast) fetchPartials()
            })
    }

    return (fetchPartials())
}
