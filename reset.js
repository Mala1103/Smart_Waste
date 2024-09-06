document.getElementById('reset-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const passwordRequirements = [
        { regex: /.{8,}/, message: "At least 8 characters" },
        { regex: /[A-Z]/, message: "At least one uppercase (A-Z)" },
        { regex: /[a-z]/, message: "At least one lowercase (a-z)" },
        { regex: /\d/, message: "At least one digit (0-9)" },
        { regex: /[@#.!$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, message: "At least one special character (e.g., @, #, !)" }
    ];

    let valid = true;
    let errorMessages = [];

    passwordRequirements.forEach(requirement => {
        if (!requirement.regex.test(newPassword)) {
            valid = false;
            errorMessages.push(requirement.message);
        }
    });

    if (newPassword !== confirmPassword) {
        valid = false;
        errorMessages.push("Passwords do not match");
    }

    if (valid) {
        try {
            const response = await fetch('/api/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ newPassword })
            });

            const result = await response.json();

            if (result.success) {
                alert('Password reset successful!');
                // Redirect to login or another appropriate page
                window.location.href = 'index.html';
            } else {
                alert('Password reset failed: ' + result.message);
            }
        } catch (error) {
            alert('Password reset failed: Server error');
        }
    } else {
        alert('Password reset failed:\n' + errorMessages.join('\n'));
    }
});
