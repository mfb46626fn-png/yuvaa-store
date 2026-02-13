---
description: Build the project and push changes to git if successful
---

1. Run the build command
   > npm run build

2. If the build was successful, add all changes to git
   > git add .

3. Commit the changes (Prompt user for commit message if not provided, otherwise use a default or descriptive one based on context)
   > git commit -m "chore: formatting and build updates"

4. Push the changes to the main branch
   > git push origin main
