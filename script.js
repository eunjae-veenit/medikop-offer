/* ==========================================
   COUNTDOWN TIMER
========================================== */

const targetDate = new Date("August 15, 2026 23:59:59").getTime();

function updateCountdown() {

    const now = new Date().getTime();

    const distance = targetDate - now;

    if (distance < 0) {

        document.getElementById("days").innerHTML = "00";
        document.getElementById("hours").innerHTML = "00";
        document.getElementById("minutes").innerHTML = "00";
        document.getElementById("seconds").innerHTML = "00";

        return;

    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));

    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById("days").innerHTML = String(days).padStart(2, "0");
    document.getElementById("hours").innerHTML = String(hours).padStart(2, "0");
    document.getElementById("minutes").innerHTML = String(minutes).padStart(2, "0");
    document.getElementById("seconds").innerHTML = String(seconds).padStart(2, "0");

}

setInterval(updateCountdown, 1000);

updateCountdown();


/* ==========================================
   CONFETTI
========================================== */

const container = document.getElementById("confetti-container");

const colors = [
    "#FF9933",
    "#FFFFFF",
    "#138808",
    "#0A5EB0"
];

function createConfetti() {

    for (let i = 0; i < 140; i++) {

        const confetti = document.createElement("div");

        confetti.style.position = "fixed";

        confetti.style.width = Math.random() * 8 + 5 + "px";

        confetti.style.height = Math.random() * 15 + 8 + "px";

        confetti.style.left = Math.random() * 100 + "vw";

        confetti.style.top = "-20px";

        confetti.style.opacity = ".95";

        confetti.style.borderRadius = "3px";

        confetti.style.pointerEvents = "none";

        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];

        confetti.style.transform = `rotate(${Math.random() * 360}deg)`;

        const duration = Math.random() * 4 + 4;

        container.appendChild(confetti);

        confetti.animate([

            {
                transform: `translateY(0px) rotate(0deg)`,
                opacity: 1
            },

            {
                transform: `translateY(${window.innerHeight + 150}px) rotate(${Math.random() * 720}deg)`,
                opacity: 0.8
            }

        ], {

            duration: duration * 1000,

            iterations: 1,

            easing: "linear"

        });

        setTimeout(() => {

            confetti.remove();

        }, duration * 1000);

    }

}

window.onload = () => {

    createConfetti();

};


/* ==========================================
   CTA RIPPLE EFFECT & POPUP FORM
========================================== */

const button = document.getElementById("claimBtn");
const popup = document.getElementById("popupForm");
const closePopup = document.getElementById("closePopup");

const leadForm = document.getElementById("leadForm");
const nameInput = document.getElementById("name");
const mobileInput = document.getElementById("mobile");
const cityInput = document.getElementById("city");
const companyInput = document.getElementById("company");
const submitBtn = document.getElementById("submitBtn");
const submitSpinner = document.getElementById("submitSpinner");
const btnText = submitBtn.querySelector(".btn-text");

// Ripple effect on CTA button (keeping hover ripple behavior intact)
button.addEventListener("mousemove", function (e) {
    const x = e.offsetX;
    const y = e.offsetY;
    button.style.setProperty("--x", x + "px");
    button.style.setProperty("--y", y + "px");
});

// Show popup on CTA click (both hero button and navbar button)
document.querySelectorAll("#claimBtn, #navClaimBtn, .claim-trigger").forEach(btn => {
    btn.addEventListener("click", function (e) {
        e.preventDefault();
        popup.style.display = "flex";
    });
});

// Hide popup on close button click
closePopup.addEventListener("click", function () {
    popup.style.display = "none";
});

// Hide popup on outside click
window.addEventListener("click", function (e) {
    if (e.target === popup) {
        popup.style.display = "none";
    }
});

// Validate and process form submission
leadForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const nameVal = nameInput.value.trim();
    const mobileVal = mobileInput.value.trim();
    const cityVal = cityInput.value.trim();
    const companyVal = companyInput ? companyInput.value.trim() : "";

    // Reset validation state
    mobileInput.setCustomValidity("");

    // Validate mobile number is exactly 10 digits
    if (!/^\d{10}$/.test(mobileVal)) {
        mobileInput.setCustomValidity("Mobile number must be exactly 10 digits.");
        mobileInput.reportValidity();
        return;
    }

    // Disable input fields and show loading state
    nameInput.disabled = true;
    mobileInput.disabled = true;
    cityInput.disabled = true;
    if (companyInput) companyInput.disabled = true;
    submitBtn.disabled = true;
    btnText.style.display = "none";
    submitSpinner.style.display = "inline-block";

    // Generate Short 4-Digit Unique Medikop Token Code (e.g. MDK-8492)
    const randomTokenNum = Math.floor(1000 + Math.random() * 9000);
    const tokenId = `MDK-${randomTokenNum}`;

    // Prepare JSON payload
    const payload = {
        name: nameVal,
        mobile: mobileVal,
        city: cityVal,
        company: companyVal,
        tokenId: tokenId,
        token: tokenId,
        token_id: tokenId,
        date: new Date().toLocaleDateString('en-IN')
    };

    // Construct URL with query parameters as fallback for Google Apps Script e.parameter
    const baseUrl = "https://script.google.com/macros/s/AKfycbyiXSD04KYkmDKhRXcAeAnNX0LocR8ylil-4nzWjIVLvNOlhbIZ_YlVQ6bIUkz4esTN/exec";
    const queryParams = `?name=${encodeURIComponent(nameVal)}&mobile=${encodeURIComponent(mobileVal)}&city=${encodeURIComponent(cityVal)}&company=${encodeURIComponent(companyVal)}&tokenId=${encodeURIComponent(tokenId)}&token=${encodeURIComponent(tokenId)}`;
    const fullUrl = baseUrl + queryParams;

    // Send POST request to Google Apps Script Web App
    fetch(fullUrl, {
        method: "POST",
        headers: {
            "Content-Type": "text/plain;charset=utf-8"
        },
        body: JSON.stringify(payload)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to submit details. Please try again.");
            }
            return response.json();
        })
        .then(data => {
            if (data.status === "success") {
                // Hide the header and descriptive text inside popup
                const popupH2 = document.querySelector(".popup-box h2");
                const popupP = document.querySelector(".popup-box p");
                if (popupH2) popupH2.style.display = "none";
                if (popupP) popupP.style.display = "none";

                // Populate Personalized Thank You Name & Token Pass details
                const thankYouName = document.getElementById("thankYouName");
                const displayTokenCode = document.getElementById("displayTokenCode");
                const displayCustomerName = document.getElementById("displayCustomerName");
                const displayCustomerMobile = document.getElementById("displayCustomerMobile");
                const displayCustomerCity = document.getElementById("displayCustomerCity");

                if (thankYouName) thankYouName.textContent = nameVal;
                if (displayTokenCode) displayTokenCode.textContent = tokenId;
                if (displayCustomerName) displayCustomerName.textContent = nameVal;
                if (displayCustomerMobile) displayCustomerMobile.textContent = mobileVal;
                if (displayCustomerCity) displayCustomerCity.textContent = cityVal;

                // Setup Copy Token Button functionality
                const copyBtn = document.getElementById("copyTokenBtn");
                const copyBtnText = document.getElementById("copyBtnText");
                if (copyBtn) {
                    copyBtn.onclick = function () {
                        navigator.clipboard.writeText(tokenId).then(() => {
                            if (copyBtnText) copyBtnText.textContent = "Copied!";
                            setTimeout(() => {
                                if (copyBtnText) copyBtnText.textContent = "Copy";
                            }, 2000);
                        }).catch(() => {
                            alert(`Token ID: ${tokenId}`);
                        });
                    };
                }

                // Hide form and show Token Pass card
                leadForm.style.display = "none";
                const successMessage = document.getElementById("successMessage");
                if (successMessage) successMessage.style.display = "block";

                // Trigger celebratory confetti burst
                if (typeof createConfetti === "function") {
                    createConfetti();
                }
            } else {
                throw new Error(data.message || "Submission failed on server. Please try again.");
            }
        })
        .catch(error => {
            alert(error.message || "An unexpected error occurred. Please try again.");

            // Re-enable form fields for user to correct and try again
            nameInput.disabled = false;
            mobileInput.disabled = false;
            cityInput.disabled = false;
            if (companyInput) companyInput.disabled = false;
            submitBtn.disabled = false;
            btnText.style.display = "inline-block";
            submitSpinner.style.display = "none";
        });
});


/* ==========================================
/* ==========================================
   PARALLAX (Desktop fine-pointer only)
========================================== */

if (window.matchMedia("(pointer: fine)").matches) {
    document.addEventListener("mousemove", (e) => {
        const doctor = document.querySelector(".doctor");
        if (doctor) {
            const x = (window.innerWidth / 2 - e.clientX) / 45;
            const y = (window.innerHeight / 2 - e.clientY) / 45;
            doctor.style.transform = `translate(${x}px,${y}px)`;
        }
    });
}


/* ==========================================
   SCROLL REVEAL VIA CSS CLASS
========================================== */

const revealElements = document.querySelectorAll(".offer-card, .trust div, .claim-btn, .countdown-box");

if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => observer.observe(el));
} else {
    revealElements.forEach(el => el.classList.add("is-visible"));
}
