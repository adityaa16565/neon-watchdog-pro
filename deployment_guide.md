# Neon Watchdog Pro: Global Deployment Guide

Follow these steps to deploy the Neon Watchdog Pro administrative portal to a live environment using GitHub and Vercel.

## 1. Prepare Your Repository
1.  **Create a New Repo:** Go to [GitHub](https://github.com) and create a new private or public repository.
2.  **Push Code:**
    ```bash
    git init
    git add .
    git commit -m "Initial release: Neon Watchdog Pro"
    git remote add origin https://github.com/YOUR_USERNAME/neon-watchdog-pro.git
    git branch -M main
    git push -u origin main
    ```

## 2. Deploy to Vercel
1.  **Login to Vercel:** Go to [vercel.com](https://vercel.com) and sign in with GitHub.
2.  **Import Project:** Click **Add New** -> **Project** and select your `neon-watchdog-pro` repository.
3.  **Configure Framework:** Vercel should automatically detect **Vite**.
4.  **Set Environment Variables:**
    Expand the "Environment Variables" section and add the following keys from your local `.env` file:
    - `VITE_SUPABASE_URL`
    - `VITE_SUPABASE_ANON_KEY`
    - `VITE_EMAILJS_SERVICE_ID`
    - `VITE_EMAILJS_TEMPLATE_ID`
    - `VITE_EMAILJS_PUBLIC_KEY`
5.  **Deploy:** Click **Deploy**. Your site will be live at `https://your-project-name.vercel.app`.

## 3. Post-Deployment Setup
1.  **Supabase Authentication:**
    - Go to your Supabase Dashboard -> **Authentication** -> **URL Configuration**.
    - Add your Vercel URL (e.g., `https://neon-watchdog-pro.vercel.app`) to the **Redirect URLs** list. This is required for the Password Reset flow to work correctly.
2.  **EmailJS:**
    - Ensure your EmailJS account is active and the template matches the fields used in the code (`to_email`, `passcode`, `time`).

## 4. Academic Presentation Tips
- **Clean UI:** The "Simulate Breach" and "Demo Generation" buttons have been removed for a professional look.
- **Live Data:** Use the **User Management** section to add a few real records during the demo to show database connectivity.
- **Security Flow:** Demonstrate the **Password Reset** and **OTP** flows to highlight the multi-layered security architecture.
