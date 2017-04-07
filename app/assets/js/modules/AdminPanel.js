import State from '../helpers/State';
import FullScreenSection from './FullScreenSection';

import EventCalendar from './admin-panel/EventCalendar';

export default function AdminPanel () {
    const
        self  = document.getElementById('Admin-Panel'),
        state = State({
            section: {
                default : 'tasks',
                type    : 'string',
                allowed : ['events', 'tasks', 'files']
            }
        }),

        getSection = event => {
            [...self.querySelectorAll('.active')].forEach(elm => elm.classList.remove('active'));
            const
                target  = typeof event != 'string' ? event.target.id.replace('section-toggle-', '') : event,
                pane    = document.getElementById(`${target}-pane`),
                content = document.getElementById(`${target}-content`);

            [pane, content].forEach(elm => elm.classList.add('active'));

            if (!content.classList.contains('loaded')) {
                switch (target) {
                    case 'events':
                        EventCalendar();
                        break;
//                    case 'tasks':
//                        TasksList();
//                        break;
//                    case 'files':
//                        FileExplorer();
//                        break;
                }
            }

            content.classList.add('loaded');
            state.set('section', target);
        }
//    let



    return (function () {
        const
            selfId   = `#${self.id}`,
            sidebar  = `.${self.id}__sidebar`,
            sidepane = `.${self.id}__sidepane`,
            content  = `.${self.id}__content`;

        FullScreenSection(`${selfId}, ${sidebar}, ${sidepane}, ${content}`);
        getSection(state.get('section'));
    })()
}
