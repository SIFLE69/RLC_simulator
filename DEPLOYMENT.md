# Vercel Deployment Guide

## Quick Deploy to Vercel

### Method 1: Deploy via Vercel Dashboard (Easiest)

1. **Create a GitHub Repository**
   - Go to [GitHub](https://github.com)
   - Create a new repository (e.g., `rlc-circuit-simulator`)
   - Don't initialize with README (we already have files)

2. **Push Your Code to GitHub**
   ```bash
   # Initialize git (if not already done)
   git init
   
   # Add all files
   git add .
   
   # Commit
   git commit -m "Initial commit: RLC Circuit Simulator"
   
   # Add remote repository (replace with your repo URL)
   git remote add origin https://github.com/YOUR_USERNAME/rlc-circuit-simulator.git
   
   # Push to GitHub
   git branch -M main
   git push -u origin main
   ```

3. **Deploy on Vercel**
   - Go to [Vercel](https://vercel.com)
   - Sign up/Login (you can use GitHub account)
   - Click **"Add New Project"**
   - Click **"Import Git Repository"**
   - Select your `rlc-circuit-simulator` repository
   - Click **"Import"**
   - Configure project:
     - **Framework Preset**: Other (or leave as detected)
     - **Root Directory**: `./` (default)
     - **Build Command**: Leave empty (it's a static site)
     - **Output Directory**: Leave empty
   - Click **"Deploy"**
   - Wait 30-60 seconds for deployment
   - Your app will be live at `https://your-project-name.vercel.app`

---

### Method 2: Deploy via Vercel CLI (Advanced)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   # Navigate to your project folder
   cd d:\vscod\web\RLC_simulator
   
   # Deploy to Vercel
   vercel
   ```
   
   - Follow the prompts:
     - Set up and deploy? **Y**
     - Which scope? Select your account
     - Link to existing project? **N**
     - Project name? Press Enter or type a name
     - In which directory is your code located? `./ `
     - Want to override settings? **N**
   
   - Wait for deployment
   - You'll get a deployment URL

4. **Deploy to Production**
   ```bash
   vercel --prod
   ```

---

### Method 3: Drag & Drop (Super Quick)

1. **Create a deployment folder**
   - Make sure these files are in your folder:
     - `index.html`
     - `style.css`
     - `script.js`

2. **Go to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Login/Signup
   - Go to dashboard
   - Drag and drop your `RLC_simulator` folder onto the Vercel dashboard
   - Wait for deployment
   - Done!

---

## Post-Deployment

### Custom Domain (Optional)

1. In Vercel Dashboard, go to your project
2. Click **"Settings"** → **"Domains"**
3. Add your custom domain
4. Follow DNS configuration instructions

### Update Your Site

**If deployed via GitHub:**
```bash
# Make changes to your code
git add .
git commit -m "Update: description of changes"
git push
```
Vercel will automatically redeploy!

**If deployed via CLI:**
```bash
vercel --prod
```

---

## Important Files Structure

Your project should have this structure:
```
RLC_simulator/
├── index.html
├── style.css
├── script.js
└── README.md (optional)
```

---

## Environment Variables (If Needed)

If you need environment variables:
1. Go to Project Settings
2. Click **"Environment Variables"**
3. Add variables as needed

---

## Troubleshooting

### Issue: Page shows 404
**Solution**: Ensure `index.html` is in the root directory

### Issue: Styles not loading
**Solution**: Check that CSS/JS file paths in `index.html` are relative (not absolute)

### Issue: Fonts not loading
**Solution**: Ensure Google Fonts CDN link is in `<head>` of `index.html`

---

## Performance Tips

1. **Enable Vercel Analytics** (optional)
   - Go to Project Settings → Analytics
   - Enable Web Analytics

2. **Optimize Images** (if you add any)
   - Use WebP format
   - Compress images before uploading

3. **Cache Headers**
   - Vercel automatically optimizes caching for static files

---

## Useful Commands

```bash
# Check deployment status
vercel list

# View deployment logs
vercel logs

# Remove a project
vercel remove project-name

# Link local project to Vercel project
vercel link
```

---

## Free Tier Limits

Vercel Free Plan includes:
- ✅ Unlimited deployments
- ✅ 100 GB bandwidth/month
- ✅ Automatic HTTPS
- ✅ Custom domains
- ✅ Preview deployments
- ✅ Analytics

Perfect for your RLC Circuit Simulator!

---

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Support](https://vercel.com/support)
- [Community Forum](https://github.com/vercel/vercel/discussions)
