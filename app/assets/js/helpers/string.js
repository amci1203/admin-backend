String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

String.prototype.padLeft    = function (targetLength, padString) {
    if (this.length >= targetLength) return this;
    else {
        if (['number', 'string'].indexOf(typeof(padString)) !== -1) {
            const pad  = String(padString);
            let target = this.split('*');
            while (target.length < targetLength) {
                target.unshift(pad);
            }
            return target.join('');
        } else {
            throw new Error('Err: padString is not a number or string');
        }
    }
}

String.prototype.replaceAll = function (toReplace, replaceWith) {
    if (typeof(toReplace) == 'string' && typeof(replaceWith) == 'string') {
        let string = this.split('');
        string.forEach((char, index) => {
            if (char == '-') string[index] = replaceWith;
        })
        return string.join('');
    } else {
        throw new Error('both args should be a string.')
    }
}

String.prototype.maskSubstr = function (startIndex, stopIndex, maskChar) {
    if (typeof(startIndex) != 'number' || typeof(stopIndex) != 'number') {
        throw new Error('start/stop indexes must be a number');
    }
    if (typeof(maskChar) != 'string' || maskChar.length != 1) {
        throw new Error('mask character must be a string of length (1)');
    }
    const startAt = startIndex >= 0 ? startIndex : this.length + startIndex,
          stopAt  = stopIndex  >= 0 ? stopIndex  : this.length + stopIndex;
    let string = this.split(''),
        i;
    for (i = startAt; i < stopAt; i++) {
        string[i] = maskChar;
    }
    return string.join('');
}
