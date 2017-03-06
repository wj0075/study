~function () {
    function on(ele, type, fn) {
        if (/^self/.test(type)) {
            if (!ele[type]) {
                ele[type] = [];
            }
            var a = ele[type];
            for (var i = 0; i < a.length; i++) {
                if (a[i] === fn) return;
            }
            a.push(fn);
        } else {
            if (ele.addEventListener) {
                ele.addEventListener(type, fn, false);
            } else {
                if (!ele[type + 'onEvent']) {
                    ele[type + 'onEvent'] = [];
                    ele.attachEvent('on' + type, function () {
                        run.call(ele)
                    })
                }
                var a = ele[type + 'onEvent'];
                for (var i = 0; i < a.length; i++) {
                    if (a[i] === fn) return
                }
                a.push(fn);
            }
        }
    }

    function off(ele, type, fn) {
        if (/^self/.test(type)) {
            var a = ele[type];
            if (a && a.length) {
                for (var i = 0; i < a.length; i++) {
                    if (a[i] === fn) {
                        a[i] = null;
                        break;
                    }
                }
            }
        } else {
            if (ele.removeEventListener) {
                ele.removeEventListener(type, fn, false);
            } else {
                var a = ele[type + 'onEvent'];
                if (a && a.length) {
                    for (var i = 0; i < a.length; i++) {
                        if (a[i] === fn) {
                            a[i] = null;
                            break;
                        }
                    }

                }
            }
        }
    }

    function run() {
        var e = window.event;

        var a = this[e.type + 'onEvent'];
        if (a && a.length) {
            for (var i = 0; i < a.length; i++) {
                if (typeof a[i] === 'function') {
                    a[i].call(this, e);
                } else {
                    a.splice(i, 1);
                    i--;
                }
            }
        }
    }

    function processThis(fn, context) {
        return function (e) {
            fn.call(context, e);
        }
    }

    function fire(ele, type, e) {
        var a = ele[type];
        if (a && a.length) {
            for (var i = 0; i < a.length; i++) {
                if (typeof a[i] === 'function') {
                    a[i].call(ele, e);
                } else {
                    a.splice(i, 1);
                    i--;
                }
            }
        }
    }
    window.ev = {
        on: on,
        off: off,
        run: run,
        fire: fire,
        processThis: processThis
    }
}();
