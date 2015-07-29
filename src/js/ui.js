/**
 * Created by fdimonte on 24/07/15.
 */

var ScrumDownUI = (function($){

    function ScrumDownUI(scrumdownInstance){

        if(!scrumdownInstance || !(scrumdownInstance instanceof ScrumDown))
            throw new Error('No ScrumDown instance provided!');

        this._SD = scrumdownInstance;
        this.$el = $(this._SD._ID);

        render.call(this);
        setEvents.call(this);
    }

    ScrumDownUI.prototype = {};

    /********************
     *  PRIVATE METHODS
     ********************/

    /*
     * EVENTS
     */
    function setEvents(){
        $('body').on('keydown',keyHandler.bind(this));
        $(this._SD._ID).find('.sd-controls').on('click','button',controlsHandler.bind(this));
    }
    
    function keyHandler(e){

        switch(e.keyCode){
            case 32://SPACE
                e.preventDefault();
                if(this._SD._running) this._SD.pause();
                else this._SD.start();
                break;

            case 13://RETURN
                e.preventDefault();
                this._SD.startFrom(this.$el.find('.sd-control-input').val());
                break;

            case 27://ESC
                e.preventDefault();
                this._SD.stop();
                break;
        }
        
    }
    
    function controlsHandler(e){
        
        switch($(e.currentTarget).data('action')){
            case 'play':
                this._SD.startFrom(this.$el.find('.sd-control-input').val());
                break;

            case 'pause':
                this._SD.pause();
                break;

            case 'stop':
                this._SD.stop();
                break;
        }
        
    }

    /*
     * ELEMENTS
     */
    function render(){
        var $buttons = $('<div/>').addClass('sd-controls');
        
        $buttons
            .append($('<input/>').attr('type','text').val('4m').addClass('sd-control-input'))
            .append($('<button/>').data('action','play').addClass('sd-control-play').append($('<span/>').text('PLAY')))
            .append($('<button/>').data('action','pause').addClass('sd-control-pause').append($('<span/>').text('PAUSE')))
            .append($('<button/>').data('action','stop').addClass('sd-control-stop').append($('<span/>').text('STOP')));
        
        this.$el.append($buttons);
    }

    return ScrumDownUI;
    
}(jQuery));
