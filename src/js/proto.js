/**
 * Created by fdimonte on 23/07/15.
 */

var ScrumDown = (function($){

    /**
     * ScrumDown Class definition
     * 
     * @constructor
     */
    function ScrumDown(id,options){

        this._ID = id;
        this.$el = $(id);

        this._blinkLength = 500;
        this._blinking = false;

        this._tickLength = 10;
        this._running = false;

        this._info = {
            elapsedTime: 0,
            repeated: 0
        };
        this._options = {
            log: false,
            startTime: 10000,
            repeat: 1 // set to 0 will repeat infinitely
        };

        if(options){
            options.startTime!=null && (options.startTime = parseTime(options.startTime));
            $.extend(true, this._options, options);
        }

        this._colors = getGradientArray();

        render.call(this);
    }

    /**
     * ScrumDown prototype
     * 
     * @type {{reset: Function, pause: Function, startFrom: Function, start: Function, restart: Function, stop: Function, setStartTime: Function, setRepeat: Function, setLog: Function}}
     */
    ScrumDown.prototype = {

        reset: function(){
            this._info.elapsedTime = 0;
            this._info.repeated = 0;
            updateBar.call(this,0);
        },
        pause: function(){
            log.call(this,'PAUSED AFTER: ',unparseTime(this._info.elapsedTime + (this._options.startTime * this._info.repeated)));
            this._ticker && clearInterval(this._ticker);
            this._ticker = null;
            this._running = false;
        },
        startFrom: function(from,repeat){
            log.call(this,'SET START AT: ',from);
            var time = parseTime(from);
            this.pause();
            this.reset();
            this.setStartTime(time);
            this.setRepeat(Number(repeat));
            this.start();
        },
        start: function(){
            log.call(this,'START AT: ',unparseTime(this._options.startTime-this._info.elapsedTime));
            this.stopBlink();
            if(this._ticker){
                error('Timer already counting down. Call "restart()" instead.');
            }else{
                this._ticker = setInterval(tick.bind(this),this._tickLength);
                this._running = true;
            }
        },
        restart: function(){
            log.call(this,'RESTART: ',this._info.repeated);
            this.pause();
            this.start();
        },
        stop: function(){
            log.call(this,'STOPPED AT: ',unparseTime(this._info.elapsedTime + (this._options.startTime * this._info.repeated)));
            this.stopBlink();
            this.pause();
            this.reset();
        },
        finish: function(){
            log.call(this,'REACHED THE END');
            this.pause();
            this.startBlink();
        },

        startBlink: function(){
            this._blinker = setTimeout(blink.bind(this), this._blinkLength);
        },
        stopBlink: function(){
            this._blinker && clearTimeout(this._blinker);
        },

        setStartTime : function(data) { !this._running && (this._options.startTime = parseTime(data)); },
        setRepeat    : function(data) { !this._running && data === Number(data) && (this._options.repeat = data); },
        setLog       : function(data) { !this._running && data === Boolean(data) && (this._options.log = data); }

    };

    /********************
     *  PRIVATE METHODS
     ********************/

    /*
     * TIMING
     */
    function tick(){
        this._info.elapsedTime += this._tickLength;
        var perc = this._info.elapsedTime / this._options.startTime;
        updateBar.call(this,perc);

        if(this._info.elapsedTime >= this._options.startTime){
            this._info.repeated++;
            if(this._options.repeat==0 || (this._info.repeated<this._options.repeat)){
                this._info.elapsedTime = 0;
                this.restart();
            }else{
                this.finish();
            }
        }
    }

    function blink(){
        var cols = [this._colors[99],'#ffffff'];
        this._blinking = !this._blinking;
        this.$el.css('background-color',cols[Number(this._blinking)]);
        this.startBlink();
    }

    /*
     * ELEMENTS
     */
    function render(){
        if(this.$el.length){
            this.$el.append(getBar());
        }
    }

    function getBar(){
        var $bar = $('<div/>').addClass('sd-bar'),
            $barCont = $('<div/>').addClass('sd-bar-cont'),
            $barFill = $('<div/>').addClass('sd-bar-fill'),
            $barText = $('<span/>').addClass('sd-bar-text');

        return $bar.append($barCont.append($barFill)).append($barText);
    }
    function updateBar(perc){
        perc || (perc=0);
        this.$el.find('.sd-bar-fill').css('width',(100-(perc*100))+'%');
        this.$el.css('background-color',this._colors[Math.round(perc*100)]);

        var time = this._options.startTime - this._info.elapsedTime + 999,
            secs = Math.floor(time / 1000),
            mins = Math.floor(secs / 60),
            timer = '- ' + (mins + ':' + ('00'+(secs - (mins*60))).substr(-2));

        this.$el.find('.sd-bar-text').text(timer);
    }

    function getGradientArray(){
        var canvas = document.createElement('canvas'),
            context = canvas.getContext('2d');

        canvas.width = 100;
        canvas.height = 1;

        var grd = context.createLinearGradient(0, 0, 100, 0);
        grd.addColorStop(0.5, 'green');
        grd.addColorStop(0.85, 'orange');
        grd.addColorStop(1, 'red');
        context.fillStyle = grd;
        context.fillRect(0, 0, 100, 1);

        var colors = [],
            imageData = context.getImageData(0, 0, 100, 1),
            data = imageData.data;

        var x, y, R, G, B,
            imageHeight = 1,
            imageWidth = 100;

        for(y = 0; y < imageHeight; y++) {
            for(x = 0; x < imageWidth; x++) {
                R = ('00' + (data[((imageWidth * y) + x) * 4]).toString(16)).substr(-2);
                G = ('00' + (data[((imageWidth * y) + x) * 4 + 1]).toString(16)).substr(-2);
                B = ('00' + (data[((imageWidth * y) + x) * 4 + 2]).toString(16)).substr(-2);
                colors.push('#'+R+G+B);
            }
        }

        return colors;
    }

    /*
     * LOGGING
     */
    function log(msg,val){
        this._options.log && console.log(msg,val);
    }
    function error(msg){
        console.log('ERROR:',msg);
    }

    /*
     * PARSING
     */
    function parseTime(timeStr){
        if(timeStr===Number(timeStr)) return timeStr;

        var res, reg = /([0-9]{1,2})([hms])/g,
            timeObj = {h:0,m:0,s:0};

        while((res = reg.exec(timeStr)) !== null)
            timeObj[res[2]] = Number(res[1]);

        return (timeObj.s*1000) + (timeObj.m*60*1000) + (timeObj.h*60*60*1000);
    }
    function unparseTime(ms){
        var timeObj = {h:0,m:0,s:0},
            secs = Math.floor(ms / 1000),
            mins = Math.floor(ms / 1000 / 60),
            hours= Math.floor(ms / 1000 / 60 / 60);

        timeObj.h = hours;
        timeObj.m = (mins - (hours*60));
        timeObj.s = (secs - (mins*60));

        var ret='';
        ret += timeObj.h ? timeObj.h+'h' : '';
        ret += timeObj.m ? timeObj.m+'m' : '';
        ret += timeObj.s+'s';
        return ret
    }

    return ScrumDown;

}(jQuery));
