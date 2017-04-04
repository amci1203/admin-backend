import $ from 'jquery';

export default function php (file, func, args, cb) {
    const path     = `http://${location.host}/api.php`,
          argsLen  = arguments.length,
          post     = argsLen == 4 ? { file, func, args } : { file, func },
          callback = [...arguments][argsLen - 1];

    $.post(path, post).done(data => callback(data));
}
