$(document).ready(function() {
    //-------------------------
    //  Toggle menu
    //---------------------
    var triggerBtn = $('.menu-toggle'),
        overlay = $('.fullscreen-container');

    triggerBtn.on('click', function() {
        $('html,body').toggleClass('disable-scroll');
        $(this).toggleClass('close');
        overlay.toggleClass('open');
    });


    //-------------------------
    //  Search
    //---------------------
    var searchBox = $('#head-search'),
        searchToggle = $(".search-toggle"),
        searchInput = $('#head-search-input');

    searchToggle.bind("click", function(e) {

        if (searchBox.hasClass('is-opened')) {
            searchToggle.html(searchToggle.data('on'));
        } else {
            searchToggle.html(searchToggle.data('off'));
            searchInput.focus();
        }

        searchBox.cssAnimateAuto();

    });


    //-------------------------
    //  Target Global Event
    //      - Keyup
    //---------------------
    $(document).keyup(function(e) {

        //-------------------------
        //  On 'ESC' keyup.
        //  Escape key maps to keycode `27`
        //---------------------
        if (e.keyCode === 27) {
            // Hide Searchbox.
            if (searchBox.hasClass('is-opened')) {
                searchBox.cssAnimateAuto();
            }
            if (overlay.hasClass('open')) {
                overlay.removeClass('open');
                triggerBtn.toggleClass('close');
            }
        }
    });

    //-------------------------
    //  Submenu
    //---------------------
    var toggleSubmenu = $('.submenu-toggle');

    toggleSubmenu.on('click', function() {
        var $this = $(this);


        $this.parent().toggleClass('active');
        //$this.siblings('ul').cssAnimateAuto();
    });


});
