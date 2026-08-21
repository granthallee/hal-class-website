// Main tab switching
document.querySelectorAll("#nav li").forEach(function(navEl) {
    navEl.onclick = function() { 
        toggleMainTab(this.id, this.dataset.target); 
    }
});

function toggleMainTab(selectedNav, targetId) {
    // Update main tab active states
    var navEls = document.querySelectorAll("#nav li");
    navEls.forEach(function(navEl) {
        if (navEl.id == selectedNav) {
            navEl.classList.add("is-active");
        } else {
            navEl.classList.remove("is-active");
        }
    });

    // Show/hide main tab panes
    var tabs = document.querySelectorAll(".tab-pane");
    tabs.forEach(function(tab) {
        if (tab.id == targetId) {
            tab.classList.add("is-active");
        } else {
            tab.classList.remove("is-active");
        }
    });
}

// Sub-tab switching
function setupSubTabs(subnavId) {
    document.querySelectorAll(`#${subnavId} li`).forEach(function(navEl) {
        navEl.onclick = function() {
            toggleSubTab(subnavId, this.id, this.dataset.target);
        }
    });
}

function toggleSubTab(subnavId, selectedNav, targetId) {
    // Update sub-tab active states
    var navEls = document.querySelectorAll(`#${subnavId} li`);
    navEls.forEach(function(navEl) {
        if (navEl.id == selectedNav) {
            navEl.classList.add("is-active");
        } else {
            navEl.classList.remove("is-active");
        }
    });

    // Show/hide sub-tab panes
    var subTabs = document.querySelectorAll(".subtab-pane");
    subTabs.forEach(function(tab) {
        if (tab.id == targetId) {
            tab.classList.add("is-active");
        } else {
            tab.classList.remove("is-active");
        }
    });
}

// Initialize sub-tabs
setupSubTabs("world-subnav");
setupSubTabs("us-subnav");