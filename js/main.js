var liveSkinEditor = {
    init: function () {

        //this.identifyContainers();

        // After all external elements are loaded, init the knobs
        $(".al-channel").load("channel-strip.html", function () {
            $(".al-device").load("device.html", function () {
                nob.init();
            });
        });

        this.setupSkinControls();
    },

    setupSkinControls: function () {
        // Get the skin control inputs
        const inputs = [].slice.call(document.querySelectorAll('#skin-controls input'));

        // Listen for changes
        inputs.forEach(input => input.addEventListener('change', this.handleUpdate));

        $("input[type='range']").each(function(e) { 
            this.min = 0;
            this.max = 100;
            this.step = 0.01;
            this.value = 100;
            this.title = "Opacity";
        });
    },

    handleUpdate: function (e) {
        // append 'px' to the end of spacing and blur variables
        var styleName = this.dataset.styleName;
        var settingType = this.dataset.settingType;
        const suffix = (settingType === 'color' || settingType === 'opacity' ? '' : 'px');
        var newValue = this.value;
        var currentValue = document.documentElement.style.getPropertyValue(styleName);
        
        if (currentValue === "" || currentValue === null || currentValue === 'undefined')
            currentValue = this.dataset.initialValue;

        if (settingType === 'opacity') {
            var alpha = parseFloat(newValue) / 100;
            if (currentValue.slice(0, 4) === 'rgba')
                newValue = liveSkinEditor.replaceAlphaInRgba(currentValue, alpha)
            else
                newValue = liveSkinEditor.hexToRGBA(currentValue, alpha);
        }            

        // document.documentElement.style.setProperty(`--${this.id}`, this.value + suffix);
        document.documentElement.style.setProperty(`${styleName}`, newValue + suffix);
    },

    identifyContainers: function () {
        $("div").each(function (index) {
            var elementId = $(this).prop('id');
            if (elementId)
                $(this).prepend("ID = " + elementId);
            else {
                var elementClass = $(this).prop('class');
                if (elementClass)
                    $(this).prepend("Class = " + elementClass);
            }
        });

    },

    hexToRGBA : function (hex, alpha) {
        var r = parseInt(hex.slice(1, 3), 16),
            g = parseInt(hex.slice(3, 5), 16),
            b = parseInt(hex.slice(5, 7), 16);
    
        if (alpha) {
            return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
        } else {
            return "rgb(" + r + ", " + g + ", " + b + ")";
        }
    },

    replaceAlphaInRgba : function (rgbaValue, alpha) {
        var res = rgbaValue.replace('rgba', '');
        res = res.replace('(', '');
        res = res.replace(')', '');
        var parts = res.split(',');

        var r = parseInt(parts[0]),
        g = parseInt(parts[1]),
        b = parseInt(parts[2]);

        return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
    }    
    
    
};