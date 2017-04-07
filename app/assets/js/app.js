import $ from 'jquery';

import php   from './helpers/php';
import State from './helpers/State';

import Injector          from './modules/Injector';
import Slides            from './modules/Slides';
import AdminPanel        from './modules/AdminPanel';
import FullScreenSection from './modules/FullScreenSection';

$(document).ready( Injector.bind(window, 'sections', 'html', init) )

function init () {

    AdminPanel()

}
