const _supabase = supabase.createClient(
    'https://opixidygpndbfuisjkrk.supabase.co', 
    'sb_publishable_N6RdTgjgUHQbdtvPX9uPqA_VTraUegI'
);

let isSignup = false;

// 1. Navigation Logic
function showSection(id) {
    document.querySelectorAll('section').forEach(s => s.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
    if (id === 'users') fetchUsers();
}

function toggleSignup() {
    isSignup = !isSignup;
    document.getElementById('username').classList.toggle('hidden');
    document.getElementById('form-title').innerText = isSignup ? 'Create Account' : 'Login';
    document.getElementById('main-btn').innerText = isSignup ? 'Sign Up' : 'Sign In';
}

// 2. Authentication Logic
async function handleAuth() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const username = document.getElementById('username').value;

    if (isSignup) {
        // Sign Up
        const { data, error } = await _supabase.auth.signUp({ email, password });
        if (error) return alert(error.message);
        
        // Add to public profiles table
        await _supabase.from('profiles').insert([{ id: data.user.id, username: username }]);
        alert("Account created! Check your email for verification.");
    } else {
        // Login
        const { error } = await _supabase.auth.signInWithPassword({ email, password });
        if (error) alert(error.message);
        else alert("Logged in!");
    }
}

// 3. Fetch All Users
async function fetchUsers() {
    const { data, error } = await _supabase.from('profiles').select('username');
    const container = document.getElementById('user-grid');
    container.innerHTML = '';

    if (data) {
        data.forEach(user => {
            const card = document.createElement('div');
            card.className = 'user-card';
            card.innerHTML = `
                <p>@${user.username}</p>
                <a href="/u/${user.username}" style="color:var(--primary); font-size: 12px;">View Profile</a>
            `;
            container.appendChild(card);
        });
    }
}