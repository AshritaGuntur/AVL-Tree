class Node {
    constructor(val) {
        this.val = val;
        this.left = null;
        this.right = null;
        this.height = 1;
        this.id = Math.random().toString(36).substr(2, 9);
    }
}

class AVLTree {
    constructor(onLog) {
        this.root = null;
        this.onLog = onLog || console.log;
    }

    log(msg, type = 'info') {
        this.onLog(msg, type);
    }

    getHeight(node) {
        if (!node) return 0;
        return node.height;
    }

    updateHeight(node) {
        node.height = Math.max(this.getHeight(node.left), this.getHeight(node.right)) + 1;
    }

    getBalanceFactor(node) {
        if (!node) return 0;
        return this.getHeight(node.left) - this.getHeight(node.right);
    }

    rightRotate(y) {
        this.log(`PERFORMING RIGHT ROTATION on Node ${y.val}...`, 'action');
        const x = y.left;
        const T2 = x.right;

        // Perform rotation
        x.right = y;
        y.left = T2;

        this.log(`  - Node ${x.val} becomes new parent.`, 'info');
        this.log(`  - Node ${y.val} moves to right child.`, 'info');

        // Update heights
        this.updateHeight(y);
        this.updateHeight(x);

        return x;
    }

    leftRotate(x) {
        this.log(`PERFORMING LEFT ROTATION on Node ${x.val}...`, 'action');
        const y = x.right;
        const T2 = y.left;

        // Perform rotation
        y.left = x;
        x.right = T2;

        this.log(`  - Node ${y.val} becomes new parent.`, 'info');
        this.log(`  - Node ${x.val} moves to left child.`, 'info');

        // Update heights
        this.updateHeight(x);
        this.updateHeight(y);

        return y;
    }

    insert(val) {
        this.root = this._insert(this.root, val);
    }

    _insert(node, val) {
        if (!node) {
            this.log(`Reached leaf. Creating Node ${val}.`, 'info');
            return new Node(val);
        }

        if (val < node.val) {
            // this.log(`Value ${val} < ${node.val}, go Left.`, 'info');
            node.left = this._insert(node.left, val);
        } else if (val > node.val) {
            // this.log(`Value ${val} > ${node.val}, go Right.`, 'info');
            node.right = this._insert(node.right, val);
        } else {
            this.log(`Duplicate value ${val} ignored.`, 'warning');
            return node;
        }

        this.updateHeight(node);
        const balance = this.getBalanceFactor(node);

        // Check for Imbalance
        if (Math.abs(balance) > 1) {
            this.log(`IMBALANCE detected at ${node.val} (BF: ${balance}). Fixing...`, 'warning');

            // Left Left
            if (balance > 1 && this.getBalanceFactor(node.left) >= 0) {
                this.log(`Case: Left-Left (Child BF: ${this.getBalanceFactor(node.left)})`, 'warning');
                return this.rightRotate(node);
            }

            // Right Right
            if (balance < -1 && this.getBalanceFactor(node.right) <= 0) {
                this.log(`Case: Right-Right (Child BF: ${this.getBalanceFactor(node.right)})`, 'warning');
                return this.leftRotate(node);
            }

            // Left Right
            if (balance > 1 && this.getBalanceFactor(node.left) < 0) {
                this.log(`Case: Left-Right (Child BF: ${this.getBalanceFactor(node.left)})`, 'warning');
                this.log(`Step 1: Rotate Left on Child ${node.left.val}`, 'action');
                node.left = this.leftRotate(node.left);
                this.log(`Step 2: Rotate Right on Parent ${node.val}`, 'action');
                return this.rightRotate(node);
            }

            // Right Left
            if (balance < -1 && this.getBalanceFactor(node.right) > 0) {
                this.log(`Case: Right-Left (Child BF: ${this.getBalanceFactor(node.right)})`, 'warning');
                this.log(`Step 1: Rotate Right on Child ${node.right.val}`, 'action');
                node.right = this.rightRotate(node.right);
                this.log(`Step 2: Rotate Left on Parent ${node.val}`, 'action');
                return this.leftRotate(node);
            }
        }

        return node;
    }

    delete(val) {
        this.root = this._delete(this.root, val);
    }

    _delete(node, val) {
        if (!node) {
            this.log(`Value ${val} not found to delete.`, 'warning');
            return node;
        }

        if (val < node.val) {
            node.left = this._delete(node.left, val);
        } else if (val > node.val) {
            node.right = this._delete(node.right, val);
        } else {
            // Found node
            if ((!node.left) || (!node.right)) {
                let temp = node.left ? node.left : node.right;
                if (!temp) {
                    this.log(`Node ${val} is a leaf. Removing it.`, 'info');
                    temp = node;
                    node = null;
                } else {
                    this.log(`Node ${val} has one child. Promoting child ${temp.val}.`, 'info');
                    node = temp;
                }
            } else {
                let temp = this._minValueNode(node.right);
                this.log(`Node ${val} has two children. Swapping value with successor ${temp.val}.`, 'info');
                node.val = temp.val;
                // Important: We are deleting the successor from the right subtree
                this.log(`Recursively deleting successor ${temp.val} from right subtree...`, 'info');
                node.right = this._delete(node.right, temp.val);
            }
        }

        if (!node) return node;

        this.updateHeight(node);
        const balance = this.getBalanceFactor(node);

        // Rebalance
        if (Math.abs(balance) > 1) {
            this.log(`IMBALANCE detected at ${node.val} (BF: ${balance}) after deletion.`, 'warning');

            if (balance > 1 && this.getBalanceFactor(node.left) >= 0) {
                this.log(`Case: Left-Left. Performing Right Rotation on ${node.val}.`, 'action');
                return this.rightRotate(node);
            }
            if (balance > 1 && this.getBalanceFactor(node.left) < 0) {
                this.log(`Case: Left-Right. Performing Left-Right Rotation on ${node.val}.`, 'action');
                node.left = this.leftRotate(node.left);
                return this.rightRotate(node);
            }
            if (balance < -1 && this.getBalanceFactor(node.right) <= 0) {
                this.log(`Case: Right-Right. Performing Left Rotation on ${node.val}.`, 'action');
                return this.leftRotate(node);
            }
            if (balance < -1 && this.getBalanceFactor(node.right) > 0) {
                this.log(`Case: Right-Left. Performing Right-Left Rotation on ${node.val}.`, 'action');
                node.right = this.rightRotate(node.right);
                return this.leftRotate(node);
            }
        }

        return node;
    }

    _minValueNode(node) {
        let current = node;
        while (current.left) {
            current = current.left;
        }
        return current;
    }
}
