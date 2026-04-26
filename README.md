# ⚡️ nicheFiles | Modern React + Sanity Blog
<img width="1898" height="864" alt="image" src="https://github.com/user-attachments/assets/1ee58697-4ba9-466f-838b-226334ee813d" />

A lightning-fast, custom-built personal blog template powered by React, Vite, Sanity.io (Headless CMS), and Vercel Serverless Functions. 

This project was built to provide a seamless writing experience without the bloat of a traditional backend. It features a completely custom frontend, real-time GitHub commit tracking, and a secure serverless architecture for live view counters.

![Live Demo(https://nichefiles.vercel.app/)] 
## ✨ Key Features

* **Headless CMS:** Content is managed via a fully customized Sanity Studio, complete with a rich-text editor and syntax highlighting for code blocks.
* **Secure Serverless View Counter:** Uses Vercel Serverless API routes (`/api`) to securely increment page views in the Sanity database without exposing secret API tokens to the frontend browser.
* **Live GitHub Commit Tracker:** Fetches and displays real-time repository commit counts directly from the GitHub API.
* **Admin Writing Mode:** A hidden, password-protected gateway in the header to easily access the Sanity Studio deployment.
* **SPA Routing & Truncation:** Seamless client-side navigation via React Router, with smart title truncation for a clean UI layout.

## 🛠️ Tech Stack

* **Frontend:** React, Vite, CSS Modules, React Router
* **Backend/CMS:** Sanity.io, GROQ
* **Serverless API:** Vercel Functions (Node.js)
* **Text Rendering:** `@portabletext/react`, `react-syntax-highlighter`
* **Deployment:** Vercel

---

## 🚀 Getting Started (Local Development)

If you want to fork this project and use it as your own blog, follow these steps to connect it to your own fresh database.

### 1. Clone the repository
```bash
git clone [https://github.com/ekrishnakishor/nichefiles.git](https://github.com/ekrishnakishor/nichefiles.git)
cd YOUR_REPO_NAME

```

2. Set up your Sanity Database (CMS)
To write your own posts, you need your own Sanity project.

Create a free account at Sanity.io.

Navigate to the studio folder and install dependencies:

Bash
```
cd nichefiles-studio
yarn install
Initialize a new project connected to your account:
```

Bash
```
npx sanity init
Once created, find your new projectId in your sanity.config.js file.
```

3. Configure the Frontend
Navigate back to the root directory and install the frontend dependencies:
```
Bash
cd ..
yarn install
Update the Sanity client to point to your new database. Open src/client.js and replace the projectId:
```

JavaScript
```
export const client = createClient({
  projectId: 'YOUR_NEW_PROJECT_ID', 
  dataset: 'production',
  useCdn: true, 
  apiVersion: '2024-04-07',
});
```

4. Environment Variables
Create a .env file in the root of your project and add the following variables.

Note: You can generate a Sanity API Token by going to your Sanity project dashboard on the web -> API -> Tokens -> Add New Token (Editor permissions).

Code snippet
```
# Required for the secure Vercel view-counter API
SANITY_API_TOKEN=skYourSecretSanityTokenHere
```

# Required for the hidden frontend writer login
```
VITE_ADMIN_PASSWORD=YourCustomPasswordHere
```

5. Start the Development Server
Important: Because this project uses Vercel Serverless Functions for the view counter, you must use the Vercel CLI to run the project locally (standard yarn dev will not run the API folder).

Install the CLI if you haven't already:

Bash
```
npm i -g vercel
Then, start the server:
```

Bash
```
npx vercel dev
```
Your app will now be running on http://localhost:3000 with both the React frontend and the secure backend API fully synced!

🚢 Deployment
This project is optimized for deployment on Vercel.

Push your code to a GitHub repository.

Import the project into Vercel.

Add your Environment Variables (SANITY_API_TOKEN and VITE_ADMIN_PASSWORD) in the Vercel Project Settings.

Deploy!

(Note: The repository includes a vercel.json file which automatically handles SPA routing rules so you won't get a 404 error when refreshing a blog post page).

👨‍💻 Author
Built by Krishnakishor (Malavika Sajeesh).
Always exploring new ways to build fast, beautiful web experiences. Let's connect!

🌐 Portfolio: krishna-one-zeta.vercel.app

💼 LinkedIn: eruvatkrishna

🐙 GitHub: ekrishnakishor


