Numbas.queueScript('knockout-handlers',['display-base'],function() {
    function resizeF() {
        var w = $.textMetrics(this).width;
        $(this).width(Math.max(w+30,60)+'px');
    };

    ko.bindingHandlers.horizontalSlideVisible = {
        init: function(element, valueAccessor) {
            var containerWidth = $(element).width();
            ko.utils.domData.set(element,'originalWidth',containerWidth);
            $(element).css({display:'inline-block', 'overflow-x': 'hidden'});

            var buttonWidth = $(element).children().outerWidth();
            $(element).children().css({width:buttonWidth});
        },
        update: function(element, valueAccessor) {
            var value = ko.utils.unwrapObservable(valueAccessor());
            var originalWidth = ko.utils.domData.get(element,'originalWidth');

            $(element).animate({width: value ? originalWidth : 0}, 1000);
        }
    }

    ko.bindingHandlers.niceNumber = {
        update: function(element,valueAccessor) {
            var n = ko.utils.unwrapObservable(valueAccessor());
            $(element).text(Numbas.math.niceNumber(n));
        }
    }

    ko.bindingHandlers.autosize = {
        init: function(element) {
            //resize text inputs to just fit their contents
            $(element).keyup(resizeF).keydown(resizeF).change(resizeF).each(resizeF);
            resizeF.apply(element);
        },
        update: function(element) {
            resizeF.apply(element);
        }
    }

    ko.bindingHandlers.test = {
        update: function(element,valueAccessor) {
            console.log(ko.utils.unwrapObservable(valueAccessor()));
        }
    }
    ko.bindingHandlers.dom = {
        update: function(element,valueAccessor) {
            var html = ko.utils.unwrapObservable(valueAccessor());
            $(element).children().remove();
            $(element).append(html);
        }
    }

    ko.bindingHandlers.slideVisible = {
        init: function(element,valueAccessor) {
            var v = ko.utils.unwrapObservable(valueAccessor());
            $(element).toggle(v);
        },
            
        update: function(element,valueAccessor) {
            var v = ko.utils.unwrapObservable(valueAccessor());
            if(v)
                $(element).stop().slideDown('fast');
            else
                $(element).stop().slideUp('fast');
        }
    }

    ko.bindingHandlers.fadeVisible = {
        init: function(element,valueAccessor) {
            var v = ko.utils.unwrapObservable(valueAccessor());
            $(element).toggle(v);
        },
            
        update: function(element,valueAccessor) {
            var v = ko.utils.unwrapObservable(valueAccessor());
            if(v)
                $(element).stop().fadeIn();
            else
                $(element).stop().fadeOut();
        }
    }

    ko.bindingHandlers.latex = {
        update: function(element,valueAccessor) {
            ko.bindingHandlers.html.update.apply(this,arguments);
            Numbas.display.typeset(element);
        }
    }

    ko.bindingHandlers.maths = {
        update: function(element,valueAccessor) {
            var val = ko.utils.unwrapObservable(valueAccessor());
            $(element).html('<script type="math/tex">'+val+'</script>');
            Numbas.display.typeset(element);
        }
    }

    ko.bindingHandlers.typeset = {
        update: function(element, valueAccessor) {
            ko.utils.unwrapObservable(valueAccessor());
            Numbas.display.typeset(element);
        }
    }

    ko.bindingHandlers.pulse = {
        init: function() {
        },
        update: function(element,valueAccessor) {
            if(valueAccessor()()) {
                $(element).stop(true).animate({opacity:0},200).animate({opacity:1},200);
            }
        }
    };

    ko.bindingHandlers.carousel = {
        update: function() {

        }
    }

    ko.bindingHandlers.hover = {
        init: function(element,valueAccessor) {
            var val = valueAccessor();
            val(false);
            $(element).hover(
                function() {
                    val(true);
                },
                function() {
                    val(false)
                }
            );
        }
    }

    ko.bindingHandlers.realVisible = ko.bindingHandlers.visible;

    ko.bindingHandlers.visible = {
        init: function(element,valueAccessor) {
            $(element).css('display','');
            ko.utils.domData.set(element,'tabindex',$(element).attr('tabindex'));
        },
        update: function(element,valueAccessor) {
            var val = ko.unwrap(valueAccessor());
            $(element).toggleClass('invisible',!val);
            $(element).attr('disabled',!val);
            if(val) {
                $(element).attr('tabindex',ko.utils.domData.get(element,'tabindex'));
            }
            else {
                $(element).removeAttr('tabindex');
            }
        }
    }

    ko.bindingHandlers.visibleIf = {
        init: function(element,valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var val = ko.utils.unwrapObservable(valueAccessor());
            if(val && !ko.utils.domData.get(element,'visible-if-happened')) {
                ko.applyBindingsToDescendants(bindingContext,element);
                ko.utils.domData.set(element,'visible-if-happened',true);
            }
            $(element).toggleClass('invisible',!val);
            return {controlsDescendantBindings: true};
        },
        update:function(element,valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var val = ko.utils.unwrapObservable(valueAccessor());
            if(val && !ko.utils.domData.get(element,'visible-if-happened')) {
                ko.applyBindingsToDescendants(bindingContext,element);
                ko.utils.domData.set(element,'visible-if-happened',true);
            }
            $(element).toggleClass('invisible',!val);
        }
    }

    ko.bindingHandlers.stopbinding = {
        init: function() {
            return {controlsDescendantBindings: true};
        }
    }

});
