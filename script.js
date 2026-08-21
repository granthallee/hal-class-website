function renderBlog() {
    const container = document.getElementById('content-container');
    
    container.innerHTML = `
        <!-- WORLD HISTORY SECTION -->
        <div id="world-history" class="tab-pane is-active">
            <div class="tab-content">
                <div class="tabs is-toggle is-centered is-small" id="world-subnav">
                    <ul>${generateSubTabs('world')}</ul>
                </div>
                ${generateSubContent('world')}
            </div>
        </div>
        
        <!-- US HISTORY SECTION -->
        <div id="us-history" class="tab-pane">
            <div class="tab-content">
                <div class="tabs is-toggle is-centered is-small" id="us-subnav">
                    <ul>${generateSubTabs('us')}</ul>
                </div>
                ${generateSubContent('us')}
            </div>
        </div>
    `;
    
    initializeTabs();
}

// Generate sub-tabs
function generateSubTabs(section) {
    const content = section === 'world' ? blogContent.worldHistory : blogContent.usHistory;
    return Object.entries(content).map(([key, value], index) => `
        <li class="${index === 0 ? 'is-active' : ''}" id="${key}-tab" data-target="${key}">
            <a><span class="icon"><i class="${value.icon || 'fas fa-book'}"></i></span><span>${value.title}</span></a>
        </li>
    `).join('');
}

// Generate sub-content with preview cards
function generateSubContent(section) {
    const content = section === 'world' ? blogContent.worldHistory : blogContent.usHistory;
    return Object.entries(content).map(([key, value], index) => `
        <div id="${key}" class="subtab-pane ${index === 0 ? 'is-active' : ''}">
            <h2 class="title is-3 is-spaced mb-4">${value.title}</h2>
            ${generatePreviewCards(value.posts, key)}
        </div>
    `).join('');
}

// Generate preview cards
function generatePreviewCards(posts, topicId) {
    if (!posts || posts.length === 0) {
        return `
            <div class="coming-soon">
                <span class="icon is-large"><i class="fas fa-hourglass-half fa-3x"></i></span>
                <h2 class="title is-3 is-spaced mt-4">Coming Soon</h2>
                <p class="subtitle is-5">Content will be added in the future.</p>
            </div>
        `;
    }
    
    return `
        <div class="posts-container">
            ${posts.map(post => `
                <div class="card preview-card" onclick="openPost('${post.contentFile}', '${post.title}')">
                    ${post.image ? `
                        <div class="card-image">
                            <figure class="image is-4by3">
                                <img src="${post.image}" alt="${post.title}">
                            </figure>
                        </div>
                    ` : ''}
                    <div class="card-content">
                        <p class="title is-5 is-spaced">${post.title}</p>
                        <p class="subtitle is-6">${post.excerpt || 'Click to read more...'}</p>
                        ${post.date ? `<time datetime="${post.date}">${formatDate(post.date)}</time>` : ''}
                    </div>
                    <footer class="card-footer">
                        <span class="card-footer-item">
                            <span class="icon"><i class="fas fa-book-open"></i></span>
                            <span>Read</span>
                        </span>
                    </footer>
                </div>
            `).join('')}
        </div>
    `;
}

// Open post in modal
async function openPost(contentFile, title) {
    const modal = document.getElementById('post-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalContent = document.getElementById('modal-content');
    
    // Set title
    modalTitle.textContent = title;
    
    // Show loading state
    modalContent.innerHTML = `
        <div class="has-text-centered p-6">
            <span class="icon is-large"><i class="fas fa-spinner fa-pulse fa-3x"></i></span>
            <p>Loading content...</p>
        </div>
    `;
    
    // Open modal
    modal.classList.add('is-active');
    document.documentElement.classList.add('is-clipped');
    
    try {
        // Load content
        const response = await fetch(contentFile);
        const html = await response.text();
        modalContent.innerHTML = html;
    } catch (error) {
        console.error('Error loading post:', error);
        modalContent.innerHTML = `
            <div class="notification is-danger">
                <p>Error loading content. Please try again.</p>
            </div>
        `;
    }
}

// Close modal
function closeModal() {
    const modal = document.getElementById('post-modal');
    modal.classList.remove('is-active');
    document.documentElement.classList.remove('is-clipped');
}

// Close modal on background click
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('post-modal');
    const modalBackground = modal.querySelector('.modal-background');
    
    modalBackground.addEventListener('click', closeModal);
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('is-active')) {
            closeModal();
        }
    });
    
    // Render the blog
    renderBlog();
});

// Format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Initialize tabs
function initializeTabs() {
    document.querySelectorAll("#nav li").forEach(function(navEl) {
        navEl.onclick = function() { 
            toggleMainTab(this.id, this.dataset.target); 
        }
    });
    
    setupSubTabs("world-subnav");
    setupSubTabs("us-subnav");
}

// Tab functions
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