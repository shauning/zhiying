(function($,undefined){
    $.Slide = function(options,element){
        this.$el = $(element) ;   // the div or ul which to be slided
        this._init(options);

    };

    $.Slide.defaults ={
        prev : null,        // the prev element
        next: null,         // the next element
        s_num : 1,           // the num
        isListUl : true,     // is ul or others
        slide_item : "li",    // the element in the slide_lis
        current: 0,            // index of current item
        c_num: 1,               // num of li in visual
        isAnimate:true,
        time:5000,
        animateTime: 500
    };
    $.Slide.prototype = {
        _init  :function(options){
            this.options = $.extend(true,{}, $.Slide.defaults,options);

            this.$s_li = this.$el.find(this.options.slide_item);

            this.$s_len = parseInt(this.$s_li.length);

            this.$s_max = Math.ceil(this.$s_len/this.options.s_num * Math.pow(10,0)) / Math.pow(10,0)-1;

            this.$move = this.$s_li.outerWidth(true)  ;

            this.$prev = this.$el.find(this.options.prev);
            this.$next = this.$el.find(this.options.next);

            this.$el = this.$el.find("ul");
            this.$el.css('width',this.$move * this.$s_len);

            this.current = this.options.current;
            this._slideEvents();

            if(this.options.isAnimate){
                this._animateEvents();
            }

        },
        _slideEvents: function(){
            var _self = this;

            this.$next.click(function(event){
                var last_px ;
                if(_self.options.isAnimate){
                    clearInterval(_self.flag);
                }
                _self.current+=_self.options.s_num;
                if(_self.current<_self.$s_len - _self.options.c_num ){
                    _self.$prev.removeClass('pre_false');
                    _self.$next.removeClass('next_false');
                }else{
                    _self.current = _self.$s_len - _self.options.c_num ;  
                    _self.$prev.removeClass('pre_false'); 
                    _self.$next.addClass('next_false');  
                }

                last_px = -(_self.$move * _self.current);
                _self.$el.animate({left:last_px + 'px'}, 'slow');

                if(_self.options.isAnimate){
                    _self._animateEvents();
                }
				console.log(_self.current);
                event.preventDefault();
                return false;
            });

            this.$prev.click(function(event){
                var last_px ;
                if(_self.options.isAnimate){
                    clearInterval(_self.flag);
                }
                _self.current-=_self.options.s_num;
                if(_self.current>0){
                    _self.$prev.removeClass('pre_false');
                    _self.$next.removeClass('next_false');
                }else{
                    _self.current = 0;
                    _self.$prev.addClass('pre_false');
                    _self.$next.addClass('next_false');
                }

                last_px = -(_self.$move * _self.current);
                _self.$el.animate({left:last_px + 'px'}, 'slow');
                if(_self.options.isAnimate){
                    _self._animateEvents();
                }
                event.preventDefault();
                return false;
            });
        },
        _animateEvents:function(){
            var _self = this;
             this.flag = setInterval(function(){
                 _self.$el.stop().animate({ "left": -1*_self.$move
                 }, _self.options.animateTime,function(){
                     var temp = _self.$s_li[_self.current];
                     console.log(_self.current);
                     _self.current++;
                     if(_self.current==_self.$s_len){
                         _self.current = 0;
                     }
                     _self.$el.append(temp); //重新拼装内容
                     _self.$el.css("left", 0); //初始化left
                 });
             },parseInt(this.options.time));
        }

    };
    var logError 			= function( message ) {
        if ( this.console ) {
            console.error( message );
        }
    };

    $.fn.slide = function(options){
        if ( typeof options === 'string' ) {

            var args = Array.prototype.slice.call( arguments, 1 );

            this.each(function() {

                var instance = $.data( this, 'slide' );

                if ( !instance ) {
                    logError( "cannot call methods on gallery prior to initialization; " +
                        "attempted to call method '" + options + "'" );
                    return;
                }

                if ( !$.isFunction( instance[options] ) || options.charAt(0) === "_" ) {
                    logError( "no such method '" + options + "' for gallery instance" );
                    return;
                }

                instance[ options ].apply( instance, args );

            });

        }
        else {

            this.each(function() {

                var instance = $.data( this, 'slide' );
                if ( !instance ) {
                    $.data( this, 'slide', new $.Slide( options, this ) );
                }
            });

        }

        return this;
    };
})(jQuery);