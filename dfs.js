import PathFinder from "./PathFinder.js";

class DepthFirstSearch extends PathFinder {
    getSolutionPath (maze) {
        
        let node = [1,0]
        const stack = [[node]]
        const visited = ['1;0']
        const path = []
        while (stack.length>0) {
            const currentPath = stack.pop()
            const headNode = currentPath[currentPath.length-1]
            path.push(headNode)
            const neighbours = this.getUnvisitedNeighbours(maze,headNode,visited)
            for (let neighbour of neighbours) {
                
                stack.push([...currentPath,neighbour])
                visited.push(`${neighbour[0]};${neighbour[1]}`)
                if (this.isGoal(maze,neighbour)) {
                    const solution = stack[stack.length-1]
                    return {
                        'solution': solution,
                        'path': path,
                        'totalNodesChecked': path.length
                    }
                }
            }
        }
    }
}

export default DepthFirstSearch