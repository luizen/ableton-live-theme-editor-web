// Written by Hakan Bilgin
// Changed by Luiz Zen to being able to all nob.init() manually.

// (function(window, document) {
    
//     'use strict';
    
    var nob = {
        el: false,
        clickY: 0,
        clickX: 0,
        init: function() {
            var nobs = document.getElementsByClassName('nob');
            for (var i=0, cvs; cvs=nobs[i]; i++) {
                cvs.height = cvs.width * 0.9;
                nob.draw(cvs, true);
                cvs.addEventListener('mousedown', nob.doEvent, true);
                cvs.addEventListener('selectstart', nob.doEvent, false);
            }
            window.addEventListener('mousemove', nob.doEvent, true);
            window.addEventListener('mouseup', nob.doEvent, true);
        },
        doEvent: function(event) {
            var _nob = nob,
                bodyStyle = document.body.style;
            switch (event.type) {
                case 'selectstart':
                    event.preventDefault();
                    event.stopPropagation();
                    return false;
                case 'mousedown':
                    _nob.el = event.target || event.srcElement;
                    _nob.clickY = event.clientY;
                    _nob.clickX = event.clientX;
                    _nob.orgValue = _nob.el.getAttribute('data-value');
                    bodyStyle.cursor = 'none';
                    event.preventDefault();
                    break;
                case 'mousemove':
                    if (!_nob.el) return;
                    _nob.el.setAttribute('data-value', (Math.min(Math.max(_nob.clickY-event.clientY + (_nob.orgValue - 50), -50), 50) + 50));
                    _nob.draw( _nob.el );
                    break;
                case 'mouseup':
                    if (!_nob.el) return;
                    _nob.el = false;
                    bodyStyle.cursor = '';
                    break;
            }
        },
        draw: function(cvs, isInit) {
            var ctx  = cvs.getContext('2d'),
                d = cvs.width,
                lw = d * 0.1,
                r = d/2,
                radius = r - lw,
                val = cvs.getAttribute('data-value'),
                deg = (Math.min(Math.max(val/100, 0), 1) * 1.5) + 0.75,
                startAngle = 0.745 * Math.PI,
                midAngle = deg * Math.PI,
                endAngle = 0.251 * Math.PI;
                
            // Clear canvas and defaults
            ctx.clearRect(0, 0, d, d);
            ctx.strokeStyle = '#F90';
            ctx.lineWidth = lw;
            ctx.lineCap = 'round';
            
            // Orange line
            if (val > 0) {
                ctx.beginPath();
                ctx.arc(r, r, radius, startAngle, midAngle, false);
                ctx.stroke();
            }

            // Gray line
            ctx.strokeStyle = '#888';
            ctx.beginPath();
            ctx.moveTo(r, r);
            ctx.arc(r, r, radius, midAngle, endAngle, false);
            ctx.stroke();

            // 
            if (isInit) return;
            var onchange = cvs.getAttribute('data-change'),
                parts, fn;
            if (onchange) {
                if (cvs.fnStr !== onchange) {
                    parts = onchange.slice(0,onchange.indexOf('(')).split('.');
                    fn = window;
                    for (var i=0, il=parts.length-1; i<il; i++) {
                        if (!fn[parts[i]]) return;
                        if (parts[i].indexOf('(') > -1) break;
                        fn = fn[parts[i]];
                    }
                    cvs.fnStr = onchange;
                    cvs.fnObj = fn;
                    cvs.fn = fn[parts[i]];
                }
                cvs.fn.call(cvs.fnObj, val);
            }
        }
    };
    
    // console.log('Initing knobs...');
    // nob.init();
    // console.log('Initialized knobs...');

// })(window, document);
