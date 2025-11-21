document.addEventListener("DOMContentLoaded", function () {
    const navLinks = document.querySelectorAll("nav ul li a");

    // Check which page is active on load
    navLinks.forEach(link => {
        if (link.href === window.location.href) {
            link.classList.add("active");
        }
    });

    navLinks.forEach(link => {
        link.addEventListener("click", function () {
            // Remove "active" class from all links
            navLinks.forEach(nav => nav.classList.remove("active"));

            // Add "active" class to the clicked link
            this.classList.add("active");
        });
    });
});

document.addEventListener("DOMContentLoaded", function() {
    function updateGMTTime() {
        const gmtTimeElement = document.getElementById("gmtTime");
        if (gmtTimeElement) {
            const now = new Date();

            // Extract date components and ensure two-digit format
            const year = now.getUTCFullYear();
            const month = String(now.getUTCMonth() + 1).padStart(2, '0'); // Add 1 to month and format
            const day = String(now.getUTCDate()).padStart(2, '0');
            const hours = String(now.getUTCHours()).padStart(2, '0');
            const minutes = String(now.getUTCMinutes()).padStart(2, '0');
            const seconds = String(now.getUTCSeconds()).padStart(2, '0');

            // Format to "YYYY-MM-DD HH:MM:SS GMT"
            const formattedTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds} GMT`;

            gmtTimeElement.innerText = formattedTime;
        }
    }

    // Update every second
    setInterval(updateGMTTime, 1000);
    updateGMTTime();
});
