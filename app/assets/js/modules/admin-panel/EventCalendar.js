import moment from 'moment';

import string  from '../../helpers/string';
import slide   from '../../helpers/slide';
import php     from '../../helpers/php';
import State   from '../../helpers/State';

export default function EventCalendar () {

    const
        // calendar
        months = [],
        events = {
                singles  : {},
                annually : {},
                weekly   : {
                    'Sun': [], 'Mon': [], 'Tue': [], 'Wed': [],
                    'Thu': [], 'Fri': [], 'Sat': [],
                },
                monthly  : {
                    '01': [], '02': [], '03': [], '04': [], '05': [], '06': [], '07': [],
                    '08': [], '09': [], '10': [], '11': [], '12': [], '13': [], '14': [],
                    '15': [], '16': [], '17': [], '18': [], '19': [], '20': [], '21': [],
                    '22': [], '23': [], '24': [], '25': [], '26': [], '27': [], '28': [],
                    '29': [], '30': [], '31': []
                }
            },
        // IDs
        containerId = 'event-calendar',
        feedId      = 'event-feed',
        detailsId   = 'event-details',
        addBtnId    = 'event-add-btn',
        addFormId   = 'event-add-form',

        // classes to use
        viewClass   = 'active-date',
        dataClass   = 'active-date-value',

        // single instance containers
        container = document.getElementById(containerId),
        eventFeed = document.getElementById(feedId),
        details   = document.getElementById(detailsId),
        addForm   = document.getElementById(addFormId),
        addBtn    = document.getElementById(addBtnId),

        // output elements
        view  = document.getElementsByClassName(viewClass),
        data  = document.getElementsByClassName(dataClass),

        // initial date stuff
        currentDate     = moment(),
        shortDateName   = 'ddd',
        currentYear     = currentDate.format('YYYY'),
        firstDayOfYear  = moment(`${currentYear}-01-01`).format(shortDateName),

        // date functions
        printActiveDay = () => moment(state.get('day')).format('dddd, MMMM D YYYY'),
        getDayOfWeek   = day => moment(day).format(shortDateName),

        // event shorthands
        event     = (type, elm, func) => elm.addEventListener(type, func),
        click     = event.bind(this, 'click'),
        change    = event.bind(this, 'change'),
        clickEach = (list, func) => [...list].forEach(elm => click(elm, func)),

        // element functions
        hide = elm => elm.style.display = 'none',
        show = elm => elm.style.display = '',

        // state
        state = State({
            year: {
                default : +currentYear,
                type    : 'number'
            },
            month: {
                default : currentDate.format('M') - 1,
                type    : 'number'
            },
            day: {
                default : currentDate.format('YYYY-MM-DD'),
                type    : 'string'
            },
            events: {
                default : events,
                type    : 'object'
            }
        });

    function printCalendar (numYears, callback) {
        const
            currentMonth = currentDate.format('MMMM');
        let
            endingDayOfWeek = 0;
        // creates the next and previous buttons to sllide between months
        function createControls () {
            const controls = document.createElement('div');

            controls.classList.add('calendar__controls');
            controls.innerHTML += (`
                <button class='calendar__next caret caret-right'></button>
                <button class='calendar__prev caret caret-left'></button>
            `)

            container.appendChild(controls);

            click(document.querySelector('.calendar__next'), setActiveMonth.bind(null, 'right'))
            click(document.querySelector('.calendar__prev'), setActiveMonth.bind(null, 'left' ))
        }
        // appends a calendar year to the container
        function printYear (year) {
            const
                w = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                m = [
                    'January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'
                ],
                d = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

            for (let i = 0; i < 12; i++) {
                const
                    heading   = `${m[i]} ${year}`,
                    table     = document.createElement('table'),
                    numDays   = d[i],
                    startFrom = endingDayOfWeek ? endingDayOfWeek : firstDayOfYear;
                let
                    head = '',
                    days = '',
                    j;

                let dayOfWeek  = w.indexOf(startFrom) != 6 ? w.indexOf(startFrom) + 1 : 0,
                    fromSunday = dayOfWeek;

                //first month of current year fix
                if (i == 0 && year == currentYear) {
                    dayOfWeek--;
                    fromSunday--;
                }

                if (fromSunday > 0) {
                    days += `<tr>`;
                    for (fromSunday; fromSunday > 0; fromSunday--) {
                        days += '<td class="empty">_</td>';
                    }
                }

                for (j = 0; j < numDays; j++) {
                    // don't wan't to make another row prematurely
                    if ((dayOfWeek == 0 || j == 0) && startFrom == 0) {
                        days += `<tr>`;
                    }

                    const monthDigit = String(i + 1).padLeft(2,0),
                          dayDigit   = String(j + 1).padLeft(2,0),
                          dateString = `${year}-${monthDigit}-${dayDigit}`,
                          weekday    = getDayOfWeek(dateString);

                    days += `<td id='${dateString}' data-weekday='${weekday}'>${j + 1}</td>`;

                    if (dayOfWeek == 6) days += '</tr>';

                    // so the next month can start on right day
                    if (j == (numDays - 1)) {
                        endingDayOfWeek = w[dayOfWeek];
                        let daysLeft = dayOfWeek;
                        while (daysLeft != 6) {
                            //print empty boxes on last week
                            days += '<td class="empty">_</td>';
                            daysLeft++;
                        }
                    }
                    dayOfWeek = dayOfWeek == 6 ? 0 : dayOfWeek + 1;
                }

                table.classList.add('calendar__month');
                table.setAttribute('data-month', m[i]);
                table.setAttribute('data-year', year);

                for (j = 0; j < 7; j++) { head += `<th>${w[j]}</th>` }

                table.innerHTML += `<thead class='calendar__heading'><th colspan='7'>${heading}</th></thead>`;
                table.innerHTML += `<thead>${head}</thead>`;
                table.innerHTML += `<tbody>${days}</tbody>`;

                container.appendChild(table);
                clickEach([...container.querySelectorAll('.calendar__month')], setActiveDate);
            }
        }

        for (let i = 0; i < numYears; i++) {
            printYear( state.get('year') + i );
        }
        createControls();

        // apply state defaults to show active month and day
        document.querySelector(`[data-month='${currentMonth}']`).classList.add('active');
        // push months into array
        months.push(...container.querySelectorAll('.calendar__month'));

        if (typeof callback == 'function') setTimeout(callback, 100);
    }

    // mainly for sliding purposes. DEFINITELY only for sliding purposes
    function setActiveMonth (direction) {
        const month = state.get('month');
        if (month == 0 && direction == 'left' || month == 23 && direction == 'right') {
            return false;
        } else {
            const
                next = document.querySelector('.calendar__next'),
                prev = document.querySelector('.calendar__prev');

            slide(months, state.get('month'), direction, 'slide', newIndex => {
                state.set('month', newIndex);
                const active = state.get('month');
                active == 0  ? hide(prev) : show(prev);
                active == 23 ? hide(next) : show(next);
            })
        }
    }

    // 'e' can be an event or a string in form YYYY-MM-DD (no  leading 0's)
    function setActiveDate (e) {
        document.getElementById(state.get('day')).classList.remove('active')
        const target = e.target;

        if (target) {
            if (!moment(target.id)._isValid) return false;
            target.classList.add('active');
            state.set('day', target.id);
        }
        else if (/\d{4}-\d{2}-\d{2}/.test(e) && moment(e)._isValid) {
            document.getElementById(e).classList.add('active');
            state.set('day', e);
        }
        else throw new Error(`the string "${e}" is not a valid date`)

        // update any views that rely on the active date
        if (view) [...view].forEach( item => item.innerHTML = printActiveDay() );
        // update any input fields that rely on the active date
        if (data) [...data].forEach( item => item.value = state.get('day') );

        showCurrentEvents();
    }

    // Fetches all events
    function getEvents (callback) {
        php('database', 'getEvents', data => {
            const
                arrStart = data.indexOf('['),
                events   = arrStart != -1 ? JSON.parse(data.substring(arrStart)) : false;
            if (data.charAt(0) == '<')  console.log(data.substring(0, arrStart));
            if (events) pushEvents(events, state.get('events'));
        });
    }

    // does the actual pushing--used by getEvents and postEvents since they both push events up into the object.
    function pushEvents (data, events) {
        [...data].forEach(elm => {
            const
                repeats  = elm.repeats,
                hasEvent = date => {
//                    console.log(date);
//                    console.log(repeats);
                    const thisDay  = document.getElementById(date);
                    if (!thisDay.querySelector('.hasEvent')) {
                        thisDay.innerHTML += '<span class="has-event"></span>';
                    }
                };

            let day, startFrom;

            switch (repeats) {
                case 'annually':
                    day = elm.date.substring(5);
                    if (!events.annually[day]) {
                        events.annually[day] = [elm];
                        hasEvent(`${currentYear}-${day}`);
                    }
                    else {
                        events.annually[day].push(elm);
                    }
                    break;

                case 'monthly':
                    day = elm.date.substr(-2);
                    startFrom = elm.date.substring(0,5) == currentYear ? moment(elm.date).format('M') : 1
                    for (let i = startFrom; i < 12; i++) {
                        let fStr = `${currentYear}-${String(i).padLeft(2,0)}-${day}`;
                        if (i == 2 && day > 28 && currentYear % 4 != 0) {
                            fStr = fStr.replace(fStr.slice(-2), '28');
//                            console.log('Handling dumbass February: %s', fStr);
                        }
                        hasEvent(fStr);
                    }
                    events.monthly[day].push(elm)
                    break;

                case 'weekly':
                    day = getDayOfWeek(elm.date);
                    const theseDays = container.querySelectorAll('[data-weekday="${day}"]');
                    startFrom = Number(elm.date.replaceAll('-', ''));
                    [...theseDays].forEach(_this => {
                        const date = Number(_this.id.replaceAll('-', ''));
                        if (date > startFrom) hasEvent(_this.id)
                    })

                    events.weekly[day].push(elm)
                    break;

                default:
                    if (!events.singles.hasOwnProperty(elm.date)) {
                        events.singles[elm.date] = [elm];
                        hasEvent(elm.date);
                    }
                    else events.singles[elm.date].push(elm);
            }
        })

        state.set('events', events);

        if (typeof callback == 'function') callback();
    }

    function postEvent () {
        const
            post     = {},
            formData = addForm.querySelectorAll('input, select');
        formData.forEach(field => {
            const
                name = field.getAttribute('name'),
                val  = field.value;

            post[name] = val;
        })
    }

    // Shows today's (TODO: and upcoming) events
    function showCurrentEvents () {
        // remove current elements and listeners
        [...eventFeed.children].forEach(elm => elm = null);
        let html = '';

        const events   = state.get('events'),
              date     = state.get('day'),
              today    = events.singles[date],
              weekly   = events.weekly[getDayOfWeek(date)],
              monthly  = events.monthly[date.substring(5,7)],
              annually = events.annually[date.substring(5)],
              listItem = (type, label, i) => (`<li class='event-list-item' data-index='${type}-${i}'>${label}</li>`);

        console.log({ today, weekly, monthly, annually })

        if (today) today.forEach((event, i) => html += listItem('singles', event.name, i));
        if (annually) annually.forEach((event, i) => html += listItem('annually', event.name, i));
        if (weekly) weekly.forEach((event, i) => html += listItem('weekly', event.name, i));
        if (monthly) monthly.forEach((event, i) => html += listItem('monthly', event.name, i));

        eventFeed.innerHTML = html;
        clickEach([...eventFeed.getElementsByClassName('event-list-item')], getEventDetails, {capture: true})
    }

    function getEventDetails (e) {
        const
            target = e.target,
            events = state.get('events'),
            data   = target.getAttribute('data-index').split('-'),
            type   = data[0],
            index  = +data[1];
        let
            nest = '';

        switch (type) {
            case 'annually':
                nest = state.get('day').substring(5);
                break;

            case 'monthly':
                nest = moment(state.get('day')).format('DD');
                break;

            case 'weekly':
                nest = getDayOfWeek(state.get('day'));
                break;

            default:
                nest = null;
        }

        const show = nest ? events[type][nest][index] : events.singles[state.get('day')][index];

        (function (event) {
            let d = '';
            const
                name  = event.name,
                start = event.time_start ? `Starts @ ${event.time_start}` : '',
                end   = event.time_end ? `Ends @ ${event.time_end}` : '',
                desc  = event.description || '(No Description)';

            d = (`
                <h3 class='event-details__title'>${name}</h3>
                <p class='event-details__time-start'>${start}</p>
                <p class='event-details__time-end'>${end}</p>
                <p class='event-details__description'>${desc}</p>
            `);

            if (event.is_paid_event) {
                const
                    ticket = event.price_ticket,
                    door   = event.price_door;

                d += (`
                    <br />
                    <p class='event-details__price-ticket'>${ticket}</p>
                    <p class='event-details__price-door'>${door}</p>
                `);
            }

            details.innerHTML = d;
        })(show)
    }

    return (callback => {
        if (container) {
            container.classList.add('calendar');
            //funception
            printCalendar(2, getEvents.bind(this, setActiveDate.bind(this, state.get('day')) ));
            ;
            if (addBtn && addForm) click(addBtn, postEvent)
        }
        else {
            console.log(`element with id "${containerId}" not found`)
            return false;
        }

        if (typeof callback == 'function') callback()
    })()
}
