const map = document.getElementById('map');
const nodes = [];

let startNode = null;
let endNode = null;

let creatingStartNode = false;
let creatingEndNode = false;
let creatingWall = false;

document.getElementById('start-btn').addEventListener('click', () => {
    creatingStartNode = true;
    creatingEndNode = false;
    creatingWall = false;
});

document.getElementById('end-btn').addEventListener('click', () => {
    creatingEndNode = true;
    creatingStartNode = false;
    creatingWall = false;
});

document.getElementById('wall-btn').addEventListener('click', () => {
    creatingWall = true;
    creatingStartNode = false;
    creatingEndNode = false;
});

function restart() {
    location.reload();
  }
  

for (let i = 0; i < 20; i++) {
    nodes[i] = [];
    for (let j = 0; j < 20; j++) {
        const node = document.createElement('div');
        node.className = 'node';
        node.setAttribute('data-row', i);
        node.setAttribute('data-col', j);

        let startNodeCreated = false;
        let endNodeCreated = false;

        node.addEventListener('click', () => {
            if (creatingStartNode && !startNodeCreated) {
                startNode = { row: i, col: j };
                node.classList.add('start');
                creatingStartNode = false;
                startNodeCreated = true;
            } else if (creatingEndNode && !endNodeCreated) {
                endNode = { row: i, col: j };
                node.classList.add('end');
                creatingEndNode = false;
                endNodeCreated = true;
            } else if (creatingWall) {
                node.classList.add('wall');
                nodes[i][j].state = 'wall';
            }
        });
        map.appendChild(node);
        nodes[i][j] = { row: i, col: j, state: 'empty', cost: Infinity, parent: null };
    }
}
document.getElementById('find-path-btn').addEventListener('click', () => {
    if (startNode && endNode) {
        const path = dijkstra(nodes, startNode, endNode);
        if (path) {
            for (let i = 0; i < path.length; i++) {
                const node = map.querySelector(`[data-row="${path[i].row}"][data-col="${path[i].col}"]`);
                node.classList.add('path');
            }
        }
    }else if (startNode == null) {
        console.log(startNode);
        const divError = document.querySelector('.error');
        divError.innerHTML = 'Indique o inicio.';
    }else{
        console.log(endNode);
        const divError = document.querySelector('.error');
        divError.innerHTML = 'Indique o fim.';
    }
});

document.getElementById('find-path-btn').addEventListener('click', () => {
    const path = dijkstra(nodes, startNode, endNode);
    if (path) {
        for (let i = 0; i < path.length; i++) {
            const node = map.querySelector(`[data-row="${path[i].row}"][data-col="${path[i].col}"]`);
            node.classList.add('path');
        }
    }
});

function dijkstra(nodes, startNode, endNode) {
    const queue = [];
    nodes[startNode.row][startNode.col].cost = 0;
    queue.push(nodes[startNode.row][startNode.col]);
    while (queue.length > 0) {
        queue.sort((a, b) => a.cost - b.cost);
        const current = queue.shift();
        if (current.row === endNode.row && current.col === endNode.col) {
            const path = [];
            let node = current;
            while (node) {
                path.unshift(node);
                node = node.parent;
            }
            return path;
        }
        if (current.state !== 'visited') {
            current.state = 'visited';
            const neighbors = getNeighbors(nodes, current.row, current.col);
            for (let i = 0; i < neighbors.length; i++) {
                const neighbor = neighbors[i];
                const cost = current.cost + getDistance(current, neighbor);
                if (cost < neighbor.cost) {
                    neighbor.cost = cost;
                    neighbor.parent = current;
                    queue.push(neighbor);
                }
            }
        }
    }
    return null;
}

function getNeighbors(nodes, row, col) {
    const neighbors = [];
    if (row > 0) neighbors.push(nodes[row - 1][col]);
    if (row < nodes.length - 1) neighbors.push(nodes[row + 1][col]);
    if (col > 0) neighbors.push(nodes[row][col - 1]);
    if (col < nodes[0].length - 1) neighbors.push(nodes[row][col + 1]);
    return neighbors.filter((neighbor) => neighbor.state !== 'wall');
}

function getDistance(nodeA, nodeB) {
    const dx = Math.abs(nodeA.col - nodeB.col);
    const dy = Math.abs(nodeA.row - nodeB.row);
    return Math.sqrt(dx * dx + dy * dy);
}