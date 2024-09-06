// Toggle password visibility
function togglePassword() {
    const passwordField = document.getElementById("password");
    const passwordFieldType = passwordField.getAttribute("type");
    if (passwordFieldType === "password") {
        passwordField.setAttribute("type", "text");
    } else {
        passwordField.setAttribute("type", "password");
    }
}

// Handle form submission
document.getElementById('signup-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const result = await response.json();

        if (result.success) {
            alert('Signup successful!');
            // Redirect to profile page
            window.location.href = 'profile.html';
        } else {
            alert('Signup failed: ' + result.message);
        }
    } catch (error) {
        alert('Signup failed: Server error');
    }
});
