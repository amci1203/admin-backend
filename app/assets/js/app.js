import $ from 'jquery';

import php   from './helpers/php';
import State from './helpers/State';

import Injector          from './modules/Injector';
import Slides            from './modules/Slides';
import EventCalendar     from './modules/EventCalendar';
import FullScreenSection from './modules/FullScreenSection';

$(document).ready(Injector.bind(window, 'sections', 'html', init))

function init () {
    FullScreenSection('.Admin-Panel > *')
    const
        panels   = ['calendar', 'tasks', 'files'],
        calendar = EventCalendar('calendar', '.active-date'),

        state = State({
            panel: {
                type: 'string',
                default: 'calendar',
                allowed: ['calendar', 'tasks', 'files']
            }
        });

    function switchPanels (panel) {
        let current = state.get('panel');
        const target = panel.target; // check if event
        if (target) {
            const togglePrefix = 'section-toggle-'.length - 1,
                  section      = target.id.substring(togglePrefix)
        }
        else {
            const validPanel = state.isValidValue('panel', panel);
            if (validPanel) {
                current = panel;
            }
        }

        state.set('panel', current)
    }


}
