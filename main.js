import Maze from "./maze.js";
import DepthFirstSearch from "./dfs.js";
import BreadthFirstSearch from "./bfs.js";

let size = 51
let carveInterval
let solveInterval
let maze
const removeWallBetweenNodes = (node1,node2) => {
    const wallNode = [[(node1[0] + node2[0])/2],[(node1[1] + node2[1])/2]] 
    const node1Display = document.getElementById(`${node1[1]};${node1[0]}`)
    const node2Display = document.getElementById(`${node2[1]};${node2[0]}`)
    const wallNodeDisplay = document.getElementById(`${wallNode[1]};${wallNode[0]}`)
    node1Display.classList.remove('wall')
    node2Display.classList.remove('wall')
    wallNodeDisplay.classList.remove('wall')
    node1Display.classList.add('path')
    node2Display.classList.add('path')
    wallNodeDisplay.classList.add('path')
}

const createBlankMaze = () =>{
    // creates a blank template to create a new maze
    document.getElementById('solveinfo').innerHTML = ""
    const mazeDisplay = document.getElementById('maze')
    mazeDisplay.innerHTML= ''
    mazeDisplay.style['width'] = `${5*size}px`
    let y = 0
    while (y<size) {
        let x = 0
        while (x < size) {
            
            let b = document.createElement('div')
            if (x == 0 && y == 1) {
                b.classList.add('path')
            } else if (x == maze.goal[1] && y == maze.goal[0]){
                b.classList.add('goal')
            } else {
                b.classList.add('wall')
            }
            
            b.id = `${x};${y}`
            mazeDisplay.appendChild(b)
            x+=1
        }
    y+=1
    }
}


const animateMaze = () => {
    // animates the drawing of a new mze
    
    clearInterval(carveInterval)
    clearInterval(solveInterval)

    maze = new Maze(size)
    createBlankMaze()

    const mazeDisplay = document.getElementById('maze')
    mazeDisplay.style['width'] = `${5*maze.size}px`

    
    let x = 0
    let y = 0

    carveInterval = setInterval(()=>{
        const node1 = maze.paths[x][y] 
        const node2 = maze.paths[x][y+1]
        const node3 = maze.paths[x][y+2]
        if (node2) {
            removeWallBetweenNodes(node1,node2)
            y+=2
        }
        if (node3) {
            removeWallBetweenNodes(node2,node3)
        } else {
            if (x >= maze.paths.length-1) {
                clearInterval(carveInterval)
            }
            y=0
            x++
        }
    },1)
    
}

const newMaze = () => {
    //instantly creates a new maze
    clearInterval(carveInterval)
    clearInterval(solveInterval)
    
    maze = new Maze(size)
    document.getElementById('solveinfo').innerHTML = ""

    const mazeDisplay = document.getElementById('maze')
    mazeDisplay.innerHTML=''
    mazeDisplay.style['width'] = `${5*size}px`
    let y = 0
    maze.maze.forEach((row)=> {
        let x = 0
        row.forEach((node)=>{
            
            let b = document.createElement('div')
            b.classList.add(node === 1 ? 'wall' : 'path')
            b.id = `${x};${y}`
            mazeDisplay.appendChild(b)
            x+=1
        })
    y+=1
    })
    const goal = document.getElementById(`${maze.goal[1]};${maze.goal[0]}`)
    goal.classList.remove('path')
    goal.classList.add('goal')
}

const removeSolutionFromMaze = () => {
    // removes the solution from the maze
    const exploredNodes = document.querySelectorAll(".explored");
    const pathNodes = document.querySelectorAll(".path");

    exploredNodes.forEach((node) => {
        node.classList.remove('explored')
        node.classList.add('path')
    })
    pathNodes.forEach((node) => {
        node.classList.remove('finalPath')
        node.classList.add('path')
    })
}

const animateSolution = (solution) => {
    //animates hte solution and paths
    clearInterval(solveInterval)

    removeSolutionFromMaze()
    let i = 0
    let showingFinal = false
    let path = solution.path
    solveInterval = setInterval(()=>{

        if (i >= path.length) {
            if (showingFinal) {
                clearInterval(solveInterval)
                
                return
            } 
            i = 0
            path = solution.solution.reverse()
            showingFinal = true
        }

        let node = path[i]

        const nodeDisplay = document.getElementById(`${node[1]};${node[0]}`)
        nodeDisplay.classList.remove('explored')
        nodeDisplay.classList.add(showingFinal ? 'finalPath' : 'explored')
        i++
    },1)
    
}

const showSolution = (solution) => {
    //instantly shows the solution and paths
    clearInterval(solveInterval)

    removeSolutionFromMaze()
    
    for (let node of solution.path) {
        const nodeDisplay = document.getElementById(`${node[1]};${node[0]}`)
        nodeDisplay.classList.remove('explored')
        nodeDisplay.classList.add('explored')
    }

    for (let node of solution.solution.reverse()) {
        const nodeDisplay = document.getElementById(`${node[1]};${node[0]}`)
        nodeDisplay.classList.remove('explored')
        nodeDisplay.classList.add('finalPath')
    }
    
}

const selectAlgorithm = (str) => {
    switch(str) {
        case 'dfs':
            return new DepthFirstSearch
            break;
        case 'bfs':
            return new BreadthFirstSearch
            break;
    }
}

const solverButtonHandler = (drawFunction) => {
    const algorithmSelect = document.getElementById('algoSelect')
    const solver = selectAlgorithm(algorithmSelect.value)
    const solution = solver.getSolutionPath(maze)
    drawFunction(solution)
    document.getElementById('solveinfo').innerHTML = `Runtime: ${solution.runtime} ms <br> Nodes Checked: ${solution.totalNodesChecked} <br> Path Length: ${solution.solution.length}`
}

const sizeSelect = document.getElementById('sizeSelect')
sizeSelect.oninput = ()=>{
    const intSize = Number(sizeSelect.value)
    const newSize = intSize % 2 == 0 ? intSize+1 : intSize
    const newMin = Math.min(newSize,151)
    size=Math.max(newMin, 11);
    sizeSelect.nextElementSibling.value=size
}

const animateButton = document.getElementById('start')
animateButton.addEventListener('click', ()=> {
    animateMaze ()    
})

const newButton = document.getElementById('new')
newButton.addEventListener('click', ()=> {
    newMaze()    
})



const solveButton = document.getElementById('animate-solve')
solveButton.addEventListener('click', ()=> {
    solverButtonHandler(animateSolution)
})

const instantSolveButton = document.getElementById('instant-solve')
instantSolveButton.addEventListener('click', ()=> {
    solverButtonHandler(showSolution)
})

newMaze()