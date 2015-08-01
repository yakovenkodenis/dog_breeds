# =======================
# ===== Header Anim =====
# ======================= 

didScroll = undefined
lastScrollTop = 0
delta = 5
navbarHeight = $('header').outerHeight()

hasScrolled =  -> 
    st = $(@).scrollTop()

    if Math.abs(lastScrollTop - st) <= delta then return

    if st > lastScrollTop and st > navbarHeight
        $('header').removeClass('nav-down').addClass 'nav-up'
    else
        if st + $(window).height() < $(document).height()
            $('header').removeClass('nav-up').addClass 'nav-down'

    lastScrollTop = st
    return

$(window).scroll (event) ->
    didScroll = true
    return

setInterval (->
    if didScroll
        hasScrolled()
        didScroll = false
    return
), 250


# =======================
# ==== Smooth Scroll ====
# =======================

# $ -> 
#     $('a[href*=#]:not([href=#])').click ->
#         if location.pathname.replace(/^\//, '') == @pathname.replace(/^\//, '') and location.hostname == @hostname
#             target = $(@hash)
#             target = if target.length then target else $('[name=' + @hash.slice(1) + ']')
#             if target.length
#                 $('html, body').animate { scrollTop: target.offset().top }, 1000
#                 return false
#         return
#     return