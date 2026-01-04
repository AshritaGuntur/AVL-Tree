document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const treeContainer = document.getElementById('tree-container');
    const nodeValueInput = document.getElementById('node-value');
    const insertBtn = document.getElementById('insert-btn');
    const deleteBtn = document.getElementById('delete-btn');
    const resetBtn = document.getElementById('reset-btn');
    const stepLog = document.getElementById('step-log');

    // Canvas/SVG Layer
    const svgLayer = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgLayer.style.position = 'absolute';
    svgLayer.style.top = '0';
    svgLayer.style.left = '0';
    svgLayer.style.width = '100%';
    svgLayer.style.height = '100%';
    svgLayer.style.pointerEvents = 'none';
    svgLayer.style.zIndex = '1';
    treeContainer.appendChild(svgLayer);

    // Logger Utility
    const Logger = {
        clear: () => {
            stepLog.innerHTML = '';
        },
        add: (msg, type = 'info') => {
            const li = document.createElement('li');
            li.className = type;
            li.textContent = msg;
            stepLog.appendChild(li);
            stepLog.scrollTop = stepLog.scrollHeight;
        }
    };

    // State
    const avlTree = new AVLTree((msg, type) => {
        Logger.add(msg, type);
    });

    // Init
    nodeValueInput.focus();

    // Interactions
    insertBtn.addEventListener('click', () => {
        const val = parseInt(nodeValueInput.value);
        if (isNaN(val)) return;

        Logger.clear();
        Logger.add(`Starting insertion of ${val}...`, 'info');

        avlTree.insert(val);
        Logger.add(`Insertion complete. Tree balanced.`, 'success');

        renderTree(avlTree.root);

        nodeValueInput.value = '';
        nodeValueInput.focus();
    });

    deleteBtn.addEventListener('click', () => {
        const val = parseInt(nodeValueInput.value);
        if (isNaN(val)) return;

        Logger.clear();
        Logger.add(`Starting deletion of ${val}...`, 'info');

        avlTree.delete(val);
        Logger.add(`Deletion complete. Tree balanced.`, 'success');

        renderTree(avlTree.root);

        nodeValueInput.value = '';
        nodeValueInput.focus();
    });

    resetBtn.addEventListener('click', () => {
        avlTree.root = null;
        Logger.clear();
        Logger.add("Tree reset.", 'info');
        renderTree(avlTree.root);
    });

    // Render Logic
    function renderTree(root) {
        const existingNodes = document.querySelectorAll('.node');
        const activeIds = new Set();

        // Dynamic Spacing Logic
        const treeWidth = treeContainer.offsetWidth; // e.g. 800
        const startX = treeWidth / 2;
        const startY = 60;

        // Clear lines
        while (svgLayer.firstChild) {
            svgLayer.removeChild(svgLayer.firstChild);
        }

        traverseAndPlace(root, startX, startY, treeWidth / 4);

        // Remove stale
        existingNodes.forEach(node => {
            if (!activeIds.has(node.dataset.id)) {
                node.classList.add('removing');
                setTimeout(() => node.remove(), 500);
            }
        });

        function traverseAndPlace(node, x, y, offset) {
            if (!node) return;

            activeIds.add(node.id);
            let nodeEl = document.querySelector(`.node[data-id="${node.id}"]`);

            if (!nodeEl) {
                nodeEl = document.createElement('div');
                nodeEl.className = 'node adding';
                nodeEl.dataset.id = node.id;
                nodeEl.textContent = node.val;

                const metaDiv = document.createElement('div');
                metaDiv.className = 'node-meta';
                nodeEl.appendChild(metaDiv);

                treeContainer.appendChild(nodeEl);
                // Start at parent pos if possible? For now, start target pos to pop in.
                nodeEl.style.left = `${x}px`;
                nodeEl.style.top = `${y}px`;
            } else {
                nodeEl.classList.remove('adding');
                nodeEl.classList.remove('removing');
            }

            // UPDATE TEXT CONTENT logic
            nodeEl.innerHTML = '';
            nodeEl.dataset.id = node.id;
            nodeEl.appendChild(document.createTextNode(node.val));

            // Re-add Meta
            const metaDiv = document.createElement('div');
            metaDiv.className = 'node-meta';
            nodeEl.appendChild(metaDiv);

            // Meta Values
            const bf = avlTree.getBalanceFactor(node);
            const height = avlTree.getHeight(node);

            metaDiv.textContent = `H:${height} | BF:${bf}`;
            metaDiv.style.top = '-25px';

            // Color code BF
            if (bf === 0 || bf === 1 || bf === -1) {
                metaDiv.style.color = '#10b981'; // Green
            } else {
                metaDiv.style.color = '#ef4444'; // Red
            }

            // Animate
            setTimeout(() => {
                nodeEl.style.left = `${x}px`;
                nodeEl.style.top = `${y}px`;
            }, 10);

            // Lines
            if (node.left) {
                const childX = x - offset;
                const childY = y + 100;
                drawLine(x, y + 30, childX, childY - 30);
                traverseAndPlace(node.left, childX, childY, offset / 1.6); // Tune spread
            }

            if (node.right) {
                const childX = x + offset;
                const childY = y + 100;
                drawLine(x, y + 30, childX, childY - 30);
                traverseAndPlace(node.right, childX, childY, offset / 1.6);
            }
        }
    }

    function drawLine(x1, y1, x2, y2) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', x1);
        line.setAttribute('y1', y1);
        line.setAttribute('x2', x2);
        line.setAttribute('y2', y2);
        line.setAttribute('stroke', '#64748b');
        line.setAttribute('stroke-width', '2');
        svgLayer.appendChild(line);
    }
});
