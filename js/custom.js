// JavaScript Document

$(window).load(function () {
    "use strict";
    // makes sure the whole site is loaded
    $('#status').fadeOut(); // will first fade out the loading animation
    $('#preloader').delay(350).fadeOut('slow'); // will fade out the white DIV that covers the website.
    $('body').delay(350).css({
        'overflow': 'visible'
    });
})

$(document).ready(function () {
    "use strict";

    // scroll menu
    var sections = $('.section'),
        nav = $('.navbar-fixed-top,footer'),
        nav_height = nav.outerHeight();

    $(window).on('scroll', function () {
        var cur_pos = $(this).scrollTop();

        sections.each(function () {
            var top = $(this).offset().top - nav_height,
                bottom = top + $(this).outerHeight();

            if (cur_pos >= top && cur_pos <= bottom) {
                nav.find('a').removeClass('active');
                sections.removeClass('active');

                $(this).addClass('active');
                nav.find('a[href="#' + $(this).attr('id') + '"]').addClass('active');
            }
        });
    });

    nav.find('a').not('.lang-btn').on('click', function () {
        var $el = $(this),
            id = $el.attr('href');

        $('html, body').animate({
            scrollTop: $(id).offset().top - nav_height + 2
        }, 600);

        return false;
    });


    // Menu opacity
    if ($(window).scrollTop() > 80) {
        $(".navbar-fixed-top").addClass("bg-nav");
    } else {
        $(".navbar-fixed-top").removeClass("bg-nav");
    }
    $(window).scroll(function () {
        if ($(window).scrollTop() > 80) {
            $(".navbar-fixed-top").addClass("bg-nav");
        } else {
            $(".navbar-fixed-top").removeClass("bg-nav");
        }
    });



    // Parallax
    var parallax = function () {
        $(window).stellar();
    };

    $(function () {
        parallax();
    });

    // AOS
    AOS.init({
        duration: 1200,
        once: true,
        disable: 'mobile'
    });

    //  isotope
    $('#projects').waitForImages(function () {
        var $container = $('.portfolio_container');
        $container.isotope({
            filter: '*',
        });

        $('.portfolio_filter a').click(function () {
            $('.portfolio_filter .active').removeClass('active');
            $(this).addClass('active');

            var selector = $(this).attr('data-filter');
            $container.isotope({
                filter: selector,
                animationOptions: {
                    duration: 500,
                    animationEngine: "jquery"
                }
            });
            return false;
        });

    });

    //animatedModal
    $.each(PROJECT_TRIGGERS, function (trigger, target) {
        $(trigger).animatedModal({ modalTarget: target });
    });

    // Contact Form
    // CONTACT_MODE : 'formsubmit' (fonctionne sur tout hébergement, y compris GitHub Pages)
    //                'php'        (utilise process.php, nécessite un serveur PHP avec mail())
    var CONTACT_MODE = 'formsubmit';
    var CONTACT_EMAIL = 'hajarkhindouf001@gmail.com';

    function L() { return I18N[$('html').attr('lang')] || I18N.fr; }
    function sendForm(form, done, fail) {
        var data = {
            name: $.trim(form.name.value), email: $.trim(form.email.value),
            phone: $.trim(form.phone.value), message: $.trim(form.message.value),
            _honey: form._honey ? form._honey.value : ''
        };
        if (data._honey) { done(); return; } // anti-spam : un robot a rempli le champ caché
        if (CONTACT_MODE === 'php') {
            $.ajax({ type: 'POST', url: 'process.php', data: data, dataType: 'json' })
                .done(function (r) { (r && r.ok) ? done() : fail(); }).fail(fail);
        } else {
            data._subject = 'Portfolio – nouveau message de ' + data.name;
            data._template = 'table';
            data._captcha = 'false';
            $.ajax({
                type: 'POST', url: 'https://formsubmit.co/ajax/' + CONTACT_EMAIL,
                data: JSON.stringify(data), contentType: 'application/json', dataType: 'json',
                headers: { 'Accept': 'application/json' }
            }).done(function (r) { (r && (r.success === true || r.success === 'true')) ? done() : fail(); }).fail(fail);
        }
    }

    $(function () {
        function msg(key) { return function () { return L()[key]; }; }
        $('#contact-form').validate({
            rules: {
                name: { required: true, minlength: 2 },
                email: { required: true, email: true },
                phone: { required: false },
                message: { required: true, minlength: 5 }
            },
            messages: {
                name: { required: msg('v_req'), minlength: msg('v_name') },
                email: { required: msg('v_req'), email: msg('v_email') },
                message: { required: msg('v_req'), minlength: msg('v_req') }
            },
            submitHandler: function (form) {
                var $btn = $('#submit');
                $('#success, #error').hide();
                $btn.prop('disabled', true).text(L().btn_sending);
                sendForm(form, function () {
                    $btn.prop('disabled', false).text(L().btn_send);
                    form.reset();
                    $('#success').fadeIn();
                }, function () {
                    $btn.prop('disabled', false).text(L().btn_send);
                    $('#error').fadeIn();
                });
                return false;
            }
        });
    });
});
