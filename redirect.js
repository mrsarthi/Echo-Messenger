/* Echo Messenger Download Link Redirection Script */

document.addEventListener('DOMContentLoaded', () => {
    const OWNER = 'mrsarthi';
    const REPO = 'Echo-Messenger';
    const CACHE_KEY = 'echo_latest_release';
    const CACHE_EXPIRY_MS = 60 * 60 * 1000; // 1 hour caching
    
    const fallbackUrl = `https://github.com/${OWNER}/${REPO}/releases/latest`;
    
    const androidBtn = document.getElementById('btn-android');
    const windowsBtn = document.getElementById('btn-windows');

    // Function to update button hrefs
    function updateDownloadUrls(apkUrl, exeUrl) {
        if (apkUrl && androidBtn) {
            androidBtn.setAttribute('href', apkUrl);
        }
        if (exeUrl && windowsBtn) {
            windowsBtn.setAttribute('href', exeUrl);
        }
    }

    // Try loading cached download links
    const cachedData = localStorage.getItem(CACHE_KEY);
    if (cachedData) {
        try {
            const parsed = JSON.parse(cachedData);
            const now = Date.now();
            
            // Check if cache is still valid
            if (now - parsed.timestamp < CACHE_EXPIRY_MS) {
                updateDownloadUrls(parsed.apkUrl, parsed.exeUrl);
                return; // Use cache and skip network fetch
            }
        } catch (e) {
            // Clear corrupted cache
            localStorage.removeItem(CACHE_KEY);
        }
    }

    // Fetch latest release details from GitHub API
    fetch(`https://api.github.com/repos/${OWNER}/${REPO}/releases/latest`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`GitHub API returned status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            let apkUrl = '';
            let exeUrl = '';

            if (data.assets && Array.isArray(data.assets)) {
                // Find matching binary assets
                data.assets.forEach(asset => {
                    if (asset.browser_download_url) {
                        const url = asset.browser_download_url;
                        if (url.endsWith('.apk')) {
                            apkUrl = url;
                        } else if (url.endsWith('.exe')) {
                            exeUrl = url;
                        }
                    }
                });
            }

            // Fallback to general release URL if specific assets were not found in release
            apkUrl = apkUrl || fallbackUrl;
            exeUrl = exeUrl || fallbackUrl;

            // Update DOM
            updateDownloadUrls(apkUrl, exeUrl);

            // Cache results
            localStorage.setItem(CACHE_KEY, JSON.stringify({
                timestamp: Date.now(),
                apkUrl: apkUrl,
                exeUrl: exeUrl
            }));
        })
        .catch(error => {
            console.warn('Unable to resolve latest release from GitHub API:', error);
            // Hrefs are already pre-populated with fallback URLs in index.html,
            // but we explicitly ensure they are set to fallback here in case of error.
            updateDownloadUrls(fallbackUrl, fallbackUrl);
        });
});
