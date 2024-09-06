document.getElementById('signin-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:3000/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const result = await response.json();

        if (result.success) {
            window.location.href = 'home.html'; // Redirect to home page if signin is successful
        } else {
            alert(result.message); // Show error message if signin fails
        }
    } catch (error) {
        console.error('Error:', error);
    }
});
