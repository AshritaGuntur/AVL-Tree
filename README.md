# AVL Tree Visualizer 🌳
An interactive web-based tool to visualize **AVL Trees** (Adelson-Velsky and Landis). This project helps you understand how self-balancing binary search trees maintain their height and performance through rotations.
## 🌟 Features
- **Automatic Balancing**: Watch the tree restructure itself in real-time to keep `O(log n)` height.
- **Visualized Rotations**: See **Left**, **Right**, **Left-Right**, and **Right-Left** rotations happen step-by-step.
- **Detailed Operation Log**: A side panel provides educational commentary on every decision (e.g., "Imbalance detected at Node 30, BF: 2. Fixing with Right Rotation...").
- **Premium UI**: Clean, dark-themed interface with smooth node transitions and dynamic SVG connectors.
## 🛠️ Tech Stack
- **HTML5**: Semantic layout.
- **CSS3**: Advanced animations and glassmorphism styling.
- **JavaScript (ES6+)**: Custom AVL Tree implementation with recursive balancing logic and DOM-based rendering.
## 🚀 Getting Started
1.  **Clone the repository**.
2.  Open **[index.html](cci:7://file:///c:/Users/ashri/.gemini/antigravity/playground/ionized-armstrong/index.html:0:0-0:0)** in your web browser.
3.  Read the "How it Works" guide on the landing page.
4.  Click **"Launch Visualizer"** to start building your tree.
## 📚 How it Works
An AVL Tree is a **Binary Search Tree** where the difference in height between left and right subtrees (Balance Factor) is at most 1.
1.  **Insertion**: Nodes are added like a normal BST.
2.  **Backtracking**: The algorithm checks the height of every ancestor.
3.  **Balancing**: If a node's Balance Factor becomes `+2` or `-2`, a specific rotation is performed to restore balance.
## 📸 Usage
- **Insert**: Add a number to the tree.
- **Delete**: Remove a number (watching the tree rebalance if necessary).
- **Reset**: Clear the canvas and start over.
- **Logs**: Follow the "Operation Log" on the left to learn the *why* behind every move.
