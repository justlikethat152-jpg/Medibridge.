// backend.js - Your connection to the Supabase backend

const SUPABASE_URL = 'https://onhhtezyuxfwhiqnssia.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9uaGh0ZXp5dXhmd2hpcW5zc2lhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwNjY0NDksImV4cCI6MjA3MzY0MjQ0OX0.WOSopFa6wBP5VahR81NQPSHz4JLlLzdbdsRwR2Fmu38';

// Initialize the Supabase client with a unique name
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * =========================================
 * AUTHENTICATION FUNCTIONS
 * =========================================
 */

// Sign up a new user
async function signUp(email, password) {
    const { data, error } = await supabaseClient.auth.signUp({
        email: email,
        password: password,
    });
    if (error) {
        alert("Error signing up: " + error.message);
        return null;
    }
    alert("Sign up successful! Please check your email to verify.");
    return data.user;
}

// Sign in an existing user
async function signIn(email, password) {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: email,
        password: password,
    });
    if (error) {
        alert("Error signing in: " + error.message);
        return null;
    }
    alert("Signed in successfully!");
    // You might want to refresh the page or redirect the user here
    return data.user;
}

// Sign out the current user
async function signOut() {
    const { error } = await supabaseClient.auth.signOut();
    if (error) {
        alert("Error signing out: " + error.message);
    } else {
        alert("Signed out successfully!");
        // You might want to refresh the page or redirect the user here
    }
}

/**
 * =========================================
 * PRESCRIPTION FUNCTIONS
 * =========================================
 */

// Upload a prescription file
async function uploadPrescription(file) {
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
        alert("You must be logged in to upload a prescription.");
        return;
    }
    if (!file) {
        alert("Please select a file to upload.");
        return;
    }

    const filePath = `${user.id}/${Date.now()}_${file.name}`; // Creates a unique path for the file

    const { error } = await supabaseClient.storage
        .from('prescriptions')
        .upload(filePath, file);

    if (error) {
        alert("Error uploading file: " + error.message);
    } else {
        alert("Prescription uploaded successfully!");
    }
}

/**
 * =========================================
 * NOTES FUNCTIONS
 * =========================================
 */

// Save a new note for the logged-in user
async function saveNote(noteContent) {
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
        alert("You must be logged in to save a note.");
        return;
    }
    if (!noteContent.trim()) {
        alert("Note cannot be empty.");
        return;
    }

    const { data, error } = await supabaseClient
        .from('notes')
        .insert([{ user_id: user.id, content: noteContent }]);

    if (error) {
        alert("Error saving note: " + error.message);
    } else {
        alert("Note saved successfully!");
    }
}

// Get all notes for the logged-in user
async function getNotes() {
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
        alert("You must be logged in to view notes.");
        return [];
    }

    const { data, error } = await supabaseClient
        .from('notes')
        .select('content, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    if (error) {
        alert("Error fetching notes: " + error.message);
        return [];
    }
    return data;
}

/**
 * =========================================
 * REMEDIES & DOCTORS FUNCTIONS
 * =========================================
 */

// Get the list of all Ayurvedic remedies
async function getRemedies() {
    // Fetching from the new 'ayurvedic_remedies' table
    const { data, error } = await supabaseClient.from('ayurvedic_remedies').select('*');
    if (error) {
        alert("Error fetching remedies: " + error.message);
        return [];
    }
    return data;
}

// Get the list of all doctors
async function getDoctors() {
    const { data, error } = await supabaseClient.from('doctors').select('*');
    if (error) {
        alert("Error fetching doctors: " + error.message);
        return [];
    }
    return data;
}
