function toggleMenu() {
    var menu = document.getElementById('dropdown-menu');
    if (menu.style.display === "block") {
        menu.style.display = "none";
    } else {
        menu.style.display = "block";
    }
}

function toggleBadgeMenu() {
    var badgeMenu = document.getElementById('badge-dropdown-menu');
    if (badgeMenu.style.display === "block") {
        badgeMenu.style.display = "none";
    } else {
        badgeMenu.style.display = "block";
    }
}

// Optional: Close menu if clicked outside
window.onclick = function(event) {
    var menu = document.getElementById('dropdown-menu');
    var badgeMenu = document.getElementById('badge-dropdown-menu');
    
    if (!event.target.matches('.menu-icon') && !event.target.matches('.badge-icon')) {
        if (menu.style.display === "block") {
            menu.style.display = "none";
        }
        if (badgeMenu.style.display === "block") {
            badgeMenu.style.display = "none";
        }
    }
}
