class Maze {
    constructor(size) {

        this.size = Math.max(Math.min(size % 2 == 0 ? size+1 : size,151), 11);
        this.maze = []
        this.goal = [Math.floor(Math.random()*(this.size-1)/2)*2+1,Math.floor(Math.random()*(this.size-1)/2)*2+1]
        for (let i=0; i<this.size; i++) {
            this.maze.push(Array(this.size).fill(1))
        }

        this.maze[1][0] = 0

        for (let i=1; i<this.size; i+=2) {
            for (let j=1; j<this.size; j+=2) {
                this.maze[i][j] = 0
            }
        }
        this.paths = this.createPath()   
    }

    removeWallBetweenNodes(node1,node2) {
        const wallNode = [(node1[0] + node2[0])/2,(node1[1] + node2[1])/2] 
        this.maze[wallNode[0]][wallNode[1]] = 0
    }

    getUnvisitedNeighbours = (node,visited) => {
        const neighbours = []
        const directions = [[2,0],[0,2],[-2,0],[0,-2]]
        for (let d of directions) {
            const newNode = [node[0]+d[0],node[1]+d[1]]
            if (newNode[0] > 0 && newNode[0] < this.size-1 && newNode[1] > 0 && newNode[1] < this.size-1) {
                const nodeString = `${newNode[0]};${newNode[1]}`
                if (!visited.includes(nodeString)) {
                    neighbours.push(newNode)
                    
                }
            }
        }
        return neighbours
    }

    createPath(recursionCount=1) {
        
        const manhattenDistanceToGoal = (node) => {
            return Math.abs(this.goal[0] - node[0]) + Math.abs(this.goal[1] - node[1]) 
        }
        const visited = ['1;1']
        const path = [[1,1]]
        let node = [1,1]
        let onEdge = true
        let previouslyOnEdge = true
        while (manhattenDistanceToGoal(node) > 0) {

            const neighbours = this.getUnvisitedNeighbours(node,visited)
            
            const closerNeighbours = []
            const fartherNeighbours = []
            for (let n of neighbours) {
                
                if (manhattenDistanceToGoal(n) < manhattenDistanceToGoal(node)) {
                    
                    if (this.getUnvisitedNeighbours(n,visited).length > 0 || manhattenDistanceToGoal(n)===0) { //check it is not a dead end node
                        closerNeighbours.push(n)
                    }
                    
                } else {
                    if (this.getUnvisitedNeighbours(n,visited).length > 0) { 
                        fartherNeighbours.push(n)
                    }
                }
            }
            if (closerNeighbours.concat(fartherNeighbours).length === 0 ) {
                break
            }
                
                
            if ((fartherNeighbours.length === 0) || ( closerNeighbours.length > 0 && Math.random() < Math.min(0.47+3*path.length/(this.size*100),0.65) ) ) {
                node = closerNeighbours[Math.floor(Math.random()*closerNeighbours.length)]
            } else if (onEdge && !previouslyOnEdge && closerNeighbours.length > 0) {
                node = closerNeighbours[Math.floor(Math.random()*closerNeighbours.length)]
            
            } else {
                node = fartherNeighbours[Math.floor(Math.random()*fartherNeighbours.length)]
            }

            previouslyOnEdge = onEdge
            //if the path hits an edge, the next node must be towards the goal or it will not be possible to complete a path.
            onEdge = (node[0]==1 || node[0]==this.size-2 || node[1]==1 || node[1]==this.size-2) ? true : false

            path.push(node)
            const nodeString = `${node[0]};${node[1]}`
            visited.push(nodeString)
        }

        if (manhattenDistanceToGoal(path[path.length-1]) == 0) {

            for (let i = 0; i<path.length-1; i++) {
                const node1 = path[i] 
                const node2 = path[i+1] 
                this.removeWallBetweenNodes(node1,node2)
            }
            const branches = this.createAllBranches(path)
            branches.unshift(path)
            return branches
        } else {
            return this.createPath(recursionCount+1)
            
        }
    }

    getBranchHeads(path,nodesAlreadyConnected) {
        const branchHeads = []
        for (let node of path) {
            if (this.getUnvisitedNeighbours(node,nodesAlreadyConnected).length > 0) {
                branchHeads.push(node)
            }
        }
        return branchHeads
    }

    createBranch(head,branchHeads,nodesAlreadyConnected) {
        let nextNode
        let unvisitedNeighbours = this.getUnvisitedNeighbours(head,nodesAlreadyConnected)
        const path = [head]
        while (unvisitedNeighbours.length > 0 ) {
            
            nextNode = unvisitedNeighbours[Math.floor(Math.random()*unvisitedNeighbours.length)]
            
            nodesAlreadyConnected.push(`${nextNode[0]};${nextNode[1]}`)
            this.removeWallBetweenNodes(path[path.length-1],nextNode)
            path.push(nextNode)
            unvisitedNeighbours = this.getUnvisitedNeighbours(nextNode,nodesAlreadyConnected)
        }
        
        const branchHeadsFromNewBranch = this.getBranchHeads(path,nodesAlreadyConnected)
        for (let branchHead of branchHeadsFromNewBranch) {
            branchHeads.push(branchHead)
        }
        return path
    }

    createAllBranches(path) {
        const nodesAlreadyConnected = []
        const paths = []
        for (let node of path) {
            nodesAlreadyConnected.push(`${node[0]};${node[1]}`)
        }
        
        const branchHeads = this.getBranchHeads(path,nodesAlreadyConnected)
        
        while (branchHeads.length > 0) {
            paths.push(this.createBranch(branchHeads.shift(),branchHeads,nodesAlreadyConnected))
        }

        return paths
    }

}


export default Maze