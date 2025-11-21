/*function quickStrategyRedirect() {
    window.location.href = "{% url 'botbuilder:index' %}?quickStrategy=true";
}*/
/*
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
*/

/*
document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("uploadFromComputerBtn");
    const fileInput = document.getElementById("fileInput");

    // 🔘 Trigger file picker when button is clicked
    btn.addEventListener('click', () => fileInput.click());

    // 📥 Load and inject XML to Blockly workspace
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            try {
                const xmlText = reader.result;
                console.log('📄 XML File Content:', xmlText);

                const xmlDom = Blockly.utils.xml.textToDom(xmlText);

                // Make sure 'workspace' is already defined in your script
                Blockly.Xml.domToWorkspace(xmlDom, workspace);

                alert(`✅ Successfully loaded "${file.name}"`);
            } catch (err) {
                alert('❌ Failed to load XML. Make sure it’s a valid Blockly file.');
                console.error(err);
            }
        };

        reader.readAsText(file);
    });
});
*/

document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("uploadFromComputerBtn");
    const fileInput = document.getElementById("fileInput");

    btn.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            try {
                const xmlText = reader.result;

                // ✅ Save XML to localStorage
                localStorage.setItem("botbuilder_pending_xml", xmlText);

                // ✅ Navigate to Bot Builder page
                window.location.href = "/botbuilder/";  // Or `{% url 'botbuilder:index' %}` rendered into JS
            } catch (err) {
                alert('❌ Failed to read XML.');
                console.error(err);
            }
        };

        reader.readAsText(file);
    });
});
/*
document.addEventListener("DOMContentLoaded", function () {
    const icon = document.getElementById("uploadIcon");
    if (!icon) return; // skip if not on this page

    const largeSrc = icon.dataset.largeSrc;
    const smallSrc = icon.dataset.smallSrc;

    function updateIcon() {
        icon.src = window.innerWidth < 700 ? smallSrc : largeSrc;
    }

    // Run on load
    updateIcon();

    // Run on window resize
    window.addEventListener("resize", updateIcon);
});
*/