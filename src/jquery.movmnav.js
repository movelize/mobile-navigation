/**
 * Movelize Mobile - Offcanvas Navigation with CSS3 Transitions
 * http://movelize.com/mobile-navigation
 * Copyright (c) 2017 Johann Kratzik
 * Version 1.0.0
 * License: GPL-3.0 (https://www.gnu.org/licenses/gpl-3.0.html)
*/


;(function($, $win) {
    'use strict';

    /* Constructor function
       ========================================================================== */
    function MovMnav(link, options) {
        this.options = options;
        this.$currentLink = link;
        this.$rootBody = $('body');

        this.init();
	}

    MovMnav.prototype = {
        init: function() {
            this.initNavLinkEvents();
        },

        /* Function to init nav opener events, generate nav block and page layout
       	   ========================================================================== */
        initNavLinkEvents: function() {
            var self = this;

            this.$currentLink.on('click', function(e) {
                e.preventDefault();
				
                self.initPageLayout();
                self.generateNavBlock();

                setTimeout(function() {
                    self.$rootBody.addClass('movmnav--opened');
                }, 10);
            });
        },

        /* Generate page wrapper and content
       	   ========================================================================== */
        initPageLayout: function() {
            this.$outerWrap = $('<div class="movmnav__outer"></div>');
            this.$innerWrap = $('<div class="movmnav__inner"></div>');
            this.$innerWrap.append(this.$rootBody.contents());
            this.$outerWrap.append(this.$innerWrap);
            this.$rootBody.append(this.$outerWrap);
            this.initOverlay();
        },

        /* Init overlay that is shown when nav is opened and add events
       	   ========================================================================== */
        initOverlay: function() {
            var self = this;

            this.pageOverlay = $('<div class="movmnav__overlay">');
            this.pageOverlay.on('click', function(e) {
                self.destroy();
            });

            this.$innerWrap.append(this.pageOverlay);
        },

        /* Generate nav block
       	   ========================================================================== */
        generateNavBlock: function() {
            var self = this;
			
            this.$mainNavContent = $('<nav class="movmnav__mainnav"></nav>');
            this.$mainNav = $('<ul>');
			
            /** Add classes to the <body> */
            self.$rootBody.addClass('movmnav movmnav--open-' + self.options.navOpen);
			
            /** Nav header */
            this.$navHeader = $('<header class="movmnav__header"></header>');
			
            /** Nav closer */
            this.$navCloser = $('<span class="movmnav__close"></span>');
            this.$navCloser.on('click', function(e) {
                self.destroy();
            });
			
            /** Get all cloned blocks passed into the plugin, convert them to an array, loop through them and generate the navigation */
            this.navBlocksClone = this.convertIntoArray(this.options.navAdd);
            this.navBlocksClone.forEach(function(item) {
                var navHolderClone = $(item).clone();
                self.setNavLinksFromClone(navHolderClone.contents());
            });
			
            /** Call the customize function to add submenu and close button functionality */
            this.customizeNavBlock();
			
            /** Add the generated nav components to the main nav block and the main nav block to the outer wrap */
            this.$mainNavContent
                .prepend(this.$navHeader)
                .append(this.$mainNav);
            this.$outerWrap.prepend(this.$mainNavContent);
				
            /** Add the title and closer to the header */
            this.$navHeader.append(this.$navCloser);
        
        },

        /* Function to convert comma separated values to array
       	   ========================================================================== */
        convertIntoArray: function(objInput) {
            if (typeof objInput === 'string') {
                var newarray = $.map(objInput.split(','), $.trim);
                return newarray;
            }

            return objInput;
        },
		
        /* Append the list items to the generated main nav
       	   ========================================================================== */
        setNavLinksFromClone: function($listItem) {
            this.$mainNav.append($listItem);
        },

        /* Customize the generated nav block
       	   ========================================================================== */
        customizeNavBlock: function() {
            var self = this;

            /** Find all the nav items that have sub navigations */
            var navLinks = this.$mainNav.find('li:has("ul")');

            navLinks.each(function() {

                var item = $(this);
                var itemLink = item.find("> a");
                var holderUl = item.find('ul').eq(0);
				
                /** Back links */
                var backText = itemLink.text();
				
                /** The main holder of the submenu */
                var holder = $('<div>');
                holder.addClass('movmnav__subnav');
				
                /** Generate the back button to return to parent menu */
                var holderLink = $('<span class="movmnav__back"></span>');
                holderLink.text(backText);
                holderLink.on('click', function(e){
                    e.preventDefault();
                    holder.removeClass('movmnav__subnav--active');
                });

                /** Generate a <span> to go to next level submenu */
                var spanLink = $('<span class="movmnav__next"></span>');
				
                /** Bind a click envent to add a class to the parent list item */
                spanLink.on('click', function(e) {
                    e.preventDefault();
                    if (! holder.hasClass('movmnav__subnav--active')) {
                        holder.addClass('movmnav__subnav--active');
                    }
                });
				
                /** Append the <span> to the list item */
                itemLink.append(spanLink);

                /** Append the generated subnavigation to the list item */
                holder.append(holderLink).append(holderUl);
                item.append(holder);
            });
						
        },

        /* Destroy all components and take the page back to its initial state
       	   ========================================================================== */
        destroy: function() {
            var self = this;
            var menu = self.$rootBody.find('.movmnav__mainnav');
			
            self.$rootBody.removeClass('movmnav--opened');
		
            /** Revert all DOM modification when the main navigation back transition is completed */
            menu.one('transitionend', function() {
                self.$navCloser.off();
                self.$currentLink.removeData('MovMnav');
                self.pageOverlay.off();
                self.pageOverlay.remove();
                self.$mainNavContent.remove();
                self.$rootBody
                    .removeClass('movmnav movmnav--open-' + self.options.navOpen)
                    .append(self.$innerWrap.contents());
                self.$outerWrap.remove();
            });
        }
    };
	
    /* Register the plugin and define default options
	   ========================================================================== */
    $.fn.movmnav = function(options) {
        options = $.extend({}, {
            navAdd:  '.movmnav__menu',    /** CSS selectors for lists to be added to the mobile navigation */
            navOpen: 'left',              /** Default opening direction */
        }, options);

        return this.each(function() {
            var link = $(this);
            link.data('MovMnav', new MovMnav(link, options));
        });
    };

}(jQuery, jQuery(window)));